'use client'

import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { BuilderNode, NodeType } from './types'

export type BuilderState = {
  nodes: Record<string, BuilderNode>
  rootIds: string[]
  selectedId: string | null
  editingId: string | null
  addNode: (type: NodeType, parentId?: string | null) => string
  addGridPreset: (preset: string, parentId?: string | null) => string
  removeNode: (id: string) => void
  select: (id: string | null) => void
  edit: (id: string) => void
  closeEditor: () => void
  updateProps: (id: string, patch: Record<string, unknown>) => void
  clear: () => void
  load: (data: { nodes: Record<string, BuilderNode>; rootIds: string[] }) => void
}

const defaults: Record<NodeType, Record<string, unknown>> = {
  container: { fluid: false, align: '' }, row: { className: '', align: '', justify: '', gutters: '' }, col: { span: 'auto', sm: '', md: '', lg: '', xl: '', xxl: '', alignSelf: '', content: 'One of three columns' },
  hero: { title: 'Hello, Bootstrap!', text: 'Build a responsive page with Bootstrap.' },
  text: { text: 'Write something here.' }, button: { label: 'Button', variant: 'primary' },
  buttonGroup: { labels: ['One', 'Two'], variant: 'primary' }, alert: { text: 'A Bootstrap alert', variant: 'primary', dismissible: false },
  accordion: { items: ['First item', 'Second item'], open: 0 }, card: { title: 'Card title', text: 'Card content.' },
  carousel: { items: ['First slide', 'Second slide', 'Third slide'] }, close: { label: 'Close' },
  collapse: { label: 'Toggle content', text: 'Collapsible content', show: false }, dropdown: { label: 'Dropdown', items: ['Action', 'Another action'] },
  breadcrumb: { items: ['Home', 'Library', 'Data'] }, nav: { items: ['Active', 'Link', 'Another link'] },
  navbar: { brand: 'Navbar', items: ['Home', 'Features', 'Pricing'] }, offcanvas: { title: 'Offcanvas', text: 'Offcanvas content' },
  badge: { text: 'New', variant: 'secondary' }, listgroup: { items: ['An item', 'A second item'] },
  pagination: { pages: ['1', '2', '3'] }, progress: { value: 50, label: '' }, spinner: { variant: 'primary', type: 'border' },
  toast: { title: 'Bootstrap', text: 'Hello from a toast', show: true }, modal: { title: 'Modal title', text: 'Modal content' },
  popover: { label: 'Popover', title: 'Popover title', text: 'Popover content' }, tooltip: { label: 'Hover me', text: 'Tooltip' },
  placeholder: { lines: 3 }, table: { headers: ['#', 'First', 'Last'], rows: ['1|Mark|Otto', '2|Jacob|Thornton'] },
  forminput: { label: 'Email address', placeholder: 'name@example.com', type: 'email' },
  inputgroup: { prefix: '@', placeholder: 'Username' }, floatingLabel: { label: 'Email', placeholder: 'name@example.com' },
  image: { src: 'https://via.placeholder.com/800x400', alt: 'Placeholder image', fluid: true },
  figure: { src: 'https://via.placeholder.com/800x400', caption: 'A figure caption.' }, ratio: { ratio: '16x9', content: 'Responsive content' },
  utility: {
    className: 'p-3 border rounded bg-light text-dark',
    title: 'Custom Bootstrap utility',
    text: 'This preview uses utility classes. Edit the classes to change spacing, border, color, background, and text alignment.',
  },
}

const useBuilderStore = create<BuilderState>((set) => ({
  nodes: {}, rootIds: [], selectedId: null, editingId: null,
  addNode: (type, parentId = null) => {
    const id = nanoid()
    const node: BuilderNode = { id, type, props: { ...defaults[type] }, children: [], parentId }
    set((state) => {
      const nodes = { ...state.nodes, [id]: node }
      if (parentId && nodes[parentId]) {
        nodes[parentId] = { ...nodes[parentId], children: [...(nodes[parentId].children || []), id] }
        return { nodes, selectedId: id }
      }
      return { nodes, rootIds: [...state.rootIds, id], selectedId: id }
    })
    return id
  },
  addGridPreset: (preset, parentId = null) => {
    const id = nanoid()
    const rowId = id
    const layouts: Record<string, { spans: string[]; rowProps?: Record<string, unknown>; breakAfter?: number }> = {
      '12': { spans: ['12'] },
      '4 4 4': { spans: ['4', '4', '4'] },
      '2 10': { spans: ['2', '10'] },
      '3 9': { spans: ['3', '9'] },
      '4 8': { spans: ['4', '8'] },
      '6 6': { spans: ['6', '6'] },
      '8 4': { spans: ['8', '4'] },
      '9 3': { spans: ['9', '3'] },
      '10 2': { spans: ['10', '2'] },
      equals: { spans: ['auto', 'auto', 'auto', 'auto'], breakAfter: 2 },
      '4 4 4 4': { spans: ['auto', 'auto', 'auto', 'auto'] },
      Horizontal: { spans: ['sm-8', 'sm-auto', 'sm-auto', 'sm-auto'] },
      'Mix and match': { spans: ['md-8', '6-md-4', '6-md-4', '6-md-4', '6-md-4', '6-md-4', '6-md-4', '6-md-6', '6-md-6'] },
      'No gutters': { spans: ['12-sm-6-md-8', '6-md-4'], rowProps: { gutters: '0' } },
      'Push and Pull': { spans: ['md-9', 'md-3'], rowProps: { className: 'builder-push-pull' } },
      Nesting: { spans: ['sm-9'], rowProps: { nested: true } },
    }
    const layout = layouts[preset] || layouts['12']
    set((state) => {
      const nodes = { ...state.nodes }
      const children: string[] = []
      nodes[rowId] = { id: rowId, type: 'row', props: { ...defaults.row, ...layout.rowProps, preset, breakAfter: layout.breakAfter }, children, parentId }
      layout.spans.forEach((span, index) => {
        const columnId = nanoid()
        const parts = span.split('-')
        const props: Record<string, unknown> = { ...defaults.col, span: 'auto' }
        if (parts.length === 1 && /^\d+$/.test(parts[0])) props.span = parts[0]
        else if (span === 'auto') props.span = 'auto'
        else if (parts.length === 2 && parts[0] === 'sm') props.sm = parts[1]
        else if (parts.length === 2 && parts[0] === 'md') props.md = parts[1]
        else if (parts.length === 2 && parts[0] === '6') { props.span = '6'; props.md = parts[1] }
        else if (parts.length === 3) { props.span = parts[0]; props.sm = parts[1]; props.md = parts[2] }
        nodes[columnId] = { id: columnId, type: 'col', props, children: [], parentId: rowId }
        children.push(columnId)
        if (preset === 'Nesting' && index === 0) {
          const nestedRowId = nanoid()
          const nestedA = nanoid()
          const nestedB = nanoid()
          nodes[nestedRowId] = { id: nestedRowId, type: 'row', props: { ...defaults.row }, children: [nestedA, nestedB], parentId: columnId }
          nodes[nestedA] = { id: nestedA, type: 'col', props: { ...defaults.col, span: '8', sm: '6' }, children: [], parentId: nestedRowId }
          nodes[nestedB] = { id: nestedB, type: 'col', props: { ...defaults.col, span: '4', sm: '6' }, children: [], parentId: nestedRowId }
          nodes[columnId] = { ...nodes[columnId], children: [nestedRowId] }
        }
      })
      if (parentId && nodes[parentId]) {
        nodes[parentId] = { ...nodes[parentId], children: [...(nodes[parentId].children || []), rowId] }
        return { nodes, selectedId: rowId }
      }
      return { nodes, rootIds: [...state.rootIds, rowId], selectedId: rowId }
    })
    return rowId
  },
  removeNode: (id) => set((state) => {
    const nodes = { ...state.nodes }
    const remove = (nodeId: string) => {
      ;(nodes[nodeId]?.children || []).forEach(remove)
      delete nodes[nodeId]
    }
    const parentId = nodes[id]?.parentId
    remove(id)
    if (parentId && nodes[parentId]) nodes[parentId] = { ...nodes[parentId], children: (nodes[parentId].children || []).filter((child) => child !== id) }
    return { nodes, rootIds: state.rootIds.filter((rootId) => rootId !== id), selectedId: state.selectedId === id ? null : state.selectedId }
  }),
  select: (id) => set({ selectedId: id }),
  edit: (id) => set({ selectedId: id, editingId: id }),
  closeEditor: () => set({ editingId: null }),
  updateProps: (id, patch) => set((state) => ({
    nodes: {
      ...state.nodes,
      [id]: { ...state.nodes[id], props: { ...(state.nodes[id]?.props || {}), ...patch } },
    },
  })),
  clear: () => set({ nodes: {}, rootIds: [], selectedId: null, editingId: null }),
  load: (data) => set({ ...data, selectedId: null }),
}))

export default useBuilderStore
export { useBuilderStore }
