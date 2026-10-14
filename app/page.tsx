'use client'

import dynamic from 'next/dynamic'
const BuilderApp = dynamic(() => import('@/components/BuilderApp'), {
  ssr: false,
  loading: () => <div style={{padding:24}}>Loading builder…</div>
})
export default function Page() {
  return <BuilderApp />
}
