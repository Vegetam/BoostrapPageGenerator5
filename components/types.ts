export type NodeType =
  | 'container' | 'row' | 'col' | 'hero' | 'text' | 'button' | 'buttonGroup'
  | 'alert' | 'accordion' | 'card' | 'carousel' | 'close' | 'collapse'
  | 'dropdown' | 'breadcrumb' | 'nav' | 'navbar' | 'offcanvas' | 'badge'
  | 'listgroup' | 'pagination' | 'progress' | 'spinner' | 'toast' | 'modal'
  | 'popover' | 'tooltip' | 'placeholder' | 'table' | 'forminput'
  | 'inputgroup' | 'floatingLabel' | 'image' | 'figure' | 'ratio'
  | 'utility'

export type BuilderNode = {
  id: string
  type: NodeType
  props?: Record<string, any>
  children?: string[]
  parentId?: string | null
}
