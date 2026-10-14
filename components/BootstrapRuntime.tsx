'use client'

import { useEffect } from 'react'

export default function BootstrapRuntime() {
  useEffect(() => {
    let disposed = false
    let observer: MutationObserver | undefined

    void import('bootstrap').then(({ Tooltip, Popover }) => {
      if (disposed) return

      const initialize = () => {
        document.querySelectorAll<HTMLElement>('[data-bs-toggle="tooltip"]').forEach((element) => {
          Tooltip.getOrCreateInstance(element)
        })
        document.querySelectorAll<HTMLElement>('[data-bs-toggle="popover"]').forEach((element) => {
          Popover.getOrCreateInstance(element)
        })
      }

      initialize()
      observer = new MutationObserver(initialize)
      observer.observe(document.body, { childList: true, subtree: true })
    })

    return () => {
      disposed = true
      observer?.disconnect()
    }
  }, [])

  return null
}
