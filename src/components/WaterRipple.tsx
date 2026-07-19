import { useEffect, useRef } from 'react'
import './WaterRipple.css'

const SCALE = 0.5
const MAX_DIM = 800
const DECAY = 0.86
const TRAIL_STEP = 8
const CURSOR_RADIUS_PX = 88
const MAX_BUMP = 180

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

function createProgram(gl: WebGL2RenderingContext, vsSrc: string, fsSrc: string) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSrc)
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSrc)
  const program = gl.createProgram()!
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  return program
}

const VS = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FS = `#version 300 es
precision highp float;
uniform sampler2D uHeight;
uniform vec2 uTexel;
uniform vec2 uMouse;
uniform vec2 uVelocity;
uniform float uTime;
in vec2 vUv;
out vec4 outColor;

float caustic(vec2 uv, float h) {
  float c1 = sin((uv.x * 32.0 + h * 8.0 + uTime * 0.7)) * 0.5 + 0.5;
  float c2 = sin((uv.y * 36.0 - h * 6.0 - uTime * 0.5)) * 0.5 + 0.5;
  return pow(c1 * c2, 2.8);
}

void main() {
  float hC = texture(uHeight, vUv).r - 0.5;
  float hL = texture(uHeight, vUv - vec2(uTexel.x, 0.0)).r - 0.5;
  float hR = texture(uHeight, vUv + vec2(uTexel.x, 0.0)).r - 0.5;
  float hU = texture(uHeight, vUv + vec2(0.0, uTexel.y)).r - 0.5;
  float hD = texture(uHeight, vUv - vec2(0.0, uTexel.y)).r - 0.5;

  vec2 grad = vec2(hR - hL, hU - hD);
  float slope = length(grad);
  vec3 normal = normalize(vec3(grad * 26.0, 1.0));

  vec2 vel = length(uVelocity) > 0.001 ? normalize(uVelocity) : vec2(0.0, 1.0);
  vec3 lightDir = normalize(vec3(-vel.x * 0.55, -vel.y * 0.55, 0.82));
  vec3 halfDir = normalize(lightDir + vec3(0.0, 0.0, 1.0));

  float spec = pow(max(dot(normal, halfDir), 0.0), 88.0);
  float spec2 = pow(max(dot(normal, halfDir), 0.0), 20.0) * 0.35;
  float fresnel = pow(1.0 - clamp(normal.z, 0.0, 1.0), 4.0);
  float crest = smoothstep(0.002, 0.06, abs(hC) + slope * 0.45);

  float c = caustic(vUv + grad * 0.06, hC + slope) * slope;
  vec2 toMouse = uMouse - vUv;
  float mouseGlow = exp(-dot(toMouse, toMouse) * 14.0) * (slope + 0.08);

  vec3 color = vec3(0.0);
  color += vec3(0.94, 0.99, 1.0) * spec * 1.5;
  color += vec3(0.5, 0.84, 1.0) * spec2 * 1.6;
  color += vec3(0.38, 0.76, 1.0) * fresnel * (slope * 3.5 + crest * 0.75);
  color += vec3(0.28, 0.68, 0.96) * c * 0.95;
  color += vec3(0.75, 0.96, 1.0) * mouseGlow;

  float alpha = clamp(spec * 1.05 + fresnel * slope * 0.95 + c * 0.28 + crest * 0.18 + mouseGlow * 0.35, 0.0, 0.72);
  outColor = vec4(color, alpha);
}`

export default function WaterRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const velocityRef = useRef({ x: 0, y: 1 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false })
    if (!gl) return

    const program = createProgram(gl, VS, FS)
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const heightTex = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, heightTex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    const uHeight = gl.getUniformLocation(program, 'uHeight')
    const uTexel = gl.getUniformLocation(program, 'uTexel')
    const uTime = gl.getUniformLocation(program, 'uTime')
    const uMouse = gl.getUniformLocation(program, 'uMouse')
    const uVelocity = gl.getUniformLocation(program, 'uVelocity')

    let simW = 0
    let simH = 0
    let heightField: Float32Array | null = null
    let heightPixels: Uint8Array | null = null
    let frameId = 0
    let lastMouse = { x: -1, y: -1, t: 0 }
    const startTime = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)

      simW = Math.min(MAX_DIM, Math.max(200, Math.floor(window.innerWidth * SCALE)))
      simH = Math.min(MAX_DIM, Math.max(112, Math.floor(window.innerHeight * SCALE)))

      const size = simW * simH
      heightField = new Float32Array(size)
      heightPixels = new Uint8Array(size * 4)
    }

    const addBump = (clientX: number, clientY: number, strength: number) => {
      if (!heightField) return

      mouseRef.current = {
        x: clientX / window.innerWidth,
        y: 1 - clientY / window.innerHeight,
      }

      const cx = Math.floor((clientX / window.innerWidth) * simW)
      const cy = Math.floor((1 - clientY / window.innerHeight) * simH)
      const r = Math.max(6, Math.ceil((CURSOR_RADIUS_PX / window.innerWidth) * simW))

      for (let j = -r; j <= r; j++) {
        for (let i = -r; i <= r; i++) {
          const sx = cx + i
          const sy = cy + j
          if (sx < 1 || sy < 1 || sx >= simW - 1 || sy >= simH - 1) continue
          const dist = i * i + j * j
          if (dist > r * r) continue
          const idx = sy * simW + sx
          heightField[idx] += strength * Math.exp(-dist / (r * 0.45))
        }
      }
    }

    const strokeAlongPath = (x0: number, y0: number, x1: number, y1: number, speed: number) => {
      const dx = x1 - x0
      const dy = y1 - y0
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 0.5) {
        addBump(x1, y1, Math.min(MAX_BUMP, 40 + speed * 2.5))
        return
      }

      velocityRef.current = {
        x: dx / dist,
        y: -(dy / dist),
      }

      const strength = Math.min(MAX_BUMP, 36 + speed * 2.8)
      const step = Math.max(6, TRAIL_STEP - speed * 0.05)
      const count = Math.max(1, Math.ceil(dist / step))

      for (let i = 0; i <= count; i++) {
        const t = i / count
        const fade = 0.25 + t * 0.75
        addBump(x0 + dx * t, y0 + dy * t, strength * fade)
      }

      addBump(x1, y1, strength * 1.05)
    }

    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now()

      if (lastMouse.x < 0) {
        lastMouse = { x: e.clientX, y: e.clientY, t: now }
        addBump(e.clientX, e.clientY, 55)
        return
      }

      const dt = Math.max(1, now - lastMouse.t)
      const dx = e.clientX - lastMouse.x
      const dy = e.clientY - lastMouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const speed = (dist / dt) * 16

      strokeAlongPath(lastMouse.x, lastMouse.y, e.clientX, e.clientY, speed)
      lastMouse = { x: e.clientX, y: e.clientY, t: now }
    }

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      const now = performance.now()
      if (lastMouse.x < 0) {
        lastMouse = { x: touch.clientX, y: touch.clientY, t: now }
        addBump(touch.clientX, touch.clientY, 50)
        return
      }
      const dt = Math.max(1, now - lastMouse.t)
      const dist = Math.hypot(touch.clientX - lastMouse.x, touch.clientY - lastMouse.y)
      const speed = (dist / dt) * 16
      strokeAlongPath(lastMouse.x, lastMouse.y, touch.clientX, touch.clientY, speed)
      lastMouse = { x: touch.clientX, y: touch.clientY, t: now }
    }

    const tick = () => {
      if (!heightField || !heightPixels) {
        frameId = requestAnimationFrame(tick)
        return
      }

      for (let i = 0; i < heightField.length; i++) {
        heightField[i] *= DECAY
        if (Math.abs(heightField[i]) < 0.4) heightField[i] = 0
      }

      const maxH = 150
      for (let idx = 0; idx < heightField.length; idx++) {
        const norm = Math.min(255, Math.max(0, ((heightField[idx] / maxH) + 0.5) * 255))
        const px = idx * 4
        heightPixels[px] = norm
        heightPixels[px + 1] = norm
        heightPixels[px + 2] = norm
        heightPixels[px + 3] = 255
      }

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, heightTex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, simW, simH, 0, gl.RGBA, gl.UNSIGNED_BYTE, heightPixels)

      gl.useProgram(program)
      gl.uniform1i(uHeight, 0)
      gl.uniform2f(uTexel, 1 / simW, 1 / simH)
      gl.uniform1f(uTime, (performance.now() - startTime) / 1000)
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y)
      gl.uniform2f(uVelocity, velocityRef.current.x, velocityRef.current.y)
      gl.bindVertexArray(vao)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      frameId = requestAnimationFrame(tick)
    }

    resize()
    tick()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="water-ripple" aria-hidden="true" />
}
