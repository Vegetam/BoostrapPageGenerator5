'use client'

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core'
import { PropsWithChildren, useState } from 'react'
import ComponentLibrary from '@/components/ComponentLibrary'
import Canvas from '@/components/Canvas'
import Toolbar from '@/components/Toolbar'
import PropertiesPanel from '@/components/PropertiesPanel'
import useBuilderStore from '@/components/BuilderStore'

/**
 * Wrapper that preserves the grid layout by not introducing a real box.
 * (DndContext itself becomes a single child; we wrap it in a div with display:contents
 * so its children remain individual grid items.)
 */
function DndProvider({
  sensors,
  onDragEnd,
  collisionDetection,
  children,
}: PropsWithChildren<{
  sensors: ReturnType<typeof useSensors>
  onDragEnd: (e: DragEndEvent) => void
  collisionDetection: any
}>) {
  return (
    <div style={{ display: 'contents' }}>
      <DndContext
        sensors={sensors}
        onDragEnd={onDragEnd}
        collisionDetection={collisionDetection}
      >
        {children}
        <DragOverlay dropAnimation={null} />
      </DndContext>
    </div>
  )
}

export default function BuilderApp() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [device, setDevice] = useState<'lg' | 'md' | 'sm' | 'xs'>('lg')
  const [mode, setMode] = useState<'edit' | 'developer' | 'preview'>('edit')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // read addNode without subscribing the component
  const addNode = (useBuilderStore as any).getState().addNode as (
    type: string,
    parentId?: string | null
  ) => string

  // sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } })
  )

  function handleDragEnd(e: DragEndEvent) {
    const type = e.active?.data?.current?.type as string | undefined
    const preset = e.active?.data?.current?.preset as string | undefined
    const overId = e.over?.id as string | undefined

    if (preset) {
      useBuilderStore.getState().addGridPreset(preset, overId?.startsWith('drop-') ? overId.slice(5) : null)
      return
    }
    if (!type) return
    if (!overId || overId === 'root-drop') {
      addNode(type, null)
      return
    }
    if (overId.startsWith('drop-')) {
      addNode(type, overId.slice(5))
    }
  }

  return (
    <div data-bs-theme={theme} className={`builder-shell builder-mode-${mode} builder-device-${device} builder-theme-${theme}`}>
      {/* top bar */}
      <header className="builder-toolbar">
        <h1 className="builder-brand">Bootstrap Page Builder</h1>
        <Toolbar device={device} mode={mode} theme={theme} onDeviceChange={setDevice} onModeChange={setMode} onThemeChange={setTheme} />
      </header>

      {/* Keep aside + main as separate grid children */}
      <DndProvider
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={rectIntersection}
      >
        {/* left column */}
        <aside className="builder-sidebar">
          <ComponentLibrary
            onDragStart={setActiveId}
            onDragEnd={() => setActiveId(null)}
          />
        </aside>

        {/* center column */}
        <main className="builder-workspace">
          <div className={`builder-device-frame builder-device-frame-${device}`}>
            <Canvas />
          </div>
        </main>
      </DndProvider>

      <PropertiesPanel />
    </div>
  )
}
