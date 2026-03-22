import Header from '../components/Header.jsx'

const StatCard = ({ label, value, sub, color = 'var(--green)' }) => (
  <div style={{
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '14px 16px', position: 'relative', overflow: 'hidden',
    animation: 'fadeIn 0.3s ease forwards',
  }}>
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color,
    }}/>
    <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
      {label}
    </div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color }}>
      {value}
    </div>
    {sub && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
  </div>
)

const Badge = ({ dir }) => (
  <span style={{
    background: dir === 'LONG' ? 'var(--green-dim)' : 'var(--red-dim)',
    color: dir === 'LONG' ? 'var(--green)' : 'var(--red)',
    padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 600,
  }}>{dir}</span>
)

const ExitBadge = ({ reason }) => {
  const colors = {
    TARGET: ['var(--green-dim)', 'var(--green)'],
    STOP:   ['var(--red-dim)',   'var(--red)'],
    EOD:    ['var(--amber-dim)', 'var(--amber)'],
  }
  const [bg, fg] = colors[reason] || ['var(--bg-tertiary)', 'var(--text-muted)']
  return (
    <span style={{ background: bg, color: fg, padding: '2px 8px', borderRadius: 4, fontSize: 9 }}>
      {reason}
    </span>
  )
}

export default function LiveTrades({ data }) {
  const { status, stats, openTrades, closedTrades, prices } = data
  const v2 = stats?.V2 || {}

  const capital     = v2.capital || 100000
  const totalReturn = (((capital - 100000) / 100000) * 100).toFixed(2)
  const isPos       = parseFloat(totalReturn) >= 0

  // Live P&L for open trades
  const getLivePnl = (trade) => {
    const ltp = prices[trade.stock]?.ltp
    if (!ltp) return trade.pnl || 0
    if (trade.direction === 'LONG') return (ltp - trade.entry_price) * trade.qty - 20
    return (trade.entry_price - ltp) * trade.qty - 20
  }

  const getLivePct = (trade) => {
    const ltp = prices[trade.stock]?.ltp
    if (!ltp) return 0
    if (trade.direction === 'LONG') return ((ltp - trade.entry_price) / trade.entry_price * 100)
    return ((trade.entry_price - ltp) / trade.entry_price * 100)
  }

  return (
    <div>
      <Header title="Live Trades" connected={data.connected} marketOpen={status?.market_open} />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard
          label="Capital"
          value={`₹${capital.toLocaleString('en-IN')}`}
          sub={`${isPos ? '+' : ''}${totalReturn}% total return`}
          color="var(--green)"
        />
        <StatCard
          label="Win Rate"
          value={`${v2.win_rate || 0}%`}
          sub={`${v2.wins_today || 0}/${v2.closed_today || 0} trades`}
          color="var(--blue)"
        />
        <StatCard
          label="Today P&L"
          value={`${v2.pnl_today >= 0 ? '+' : ''}₹${(v2.pnl_today || 0).toLocaleString('en-IN')}`}
          sub={`${v2.target_hits || 0} targets | ${v2.stop_hits || 0} stops`}
          color={(v2.pnl_today || 0) >= 0 ? 'var(--green)' : 'var(--red)'}
        />
        <StatCard
          label="Open Positions"
          value={openTrades.length}
          sub={`Max 5 | ${5 - openTrades.length} slots free`}
          color="var(--amber)"
        />
      </div>

      {/* Open trades table */}
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 10, overflow: 'hidden', marginBottom: 16,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 1, textTransform: 'uppercase' }}>
            Open Positions
          </div>
          <div style={{
            fontSize: 10, fontFamily: 'var(--font-mono)',
            background: 'var(--blue-dim)', color: 'var(--blue)',
            padding: '2px 8px', borderRadius: 10,
          }}>
            {openTrades.length} ACTIVE
          </div>
        </div>

        {openTrades.length === 0 ? (
          <div style={{ padding: '30px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            No open positions — waiting for 9:15 AM signals
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Stock', 'Dir', 'Entry', 'LTP', 'Target', 'Stop', 'P&L', 'Time'].map(h => (
                  <th key={h} style={{
                    padding: '8px 14px', textAlign: 'left',
                    fontSize: 9, color: 'var(--text-muted)',
                    letterSpacing: 1, textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {openTrades.map((trade, i) => {
                const livePnl = getLivePnl(trade)
                const livePct = getLivePct(trade)
                const ltp     = prices[trade.stock]?.ltp || trade.entry_price
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #0f1419' }}>
                    <td style={{
                      padding: '10px 14px', fontFamily: 'var(--font-mono)',
                      fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
                    }}>{trade.stock}</td>
                    <td style={{ padding: '10px 14px' }}><Badge dir={trade.direction}/></td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                      ₹{trade.entry_price?.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-primary)' }}>
                      ₹{ltp?.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)' }}>
                      ₹{trade.target?.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--red)' }}>
                      ₹{trade.stop?.toFixed(2)}
                    </td>
                    <td style={{
                      padding: '10px 14px', fontFamily: 'var(--font-mono)',
                      fontSize: 11, fontWeight: 600,
                      color: livePnl >= 0 ? 'var(--green)' : 'var(--red)',
                    }}>
                      {livePnl >= 0 ? '+' : ''}₹{livePnl.toFixed(0)}
                      <span style={{ fontSize: 9, opacity: 0.7, marginLeft: 4 }}>
                        ({livePct >= 0 ? '+' : ''}{livePct.toFixed(2)}%)
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                      {trade.entry_time}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Closed trades today */}
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 10, overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 1, textTransform: 'uppercase' }}>
            Closed Today
          </div>
          <div style={{
            fontSize: 10, fontFamily: 'var(--font-mono)',
            background: 'var(--purple-dim)', color: 'var(--purple)',
            padding: '2px 8px', borderRadius: 10,
          }}>
            {closedTrades.length} TRADES
          </div>
        </div>

        {closedTrades.length === 0 ? (
          <div style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            No closed trades yet today
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Stock', 'Dir', 'Entry', 'Exit', 'P&L', 'Exit Type', 'Hold'].map(h => (
                  <th key={h} style={{
                    padding: '8px 14px', textAlign: 'left',
                    fontSize: 9, color: 'var(--text-muted)',
                    letterSpacing: 1, textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {closedTrades.slice(0, 20).map((trade, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #0f1419' }}>
                  <td style={{
                    padding: '9px 14px', fontFamily: 'var(--font-mono)',
                    fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
                  }}>{trade.stock}</td>
                  <td style={{ padding: '9px 14px' }}><Badge dir={trade.direction}/></td>
                  <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                    ₹{trade.entry_price?.toFixed(2)}
                  </td>
                  <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                    ₹{trade.exit_price?.toFixed(2)}
                  </td>
                  <td style={{
                    padding: '9px 14px', fontFamily: 'var(--font-mono)',
                    fontSize: 11, fontWeight: 600,
                    color: (trade.pnl || 0) >= 0 ? 'var(--green)' : 'var(--red)',
                  }}>
                    {(trade.pnl || 0) >= 0 ? '+' : ''}₹{(trade.pnl || 0).toFixed(0)}
                  </td>
                  <td style={{ padding: '9px 14px' }}>
                    <ExitBadge reason={trade.exit_reason}/>
                  </td>
                  <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                    {trade.hold_mins}m
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
