import Header from '../components/Header.jsx'

export default function Signals({ data }) {
  const { status, signals, connected } = data

  return (
    <div>
      <Header title="Today's Signals" connected={connected} marketOpen={status?.market_open} />

      {signals.length === 0 ? (
        <div style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '60px 20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 6 }}>
            No signals yet today
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            Scanner runs at 9:15 AM IST on market days
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 12 }}>
          {signals.map((sig, i) => {
            const isLong = sig.direction === 'LONG'
            const color  = isLong ? 'var(--green)' : 'var(--red)'
            return (
              <div key={i} style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: 10, overflow: 'hidden',
                borderTop: `2px solid ${color}`,
                animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
              }}>
                {/* Card header */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '12px 14px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 15,
                      fontWeight: 700, color: 'var(--text-primary)',
                    }}>{sig.stock}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                      {sig.strategy} · {sig.time}
                    </div>
                  </div>
                  <div style={{
                    background: isLong ? 'var(--green-dim)' : 'var(--red-dim)',
                    color, padding: '4px 12px', borderRadius: 6,
                    fontSize: 11, fontWeight: 600,
                  }}>{sig.direction}</div>
                </div>

                {/* Price info */}
                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {[
                      ['Entry', `₹${sig.entry_price}`, 'var(--text-primary)'],
                      ['Target', `₹${sig.target}`, 'var(--green)'],
                      ['Stop', `₹${sig.stop}`, 'var(--red)'],
                    ].map(([label, val, clr]) => (
                      <div key={label}>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 3 }}>{label}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: clr }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indicators */}
                <div style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {[
                      ['RSI', sig.rsi?.toFixed(1)],
                      ['Gap', `${sig.gap_pct > 0 ? '+' : ''}${sig.gap_pct?.toFixed(2)}%`],
                      ['Score', sig.score?.toFixed(0)],
                      ['Qty', sig.qty],
                    ].map(([label, val]) => (
                      <div key={label} style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: 11, padding: '3px 0',
                      }}>
                        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
