'use client'

import { useDraggable } from '@dnd-kit/core'
import { useState } from 'react'
import useBuilderStore from './BuilderStore'
import type { NodeType } from './types'

const items: { id: NodeType; label: string }[] = [
  { id: 'container', label: 'Container' },
  { id: 'row', label: 'Row' },
  { id: 'col', label: 'Column' },
  { id: 'hero', label: 'Hero / Jumbotron' },
  { id: 'text', label: 'Text' },
  { id: 'button', label: 'Button' }, { id: 'buttonGroup', label: 'Button group' },
  { id: 'alert', label: 'Alert' }, { id: 'accordion', label: 'Accordion' },
  { id: 'card', label: 'Card' },
  { id: 'carousel', label: 'Carousel' }, { id: 'close', label: 'Close button' },
  { id: 'collapse', label: 'Collapse' }, { id: 'dropdown', label: 'Dropdown' },
  { id: 'breadcrumb', label: 'Breadcrumb' },
  { id: 'nav', label: 'Nav / tabs' }, { id: 'navbar', label: 'Navbar' },
  { id: 'offcanvas', label: 'Offcanvas' },
  { id: 'badge', label: 'Badge' },
  { id: 'listgroup', label: 'List group' }, { id: 'pagination', label: 'Pagination' },
  { id: 'progress', label: 'Progress' }, { id: 'spinner', label: 'Spinner' },
  { id: 'toast', label: 'Toast' }, { id: 'modal', label: 'Modal' },
  { id: 'popover', label: 'Popover' }, { id: 'tooltip', label: 'Tooltip' },
  { id: 'placeholder', label: 'Placeholder' }, { id: 'table', label: 'Table' },
  { id: 'forminput', label: 'Form input' }, { id: 'inputgroup', label: 'Input group' },
  { id: 'floatingLabel', label: 'Floating label' }, { id: 'image', label: 'Image' },
  { id: 'figure', label: 'Figure' }, { id: 'ratio', label: 'Ratio' },
  { id: 'utility', label: 'Utilities / custom' },
]
const gridPresets = ['12', '4 4 4', '2 10', '3 9', '4 8', '6 6', '8 4', '9 3', '10 2', 'equals', '4 4 4 4', 'Horizontal', 'Mix and match', 'No gutters', 'Push and Pull', 'Nesting']

export default function ComponentLibrary(props: {
  onDragStart?: (id: string) => void
  onDragEnd?: () => void
}) {
  const [help, setHelp] = useState<string | null>(null)
  return (
    <div className="builder-toolbox">
      <h2 className="builder-toolbox-title">+ COMPONENTS <span>?</span></h2>
      <ToolSection title="GRID SYSTEM" helpKey="grid" onHelp={setHelp} items={items.filter((item) => ['container', 'row', 'col'].includes(item.id))} {...props} />
      <div className="builder-grid-presets" aria-label="Bootstrap grid presets">
        {gridPresets.map((preset) => <GridPreset key={preset} preset={preset} />)}
      </div>
      <ToolSection title="CONTENT" helpKey="content" onHelp={setHelp} items={items.filter((item) => ['hero', 'text', 'button', 'buttonGroup', 'alert', 'card', 'badge', 'utility'].includes(item.id))} {...props} />
      <ToolSection title="COMPONENTS" helpKey="components" onHelp={setHelp} items={items.filter((item) => ['accordion', 'carousel', 'close', 'collapse', 'dropdown', 'breadcrumb', 'nav', 'navbar', 'offcanvas', 'listgroup', 'pagination', 'progress', 'spinner', 'toast', 'modal', 'popover', 'tooltip', 'placeholder'].includes(item.id))} {...props} />
      <ToolSection title="FORMS & MEDIA" helpKey="forms" onHelp={setHelp} items={items.filter((item) => ['table', 'forminput', 'inputgroup', 'floatingLabel', 'image', 'figure', 'ratio'].includes(item.id))} {...props} />
      <div className="builder-toolbox-tip">Click to add, or drag any component into a Container, Row, or Column.</div>
      {help && <HelpPopup section={help} onClose={() => setHelp(null)} />}
    </div>
  )
}

function GridPreset({ preset }: { preset: string }) {
  const addGridPreset = useBuilderStore((state) => state.addGridPreset)
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `grid-preset-${preset}`,
    data: { preset },
  })
  return <button ref={setNodeRef} type="button" {...listeners} {...attributes} className={`builder-grid-preset ${isDragging ? 'opacity-50' : ''}`} onClick={() => addGridPreset(preset)}>{preset}<span className="builder-grid-drag">✥ Drag</span></button>
}

function ToolSection({ title, helpKey, onHelp, items, onDragStart, onDragEnd }: { title: string; helpKey: string; onHelp: (section: string) => void; items: typeof allItems; onDragStart?: (id: string) => void; onDragEnd?: () => void }) {
  return (
    <details className="builder-tool-section" open>
      <summary>+ {title} <button type="button" className="builder-help-button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onHelp(helpKey) }}>?</button></summary>
      <div className="builder-tool-section-items">
        {items.map((it) => <DraggableTile key={it.id} id={it.id} label={it.label} onDragStart={onDragStart} onDragEnd={onDragEnd} />)}
      </div>
    </details>
  )
}

function HelpPopup({ section, onClose }: { section: string; onClose: () => void }) {
  const content: Record<string, { title: string; text: string }> = {
    grid: { title: 'Grid system', text: 'Drag a Container, Row, or Column into the canvas. Rows fill the available width and their direct Columns sit side-by-side and wrap. Drop content inside a Column.' },
    content: { title: 'Content', text: 'These are visible Bootstrap content blocks such as buttons, alerts, cards, and text. Drag them into a Column to build your page.' },
    components: { title: 'Components', text: 'These are Bootstrap 5.2.3 interactive components. Add them to a Column, then use Edit to change their properties.' },
    forms: { title: 'Forms & media', text: 'Add Bootstrap form controls, tables, images, figures, and responsive ratios. Use Edit to configure each block.' },
  }
  const item = content[section]
  return (
    <div className="builder-help-popup" role="dialog" aria-modal="true">
      <div className="builder-help-card">
        <div className="builder-help-heading"><strong>{item.title}</strong><button type="button" onClick={onClose} aria-label="Close help">×</button></div>
        <p>{item.text}</p>
        <button type="button" className="builder-help-close" onClick={onClose}>Got it</button>
      </div>
    </div>
  )
}

const allItems: { id: NodeType; label: string }[] = [
  { id: 'container', label: 'Container' },
  { id: 'row', label: 'Row' },
  { id: 'col', label: 'Column' },
]

function DraggableTile({
  id,
  label,
  onDragStart,
  onDragEnd,
}: {
  id: NodeType
  label: string
  onDragStart?: (id: string) => void
  onDragEnd?: () => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id as string,
    data: { type: id }, // payload used by handleDragEnd
  })

  // click-to-add fallback
  const add = useBuilderStore.getState().addNode

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => add(id, null)}
      onDragStart={() => onDragStart?.(id as string)}
      onDragEnd={onDragEnd}
      className={`w-full text-left rounded-xl border px-3 py-2 bg-white hover:bg-slate-50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {label}
    </button>
  )
}
