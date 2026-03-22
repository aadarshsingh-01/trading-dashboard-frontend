import { useState, useEffect } from 'react'

export default function Header({ title, connected, marketOpen }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000)
      const h = String(ist.getUTCHours()).padStart(2, '0')
      const m = String(ist.getUTCMinutes()).padStart(2, '0')
      const s = String(ist.getUTCSeconds()).padStart(2, '0')
      setTime(`${h}:${m}:${s}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 20,
      paddingBottom: 16, borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
        {title}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Market status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: marketOpen ? 'var(--green-dim)' : 'var(--red-dim)',
          border: `1px solid ${marketOpen ? 'var(--green-border)' : '#ef444430'}`,
          padding: '4px 10px', borderRadius: 20,
          fontSize: 10, fontFamily: 'var(--font-mono)',
          color: marketOpen ? 'var(--green)' : 'var(--red)',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'currentColor',
            animation: marketOpen ? 'pulse 1.5s infinite' : 'none',
          }}/>
          {marketOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
        </div>

        {/* Clock */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--text-muted)',
          background: 'var(--bg-secondary)',
          padding: '4px 10px', borderRadius: 20,
          border: '1px solid var(--border)',
        }}>
          {time} IST
        </div>
      </div>
    </div>
  )
}
