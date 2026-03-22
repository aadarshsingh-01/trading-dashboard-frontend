import { NavLink } from 'react-router-dom'

const NAV = [
  { path: '/',         label: 'Live Trades',    icon: '◈' },
  { path: '/signals',  label: 'Signals',        icon: '◎' },
  { path: '/stats',    label: 'Strategy Stats', icon: '▦' },
  { path: '/equity',   label: 'Equity Curve',   icon: '◿' },
  { path: '/log',      label: 'Trade Log',      icon: '≡' },
]

export default function Sidebar({ connected, capital }) {
  const ret = capital ? (((capital - 100000) / 100000) * 100).toFixed(2) : '0.00'
  const isPos = parseFloat(ret) >= 0

  return (
    <aside style={{
      width: 200, background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 13,
          fontWeight: 700, color: 'var(--green)', letterSpacing: 3,
        }}>ALGO.TRADE</div>
        <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 2, marginTop: 3 }}>
          PAPER MODE v2.0
        </div>
      </div>

      {/* Capital mini card */}
      <div style={{
        margin: '12px 12px 0',
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border)',
        borderRadius: 8, padding: '10px 12px',
      }}>
        <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 4 }}>
          TOTAL CAPITAL
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 16,
          fontWeight: 700, color: 'var(--green)',
        }}>
          ₹{capital ? capital.toLocaleString('en-IN') : '1,00,000'}
        </div>
        <div style={{
          fontSize: 10, marginTop: 2,
          color: isPos ? 'var(--green)' : 'var(--red)',
        }}>
          {isPos ? '+' : ''}{ret}% total return
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {NAV.map(({ path, label, icon }) => (
          <NavLink key={path} to={path} end={path === '/'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 16px', fontSize: 12,
            color: isActive ? 'var(--green)' : 'var(--text-muted)',
            background: isActive ? 'var(--green-dim)' : 'transparent',
            borderLeft: `2px solid ${isActive ? 'var(--green)' : 'transparent'}`,
            textDecoration: 'none', transition: 'all .15s',
          })}>
            <span style={{ fontSize: 14 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Connection status */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: connected ? 'var(--green)' : 'var(--red)',
          animation: connected ? 'pulse 1.5s infinite' : 'none',
        }}/>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {connected ? 'WS CONNECTED' : 'RECONNECTING...'}
        </span>
      </div>
    </aside>
  )
}
