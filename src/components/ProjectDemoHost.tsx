import type { ProjectItem } from '../data/projects'
import { asset } from '../utils/asset'
import DemoShell from './DemoShell'
import { renderReactDemo } from './InteractiveDemos'
import './ProjectDemoHost.css'

interface ProjectDemoHostProps {
  project: ProjectItem
  overrideSrc?: string
  overrideReactId?: string
}

export default function ProjectDemoHost({
  project,
  overrideSrc,
  overrideReactId,
}: ProjectDemoHostProps) {
  const { demo, title, preview } = project
  const shellTitle = preview.urlBar || title
  const src = overrideSrc ?? demo.src
  const reactId = overrideReactId ?? demo.reactId
  const isIframe = demo.kind === 'iframe' && !!src
  const iframeSrc = src ? asset(src) : undefined

  return (
    <div className={`project-demo project-demo--${demo.frame}`}>
      <DemoShell frame={demo.frame} title={shellTitle}>
        {isIframe && iframeSrc ? (
          <iframe
            key={iframeSrc}
            title={`${title} 交互演示`}
            src={iframeSrc}
            className="project-demo__iframe"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        ) : (
          <div key={reactId} className="project-demo__react">
            {renderReactDemo(reactId || '')}
          </div>
        )}
      </DemoShell>
    </div>
  )
}
