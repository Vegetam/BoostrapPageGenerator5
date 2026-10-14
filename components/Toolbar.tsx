'use client'
import useBuilderStore from './BuilderStore'
import { serializeToHtml } from '@/lib/serialize'
import { download } from '@/lib/download'

type Device = 'lg' | 'md' | 'sm' | 'xs'
type Mode = 'edit' | 'developer' | 'preview'
type Theme = 'light' | 'dark'

export default function Toolbar({
  device,
  mode,
  theme,
  onDeviceChange,
  onModeChange,
  onThemeChange,
}: {
  device: Device
  mode: Mode
  theme: Theme
  onDeviceChange: (device: Device) => void
  onModeChange: (mode: Mode) => void
  onThemeChange: (theme: Theme) => void
}) {
  // niente destructuring dall’hook
  const s = (useBuilderStore as any)?.getState?.()
  const nodes = s?.nodes ?? {}
  const rootIds = s?.rootIds ?? []
  const clear = s?.clear ?? (() => {})

  const exportHtml = () => {
    const html = serializeToHtml(nodes, rootIds, theme)
    download('page.html', html)
  }

  return (
    <div className="builder-toolbar-actions">
      <div className="builder-toolbar-group">
        <button className={`builder-toolbar-button ${device === 'lg' ? 'builder-toolbar-button-active' : ''}`} title="Desktop canvas" onClick={() => onDeviceChange('lg')}>▣</button>
        <button className={`builder-toolbar-button ${device === 'md' ? 'builder-toolbar-button-active' : ''}`} title="Laptop canvas" onClick={() => onDeviceChange('md')}>▭</button>
        <button className={`builder-toolbar-button ${device === 'sm' ? 'builder-toolbar-button-active' : ''}`} title="Tablet canvas" onClick={() => onDeviceChange('sm')}>▯</button>
        <button className={`builder-toolbar-button ${device === 'xs' ? 'builder-toolbar-button-active' : ''}`} title="Mobile canvas" onClick={() => onDeviceChange('xs')}>▥</button>
      </div>
      <div className="builder-toolbar-group">
        <button className={`builder-toolbar-button ${mode === 'edit' ? 'builder-toolbar-button-active' : ''}`} onClick={() => onModeChange('edit')}>✎ Edit</button>
        <button className={`builder-toolbar-button ${mode === 'developer' ? 'builder-toolbar-button-active' : ''}`} onClick={() => onModeChange('developer')}>◉ Developer</button>
        <button className={`builder-toolbar-button ${mode === 'preview' ? 'builder-toolbar-button-active' : ''}`} onClick={() => onModeChange('preview')}>◉ Preview</button>
      </div>
      <div className="builder-toolbar-group">
        <button
          className={`builder-toolbar-button builder-theme-button ${theme === 'dark' ? 'builder-toolbar-button-active' : ''}`}
          title={theme === 'dark' ? 'Switch to light page' : 'Switch to dark page'}
          aria-label={theme === 'dark' ? 'Switch to light page' : 'Switch to dark page'}
          onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? '☀ Light' : '☾ Dark'}
        </button>
        <button className="builder-toolbar-button" onClick={() => clear()}>▣ Clear</button>
        <button className="builder-toolbar-button builder-download-button" onClick={exportHtml}>⌄ Download</button>
      </div>
    </div>
  )
}
