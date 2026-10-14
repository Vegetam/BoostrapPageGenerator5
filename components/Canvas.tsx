'use client'

import { useDroppable } from '@dnd-kit/core'
import useBuilderStore from './BuilderStore'
import ElementRenderer from './ElementRenderer'

export default function Canvas() {
  const { setNodeRef, isOver } = useDroppable({ id: 'root-drop' })
  const rootIds = useBuilderStore((s) => s.rootIds) || []

  return (
    <div
      ref={setNodeRef}
      data-dnd-drop="root-drop"
      className={`builder-canvas min-h-[70vh] w-full rounded-xl border border-dashed p-4 ${
        isOver ? 'bg-slate-100' : 'bg-white'
      }`}
    >
      {rootIds.length === 0 && (
        <div className="text-sm text-slate-500 select-none">
          Drag components here or click items on the left to add them.
        </div>
      )}
      {rootIds.map((id) => (
        <ElementRenderer key={id} id={id} />
      ))}
    </div>
  )
}
