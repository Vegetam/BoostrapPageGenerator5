'use client'
import { useEffect } from 'react'
import useBuilderStore from './BuilderStore'

export default function PropertiesPanel() {
  const editingId = useBuilderStore(s=>s.editingId)
  const node = useBuilderStore(s=> editingId ? s.nodes[editingId] : null)
  const update = useBuilderStore(s=>s.updateProps)
  const close = useBuilderStore(s=>s.closeEditor)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [close])
  if (!node) return null
  const p = node.props || {}
  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-3" onMouseDown={close}>
        <div className="builder-properties-panel w-[min(20rem,calc(100vw-1.5rem))] max-h-[75vh] overflow-auto rounded-lg border border-slate-200 bg-white p-3 shadow-xl" onMouseDown={(e)=>e.stopPropagation()}>
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2"><h2 className="text-sm font-semibold text-slate-800">Edit {node.type}</h2><button className="rounded p-1 text-lg leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-800" onClick={close} aria-label="Close">×</button></div>
      {node.type === 'container' && (<Toggle label="Fluid" checked={!!p.fluid} onChange={(v)=>update(node.id, { fluid: v })} />)}
      {node.type === 'row' && (<><Select label="Vertical alignment" value={p.align || ''} options={['','start','center','end','baseline','stretch']} onChange={(v)=>update(node.id, { align: v })} /><Select label="Horizontal alignment" value={p.justify || ''} options={['','start','center','end','between','around','evenly']} onChange={(v)=>update(node.id, { justify: v })} /><Select label="Gutter size" value={p.gutters || ''} options={['','0','1','2','3','4','5']} onChange={(v)=>update(node.id, { gutters: v })} /><Text label="Additional classes" value={p.className || ''} onChange={(v)=>update(node.id, { className: v })} /></>)}
      {node.type === 'col' && (<><Select label="Default width" value={p.span ?? 'auto'} options={['auto','1','2','3','4','5','6','7','8','9','10','11','12']} onChange={(v)=>update(node.id, { span: v })} /><Select label="Small (sm)" value={p.sm || ''} options={['','1','2','3','4','5','6','7','8','9','10','11','12']} onChange={(v)=>update(node.id, { sm: v })} /><Select label="Medium (md)" value={p.md || ''} options={['','1','2','3','4','5','6','7','8','9','10','11','12']} onChange={(v)=>update(node.id, { md: v })} /><Select label="Large (lg)" value={p.lg || ''} options={['','1','2','3','4','5','6','7','8','9','10','11','12']} onChange={(v)=>update(node.id, { lg: v })} /><Select label="Extra large (xl)" value={p.xl || ''} options={['','1','2','3','4','5','6','7','8','9','10','11','12']} onChange={(v)=>update(node.id, { xl: v })} /><Select label="XXL" value={p.xxl || ''} options={['','1','2','3','4','5','6','7','8','9','10','11','12']} onChange={(v)=>update(node.id, { xxl: v })} /><Select label="Self alignment" value={p.alignSelf || ''} options={['','start','center','end']} onChange={(v)=>update(node.id, { alignSelf: v })} /><Text label="Example content" value={p.content || ''} onChange={(v)=>update(node.id, { content: v })} /></>)}
      {node.type === 'hero' && (<><Text label="Title" value={p.title} onChange={(v)=>update(node.id, { title: v })} /><Textarea label="Text" value={p.text} onChange={(v)=>update(node.id, { text: v })} /></>)}
      {node.type === 'text' && (<Textarea label="Text" value={p.text} onChange={(v)=>update(node.id, { text: v })} />)}
      {node.type === 'button' && (<><Text label="Label" value={p.label} onChange={(v)=>update(node.id, { label: v })} /><Select label="Variant" value={p.variant || 'primary'} options={['primary','secondary','success','danger','warning','info','light','dark']} onChange={(v)=>update(node.id, { variant: v })} /></>)}
      {node.type === 'card' && (<><Text label="Title" value={p.title} onChange={(v)=>update(node.id, { title: v })} /><Textarea label="Text" value={p.text} onChange={(v)=>update(node.id, { text: v })} /></>)}
      {node.type === 'badge' && (<><Text label="Text" value={p.text} onChange={(v)=>update(node.id, { text: v })} /><Select label="Variant" value={p.variant || 'secondary'} options={['primary','secondary','success','danger','warning','info','light','dark']} onChange={(v)=>update(node.id, { variant: v })} /></>)}
      {node.type === 'breadcrumb' && (<ArrayEditor label="Items" values={p.items || []} onChange={(vals)=>update(node.id, { items: vals })} />)}
      {node.type === 'nav' && (<ArrayEditor label="Items" values={p.items || []} onChange={(vals)=>update(node.id, { items: vals })} />)}
      {node.type === 'listgroup' && (<ArrayEditor label="Items" values={p.items || []} onChange={(vals)=>update(node.id, { items: vals })} />)}
      {node.type === 'progress' && (<Number label="Value" value={p.value ?? 0} min={0} max={100} onChange={(v)=>update(node.id, { value: v })} />)}
      {node.type === 'forminput' && (<><Text label="Label" value={p.label} onChange={(v)=>update(node.id, { label: v })} /><Text label="Placeholder" value={p.placeholder} onChange={(v)=>update(node.id, { placeholder: v })} /></>)}
      {['alert','collapse','modal','offcanvas','toast','popover','tooltip'].includes(node.type) && (<><Text label="Text" value={p.text || ''} onChange={(v)=>update(node.id, { text: v })} /><Text label="Title / label" value={p.title || p.label || ''} onChange={(v)=>update(node.id, { title: v, label: v })} /></>)}
      {['accordion','breadcrumb','dropdown','listgroup','nav','navbar','pagination'].includes(node.type) && (<ArrayEditor label="Items" values={p.items || []} onChange={(vals)=>update(node.id, { items: vals })} />)}
      {node.type === 'table' && (<><ArrayEditor label="Headers" values={p.headers || []} onChange={(vals)=>update(node.id, { headers: vals })} /><ArrayEditor label="Rows (use | between cells)" values={p.rows || []} onChange={(vals)=>update(node.id, { rows: vals })} /></>)}
      {node.type === 'image' && (<><Text label="Source URL" value={p.src || ''} onChange={(v)=>update(node.id, { src: v })} /><Text label="Alt text" value={p.alt || ''} onChange={(v)=>update(node.id, { alt: v })} /></>)}
      {node.type === 'utility' && (<><Text label="Heading" value={p.title || ''} onChange={(v)=>update(node.id, { title: v })} /><Textarea label="Explanation" value={p.text || ''} onChange={(v)=>update(node.id, { text: v })} /><Text label="Bootstrap utility classes" value={p.className || ''} onChange={(v)=>update(node.id, { className: v })} /><p className="mt-1 text-[10px] leading-4 text-slate-500">Try classes such as <code>p-4 bg-primary text-white rounded</code>. Separate multiple classes with spaces.</p></>)}
      <div className="mt-3 flex justify-end"><button className="rounded-md bg-slate-800 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700" onClick={close}>Done</button></div>
        </div>
      </div>
    </div>
  )
}

function Field({ children }: { children: React.ReactNode }) { return <div className="mb-2 grid gap-1">{children}</div> }
function Label({ children }: { children: React.ReactNode }) { return <label className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{children}</label> }
function Text({ label, value, onChange }:{ label: string, value: string, onChange: (v:string)=>void }) { return <Field><Label>{label}</Label><input className="rounded border border-slate-300 px-2 py-1 text-xs outline-none focus:border-blue-500" value={value} onChange={(e)=>onChange(e.target.value)} /></Field> }
function Textarea({ label, value, onChange }:{ label: string, value: string, onChange: (v:string)=>void }) { return <Field><Label>{label}</Label><textarea className="rounded border border-slate-300 px-2 py-1 text-xs outline-none focus:border-blue-500" value={value} onChange={(e)=>onChange(e.target.value)} /></Field> }
function Number({ label, value, onChange, min, max }:{ label: string, value: number, onChange: (v:number)=>void, min?:number, max?:number }) { return <Field><Label>{label}</Label><input type="number" min={min} max={max} className="rounded border border-slate-300 px-2 py-1 text-xs" value={value} onChange={(e)=>onChange(parseInt(e.target.value || '0'))} /></Field> }
function Toggle({ label, checked, onChange }:{ label: string, checked: boolean, onChange: (v:boolean)=>void }) { return <Field><Label>{label}</Label><input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} /></Field> }
function Select({ label, value, options, onChange }:{ label: string, value: string, options: string[], onChange: (v:string)=>void }) { return <Field><Label>{label}</Label><select className="rounded border border-slate-300 px-2 py-1 text-xs" value={value} onChange={(e)=>onChange(e.target.value)}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select></Field> }
function ArrayEditor({ label, values, onChange }:{ label: string, values: string[], onChange: (v:string[])=>void }) {
  return (<Field><Label>{label}</Label><div className="grid gap-2">{values.map((v,i)=>(<div key={i} className="flex gap-2 items-center"><input className="border rounded px-2 py-1 flex-1" value={v} onChange={(e)=>{const arr=[...values];arr[i]=e.target.value;onChange(arr)}} /><button className="text-xs border rounded px-2 py-1" onClick={()=>{const arr=values.filter((_,j)=>j!==i);onChange(arr)}}>Remove</button></div>))}<button className="text-xs border rounded px-2 py-1" onClick={()=>onChange([...(values||[]),'New item'])}>Add Item</button></div></Field>)
}
