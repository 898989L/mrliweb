import './Atmosphere.css'

/** 电影感氛围光晕 —— 参考 MotionSites 类站点的景深背景 */
export default function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere__orb atmosphere__orb--a" />
      <div className="atmosphere__orb atmosphere__orb--b" />
      <div className="atmosphere__orb atmosphere__orb--c" />
      <div className="atmosphere__beam" />
      <div className="atmosphere__noise" />
    </div>
  )
}

