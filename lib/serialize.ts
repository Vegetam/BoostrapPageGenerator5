import type { BuilderNode } from '@/components/types'
export function serializeToHtml(nodes: Record<string, BuilderNode>, rootIds: string[], theme: 'light' | 'dark' = 'light') {
  const body = rootIds.map((id) => renderNode(nodes, id)).join('\n')
  const themeStyles = theme === 'dark' ? `<style>
body.theme-dark { background: #1b2633; color: #f1f3f5; }
body.theme-dark .bg-light, body.theme-dark .bg-body, body.theme-dark .bg-white,
body.theme-dark .navbar, body.theme-dark .hero, body.theme-dark .card,
body.theme-dark .card-body, body.theme-dark .modal-content, body.theme-dark .offcanvas,
body.theme-dark .toast, body.theme-dark .accordion-item, body.theme-dark .accordion-button,
body.theme-dark .accordion-body, body.theme-dark .list-group-item,
body.theme-dark .table, body.theme-dark .form-control, body.theme-dark .form-select,
body.theme-dark select, body.theme-dark textarea, body.theme-dark .input-group-text {
  background-color: #263442 !important; color: #f1f3f5 !important; border-color: #526170;
}
body.theme-dark h1, body.theme-dark h2, body.theme-dark h3, body.theme-dark h4,
body.theme-dark h5, body.theme-dark h6, body.theme-dark p, body.theme-dark span,
body.theme-dark li, body.theme-dark label, body.theme-dark figcaption,
body.theme-dark .lead, body.theme-dark .display-1, body.theme-dark .display-2,
body.theme-dark .display-3, body.theme-dark .display-4, body.theme-dark .display-5,
body.theme-dark .display-6, body.theme-dark .navbar-brand, body.theme-dark .nav-link,
body.theme-dark .breadcrumb-item, body.theme-dark .page-link, body.theme-dark .dropdown-item {
  color: #f1f3f5 !important;
}
body.theme-dark .accordion-button:not(.collapsed) { background-color: #33475c !important; }
body.theme-dark .dropdown-menu, body.theme-dark .pagination, body.theme-dark .nav-tabs,
body.theme-dark .nav-pills { background-color: #263442; border-color: #526170; }
body.theme-dark .dropdown-item:hover, body.theme-dark .page-link:hover { background-color: #33475c; }
body.theme-dark .alert-light, body.theme-dark .alert-secondary, body.theme-dark .placeholder {
  background-color: #3a4a59; color: #f1f3f5 !important; border-color: #526170;
}
body.theme-dark code { background-color: #17212b !important; color: #f1f3f5 !important; }
.builder-collapse-toggle { color: #212529 !important; }
</style>` : '<style>.builder-collapse-toggle { color: #212529 !important; }</style>'
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bootstrap Page</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  ${themeStyles}
</head>
<body data-bs-theme="${theme}" class="${theme === 'dark' ? 'theme-dark' : ''}">\n${body}\n<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>\n</body>
</html>`
}
function renderNode(nodes: Record<string, BuilderNode>, id: string): string {
  const n = nodes[id]; if (!n) return ''
  const p = n.props || {}
  const componentId = `component-${n.id}`
  switch (n.type) {
    case 'container': return wrap(`<div class="${p.fluid ? 'container-fluid' : 'container'}">${renderChildren(nodes, n)}</div>`)
    case 'row': return wrap(`<div class="row ${p.className || ''}">${renderChildren(nodes, n)}</div>`)
    case 'col': return wrap(`<div class="col-${p.span ?? 12} ${p.md ? `col-md-${p.md}` : ''} ${p.lg ? `col-lg-${p.lg}` : ''}">${renderChildren(nodes, n)}</div>`)
    case 'hero': return wrap(`<div class="hero p-5 mb-4 bg-light rounded-3 border"><div class="container-fluid py-5"><h1 class="display-5 fw-bold">${escapeHtml(p.title)}</h1><p class="col-md-8 fs-5">${escapeHtml(p.text)}</p></div></div>`)
    case 'text': return wrap(`<p>${escapeHtml(p.text)}</p>`)
    case 'button': return wrap(`<button class="btn btn-${p.variant || 'primary'}">${escapeHtml(p.label)}</button>`)
    case 'buttonGroup': return wrap(`<div class="btn-group" role="group">${(p.labels || []).map((label: string) => `<button class="btn btn-${p.variant || 'primary'}">${escapeHtml(label)}</button>`).join('')}</div>`)
    case 'alert': return wrap(`<div class="alert alert-${p.variant || 'primary'}${p.dismissible ? ' alert-dismissible fade show' : ''}" role="alert">${escapeHtml(p.text)}${p.dismissible ? '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' : ''}</div>`)
    case 'accordion': return wrap(`<div class="accordion" id="${componentId}">${(p.items || []).map((text: string, i: number) => `<div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button${p.open === i ? '' : ' collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${componentId}-${i}">Accordion item ${i + 1}</button></h2><div id="${componentId}-${i}" class="accordion-collapse collapse${p.open === i ? ' show' : ''}" data-bs-parent="#${componentId}"><div class="accordion-body">${escapeHtml(text)}</div></div></div>`).join('')}</div>`)
    case 'card': return wrap(`<div class="card"><div class="card-body"><h5 class="card-title">${escapeHtml(p.title)}</h5><p class="card-text">${escapeHtml(p.text)}</p></div></div>`)
    case 'collapse': return wrap(`<button class="btn btn-primary builder-collapse-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#${componentId}">${escapeHtml(p.label)}</button><div class="collapse${p.show ? ' show' : ''}" id="${componentId}"><div class="card card-body">${escapeHtml(p.text)}</div></div>`)
    case 'dropdown': return wrap(`<div class="dropdown"><button class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">${escapeHtml(p.label)}</button><ul class="dropdown-menu">${(p.items || []).map((item: string) => `<li><a class="dropdown-item" href="#">${escapeHtml(item)}</a></li>`).join('')}</ul></div>`)
    case 'breadcrumb': return wrap(`<nav aria-label="breadcrumb"><ol class="breadcrumb">${(p.items||[]).map((t: string, i: number, a: any[]) => `<li class="breadcrumb-item ${i===a.length-1 ? 'active' : ''}">${escapeHtml(t)}</li>`).join('')}</ol></nav>`)
    case 'nav': return wrap(`<ul class="nav nav-tabs">${(p.items||[]).map((t: string, i: number) => `<li class="nav-item"><a class="nav-link ${i===0 ? 'active' : ''}" href="#">${escapeHtml(t)}</a></li>`).join('')}</ul>`)
    case 'navbar': return wrap(`<nav class="navbar navbar-expand-lg bg-light"><div class="container-fluid"><a class="navbar-brand" href="#">${escapeHtml(p.brand)}</a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#${componentId}"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="${componentId}"><ul class="navbar-nav me-auto">${(p.items || []).map((item: string) => `<li class="nav-item"><a class="nav-link" href="#">${escapeHtml(item)}</a></li>`).join('')}</ul></div></div></nav>`)
    case 'offcanvas': return wrap(`<button class="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#${componentId}">Open offcanvas</button><div class="offcanvas offcanvas-start" tabindex="-1" id="${componentId}"><div class="offcanvas-header"><h5>${escapeHtml(p.title)}</h5><button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button></div><div class="offcanvas-body">${escapeHtml(p.text)}</div></div>`)
    case 'badge': return wrap(`<span class="badge text-bg-${p.variant || 'secondary'}">${escapeHtml(p.text)}</span>`)
    case 'listgroup': return wrap(`<ul class="list-group">${(p.items||[]).map((t: string) => `<li class="list-group-item">${escapeHtml(t)}</li>`).join('')}</ul>`)
    case 'progress': return wrap(`<div class="progress"><div class="progress-bar" role="progressbar" style="width:${p.value ?? 0}%" aria-valuenow="${p.value ?? 0}" aria-valuemin="0" aria-valuemax="100"></div></div>`)
    case 'pagination': return wrap(`<nav><ul class="pagination">${(p.pages || []).map((page: string) => `<li class="page-item"><a class="page-link" href="#">${escapeHtml(page)}</a></li>`).join('')}</ul></nav>`)
    case 'spinner': return wrap(`<div class="spinner-${p.type || 'border'} text-${p.variant || 'primary'}" role="status"><span class="visually-hidden">Loading...</span></div>`)
    case 'modal': return wrap(`<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${componentId}">Open modal</button><div class="modal fade" id="${componentId}" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5>${escapeHtml(p.title)}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body">${escapeHtml(p.text)}</div></div></div></div>`)
    case 'popover': return wrap(`<button class="btn btn-secondary" data-bs-toggle="popover" data-bs-title="${escapeHtml(p.title)}" data-bs-content="${escapeHtml(p.text)}">${escapeHtml(p.label)}</button>`)
    case 'tooltip': return wrap(`<button class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-title="${escapeHtml(p.text)}">${escapeHtml(p.label)}</button>`)
    case 'placeholder': return wrap(`<div>${Array.from({ length: Number(p.lines) || 1 }, () => '<span class="placeholder col-12 d-block mb-2"></span>').join('')}</div>`)
    case 'forminput': return wrap(`<div class="mb-3"><label class="form-label">${escapeHtml(p.label)}</label><input type="${escapeHtml(p.type || 'email')}" class="form-control" placeholder="${escapeHtml(p.placeholder)}" /></div>`)
    case 'inputgroup': return wrap(`<div class="input-group"><span class="input-group-text">${escapeHtml(p.prefix)}</span><input class="form-control" placeholder="${escapeHtml(p.placeholder)}" /></div>`)
    case 'floatingLabel': return wrap(`<div class="form-floating"><input class="form-control" id="${componentId}" placeholder="${escapeHtml(p.placeholder)}" /><label for="${componentId}">${escapeHtml(p.label)}</label></div>`)
    case 'image': return wrap(`<img src="${escapeHtml(p.src)}" alt="${escapeHtml(p.alt)}" class="${p.fluid ? 'img-fluid' : ''}" />`)
    case 'figure': return wrap(`<figure class="figure"><img src="${escapeHtml(p.src)}" class="figure-img img-fluid rounded" alt="" /><figcaption class="figure-caption">${escapeHtml(p.caption)}</figcaption></figure>`)
    case 'ratio': return wrap(`<div class="ratio ratio-${p.ratio || '16x9'}"><div>${escapeHtml(p.content)}</div></div>`)
    case 'utility': return wrap(`<div class="${escapeHtml(p.className)}"><div class="mb-1 fw-semibold">${escapeHtml(p.title || 'Custom Bootstrap utility')}</div><div class="small">${escapeHtml(p.text)}</div><code class="mt-2 d-inline-block rounded bg-white px-2 py-1 small text-dark">${escapeHtml(p.className || 'Add Bootstrap utility classes')}</code></div>`)
    default: return ''
  }
}
function renderChildren(nodes: Record<string, BuilderNode>, n: BuilderNode) { return (n.children || []).map((cid) => renderNode(nodes, cid)).join('') }
function wrap(inner: string) { return `\n${inner}\n` }
function escapeHtml(s: string = '') { return s.replace(/[&<>\"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]!)) }
