'use client'
import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import useBuilderStore from './BuilderStore'
import type { BuilderNode } from './types'

export default function ElementRenderer({ id }: { id: string }) {
  const node = useBuilderStore((s) => s.nodes[id])
  const select = useBuilderStore((s) => s.select)
  const edit = useBuilderStore((s) => s.edit)
  const remove = useBuilderStore((s) => s.removeNode)
  const selectedId = useBuilderStore((s) => s.selectedId)
  const canContainChildren = node.type === 'container' || node.type === 'row' || node.type === 'col'
  const { setNodeRef, isOver } = useDroppable({ id: `drop-${id}`, disabled: !canContainChildren })

  if (!node) return null
  const selected = selectedId === id
  const canEdit = node.type !== 'ratio'
  const childElements = node.children?.map((cid, index) => (
    <React.Fragment key={cid}>
      <ElementRenderer id={cid} />
      {node.type === 'row' && node.props?.breakAfter === index + 1 && <div className="w-100" />}
    </React.Fragment>
  ))
  const inner = renderBootstrap(node, childElements)
  const guide = getGuide(node.type)
  const editorClass = getEditorClass(node)

  // containers expose inner drop zone
  if (canContainChildren) {
    return (
      <div
        ref={setNodeRef}
        className={`builder-node builder-node-${node.type} ${editorClass} group relative mb-3 rounded-md p-2 ${isOver ? 'bg-slate-50' : ''} ${selected ? 'ring-2 ring-blue-400' : ''}`}
        style={guide?.style}
        onClick={(e) => {
          e.stopPropagation()
          select(id)
        }}
      >
        {guide && <GuideLabel label={guide.label} />}
        {inner}
        {node.children?.length === 0 && (
          <div className={`mt-1 flex min-h-12 items-center justify-center rounded border border-dashed text-xs ${isOver ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-300 text-slate-400'}`}>
            Drop components inside this {guide?.label.toLowerCase()}
          </div>
        )}
        <div className="absolute right-2 top-2 z-10 flex gap-1">
          {canEdit && <button className="rounded-md border border-blue-700 bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300" onClick={(e) => { e.stopPropagation(); edit(id) }}>Edit</button>}
          <button className="rounded-md border border-red-200 bg-white px-2 py-0.5 text-[11px] font-medium text-red-600 shadow-sm hover:bg-red-50" onClick={(e) => { e.stopPropagation(); remove(id) }}>×</button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`builder-node builder-node-${node.type} ${editorClass} group relative mb-3 rounded-md p-2 ${selected ? 'ring-2 ring-blue-400' : ''}`}
      style={guide?.style}
      onClick={(e) => {
        e.stopPropagation()
        select(id)
      }}
    >
      {guide && <GuideLabel label={guide.label} />}
      {inner}
      <div className="absolute right-2 top-2 z-10 flex gap-1">
        {canEdit && <button
          className="rounded-md border border-blue-700 bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={(e) => { e.stopPropagation(); edit(id) }}
        >
          Edit
        </button>}
        <button
          className="rounded-md border border-red-200 bg-white px-2 py-0.5 text-[11px] font-medium text-red-600 shadow-sm hover:bg-red-50"
          onClick={() => remove(id)}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

function getEditorClass(node: BuilderNode) {
  if (node.type !== 'col') return ''
  const p = node.props || {}
  return [
    p.span && p.span !== 'auto' ? `builder-col-${p.span}` : 'builder-col-auto',
    p.sm ? `builder-col-sm-${p.sm}` : '',
    p.md ? `builder-col-md-${p.md}` : '',
    p.lg ? `builder-col-lg-${p.lg}` : '',
    p.xl ? `builder-col-xl-${p.xl}` : '',
    p.xxl ? `builder-col-xxl-${p.xxl}` : '',
  ].filter(Boolean).join(' ')
}

function getGuide(type: BuilderNode['type']) {
  if (type === 'container') {
    return {
      label: 'Container',
      style: { border: '1px solid #d8dee4', backgroundColor: '#fafafa', minHeight: '92px', paddingTop: '2rem' },
    }
  }
  if (type === 'row') {
    return {
      label: 'Row',
      style: { border: '1px solid #d8dee4', backgroundColor: '#f8f9fa', minHeight: '76px', paddingTop: '2rem' },
    }
  }
  if (type === 'col') {
    return {
      label: 'Column',
      style: { border: '1px solid #d8dee4', backgroundColor: '#fff', minHeight: '72px', paddingTop: '2rem' },
    }
  }
  return null
}

function GuideLabel({ label }: { label: string }) {
  return (
    <span className="builder-guide-label pointer-events-none absolute left-0 top-0 z-[5] rounded-br border-b border-r border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-500">
      {label}
    </span>
  )
}

function renderBootstrap(node: BuilderNode, children?: React.ReactNode) {
  const p = node.props || {}
  const id = `component-${node.id}`
  const items = (p.items as string[] | undefined) || []
  switch (node.type) {
    case 'container':
      return (
        <div className={p.fluid ? 'container-fluid' : 'container'}>{children}</div>
      )
    case 'row':
      return <div className={`row ${p.align ? `align-items-${p.align}` : ''} ${p.justify ? `justify-content-${p.justify}` : ''} ${p.gutters ? `g-${p.gutters}` : ''} ${p.className || ''}`}>{children}</div>
    case 'col': {
      const cls = [
        p.span && p.span !== 'auto' ? `col-${p.span}` : 'col',
        p.sm ? `col-sm-${p.sm}` : '',
        p.md ? `col-md-${p.md}` : '',
        p.lg ? `col-lg-${p.lg}` : '',
        p.xl ? `col-xl-${p.xl}` : '',
        p.xxl ? `col-xxl-${p.xxl}` : '',
        p.className || '',
        p.alignSelf ? `align-self-${p.alignSelf}` : '',
      ]
        .filter(Boolean)
        .join(' ')
      return <div className={cls}>{children || <span>{p.content}</span>}</div>
    }
    case 'hero':
      return (
        <div className="hero p-5 mb-4 bg-light rounded-3 border">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">{p.title}</h1>
            <p className="col-md-8 fs-5">{p.text}</p>
          </div>
        </div>
      )
    case 'text':
      return <p>{p.text}</p>
    case 'button':
      return <button className={`btn btn-${p.variant || 'primary'}`}>{p.label}</button>
    case 'buttonGroup':
      return <div className="btn-group" role="group">{((p.labels as string[]) || []).map((label) => <button key={label} className={`btn btn-${p.variant || 'primary'}`}>{label}</button>)}</div>
    case 'alert':
      return <div className={`alert alert-${p.variant || 'primary'} ${p.dismissible ? 'alert-dismissible fade show' : ''}`} role="alert">{p.text}{p.dismissible && <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />}</div>
    case 'accordion':
      return <div className="accordion" id={id}>{items.map((text, i) => <div className="accordion-item" key={`${id}-${i}`}><h2 className="accordion-header" id={`${id}-heading-${i}`}><button className={`accordion-button ${p.open === i ? '' : 'collapsed'}`} type="button" data-bs-toggle="collapse" data-bs-target={`#${id}-collapse-${i}`} aria-expanded={p.open === i} aria-controls={`${id}-collapse-${i}`}>Accordion item {i + 1}</button></h2><div id={`${id}-collapse-${i}`} className={`accordion-collapse collapse ${p.open === i ? 'show' : ''}`} data-bs-parent={`#${id}`}><div className="accordion-body">{text}</div></div></div>)}</div>
    case 'card':
      return (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{p.title}</h5>
            <p className="card-text">{p.text}</p>
          </div>
        </div>
      )
    case 'carousel':
      return <div id={id} className="carousel slide" data-bs-ride="carousel"><div className="carousel-inner">{items.map((text, i) => <div className={`carousel-item ${i === 0 ? 'active' : ''}`} key={`${id}-${i}`}><div className="d-block w-100 p-5 bg-light text-dark">{text}</div></div>)}</div><button className="carousel-control-prev builder-carousel-control-dark" type="button" data-bs-target={`#${id}`} data-bs-slide="prev" aria-label="Previous slide"><span className="carousel-control-prev-icon" /></button><button className="carousel-control-next builder-carousel-control-dark" type="button" data-bs-target={`#${id}`} data-bs-slide="next" aria-label="Next slide"><span className="carousel-control-next-icon" /></button></div>
    case 'close':
      return <button type="button" className="btn-close" aria-label={String(p.label || 'Close')} />
    case 'collapse':
      return <><button className="btn btn-primary builder-collapse-toggle" type="button" data-bs-toggle="collapse" data-bs-target={`#${id}`} aria-expanded={!!p.show}>{p.label}</button><div className={`collapse ${p.show ? 'show' : ''}`} id={id}><div className="card card-body">{p.text}</div></div></>
    case 'dropdown':
      return <div className="dropdown"><button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{p.label}</button><ul className="dropdown-menu">{items.map((item) => <li key={item}><a className="dropdown-item" href="#" onClick={(event) => event.preventDefault()}>{item}</a></li>)}</ul></div>
    case 'breadcrumb':
      return (
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            {(p.items || []).map((t: string, i: number) => (
              <li
                key={i}
                className={`breadcrumb-item ${
                  i === (p.items.length - 1) ? 'active' : ''
                }`}
              >
                {t}
              </li>
            ))}
          </ol>
        </nav>
      )
    case 'nav':
      return (
        <ul className="nav nav-tabs">
          {(p.items || []).map((t: string, i: number) => (
            <li key={i} className="nav-item">
              <a className={`nav-link ${i === 0 ? 'active' : ''}`} href="#">
                {t}
              </a>
            </li>
          ))}
        </ul>
      )
    case 'navbar':
      return <nav className="navbar navbar-expand-lg bg-body-tertiary"><div className="container-fluid"><a className="navbar-brand" href="#">{p.brand}</a><button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target={`#${id}`}><span className="navbar-toggler-icon" /></button><div className="collapse navbar-collapse" id={id}><ul className="navbar-nav me-auto mb-2 mb-lg-0">{items.map((item, i) => <li className="nav-item" key={item}><a className={`nav-link ${i === 0 ? 'active' : ''}`} href="#">{item}</a></li>)}</ul></div></div></nav>
    case 'offcanvas':
      return <><button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target={`#${id}`}>Open offcanvas</button><div className="offcanvas offcanvas-start" tabIndex={-1} id={id}><div className="offcanvas-header"><h5 className="offcanvas-title">{p.title}</h5><button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" /></div><div className="offcanvas-body">{p.text}</div></div></>
    case 'badge':
      return <span className={`badge text-bg-${p.variant || 'secondary'}`}>{p.text}</span>
    case 'listgroup':
      return (
        <ul className="list-group">
          {(p.items || []).map((t: string, i: number) => (
            <li key={i} className="list-group-item">
              {t}
            </li>
          ))}
        </ul>
      )
    case 'progress':
      return (
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${p.value ?? 0}%` }}
            aria-valuenow={p.value ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )
    case 'pagination':
      return <nav aria-label="Page navigation"><ul className="pagination">{((p.pages as string[]) || []).map((page) => <li className="page-item" key={page}><a className="page-link" href="#">{page}</a></li>)}</ul></nav>
    case 'spinner':
      return <div className={`spinner-${p.type || 'border'} text-${p.variant || 'primary'}`} role="status"><span className="visually-hidden">Loading...</span></div>
    case 'toast':
      return <div className={`toast ${p.show ? 'show' : ''}`} role="alert"><div className="toast-header"><strong className="me-auto">{p.title}</strong><button type="button" className="btn-close" data-bs-dismiss="toast" /></div><div className="toast-body">{p.text}</div></div>
    case 'modal':
      return <><button className="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target={`#${id}`}>Open modal</button><div className="modal fade" id={id} tabIndex={-1} aria-hidden="true"><div className="modal-dialog"><div className="modal-content"><div className="modal-header"><h5 className="modal-title">{p.title}</h5><button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" /></div><div className="modal-body">{p.text}</div><div className="modal-footer"><button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button></div></div></div></div></>
    case 'popover':
      return <button type="button" className="btn btn-secondary" data-bs-toggle="popover" data-bs-title={p.title} data-bs-content={p.text}>{p.label}</button>
    case 'tooltip':
      return <button type="button" className="btn btn-secondary" data-bs-toggle="tooltip" data-bs-title={p.text}>{p.label}</button>
    case 'placeholder':
      return <div aria-hidden="true">{Array.from({ length: Number(p.lines) || 1 }, (_, i) => <span className="placeholder col-12 d-block mb-2" key={i} />)}</div>
    case 'table': {
      const headers = (p.headers as string[]) || []
      return <div className="table-responsive"><table className="table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{((p.rows as string[]) || []).map((row) => <tr key={row}>{row.split('|').map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
    }
    case 'forminput':
      return (
        <div className="mb-3">
          <label className="form-label">{p.label}</label>
          <input
            type="email"
            className="form-control"
            placeholder={p.placeholder}
          />
        </div>
      )
    case 'inputgroup':
      return <div className="input-group"><span className="input-group-text">{p.prefix}</span><input className="form-control" placeholder={p.placeholder as string} /></div>
    case 'floatingLabel':
      return <div className="form-floating"><input className="form-control" placeholder={p.placeholder as string} id={id} /><label htmlFor={id}>{p.label}</label></div>
    case 'image':
      return <img src={p.src as string} alt={p.alt as string} className={p.fluid ? 'img-fluid' : ''} />
    case 'figure':
      return <figure className="figure"><img src={p.src as string} className="figure-img img-fluid rounded" alt="" /><figcaption className="figure-caption">{p.caption}</figcaption></figure>
    case 'ratio':
      return <div className={`ratio ratio-${p.ratio || '16x9'}`}><div className="bg-light d-flex align-items-center justify-content-center">{p.content}</div></div>
    case 'utility':
      return (
        <div className={p.className as string}>
          <div className="mb-1 text-sm fw-semibold">{p.title || 'Custom Bootstrap utility'}</div>
          <div className="small">{p.text}</div>
          <code className="mt-2 d-inline-block rounded bg-white px-2 py-1 small text-dark">
            {p.className || 'Add Bootstrap utility classes'}
          </code>
        </div>
      )
    default:
      return <div />
  }
}
