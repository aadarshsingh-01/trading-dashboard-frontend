import Header from '../components/Header.jsx'

// ── Strategy Stats ──────────────────────────────────────
export function StrategyStats({ data }) {
  const { status, stats, connected } = data
  const v2 = stats?.V2 || {}

  const metrics = [
    ['Win Rate',        `${v2.win_rate || 0}%`,                 'var(--green)'],
    ['Total Return',    `${((v2.capital-100000)/1000).toFixed(1)}k`,  'var(--green)'],
    ['Capital',         `₹${(v2.capital||100000).toLocaleString('en-IN')}`, 'var(--green)'],
    ['Closed Trades',   v2.closed_today || 0,                   'var(--blue)'],
    ['Target Hits',     v2.target_hits || 0,                    'var(--green)'],
    ['Stop Hits',       v2.stop_hits || 0,                      'var(--red)'],
    ['EOD Exits',       v2.eod_exits || 0,                      'var(--amber)'],
    ['Open Positions',  v2.open_trades || 0,                    'var(--amber)'],
    ['Today P&L',       `${(v2.pnl_today||0)>=0?'+':''}₹${(v2.pnl_today||0).toFixed(0)}`, (v2.pnl_today||0)>=0?'var(--green)':'var(--red)'],
  ]

  return (
    <div>
      <Header title="Strategy Stats" connected={connected} marketOpen={status?.market_open} />

      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 10, overflow: 'hidden', marginBottom: 16,
      }}>
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--green)', animation: 'pulse 1.5s infinite',
          }}/>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 1 }}>
            PRE-MOVE V2 STRATEGY
          </div>
          <div style={{
            marginLeft: 'auto', fontSize: 10, fontFamily: 'var(--font-mono)',
            background: 'var(--green-dim)', color: 'var(--green)',
            padding: '2px 8px', borderRadius: 10,
          }}>PAPER MODE</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
          {metrics.map(([label, val, color], i) => (
            <div key={label} style={{
              padding: '16px 20px',
              borderRight: (i+1)%3 !== 0 ? '1px solid var(--border)' : 'none',
              borderBottom: i < 6 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                {label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color }}>
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '16px 20px',
      }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          Strategy Rules
        </div>
        {[
          ['Universe', 'All F&O stocks (~206 stocks)'],
          ['Signal', '5%+ intraday move detection'],
          ['Entry', 'EMA bullish + RSI>50 + MACD+ + Supertrend+1'],
          ['Entry Time', '9:20 AM (second 5-min candle)'],
          ['Target', '+3.0% from entry'],
          ['Stop Loss', '-1.5% from entry'],
          ['EOD Exit', '3:20 PM if target/stop not hit'],
          ['Max Positions', '5 per day'],
          ['Capital/Trade', '₹20,000'],
        ].map(([k, v]) => (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '8px 0', borderBottom: '1px solid #0f1419',
            fontSize: 12,
          }}>
            <span style={{ color: 'var(--text-muted)' }}>{k}</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', textAlign: 'right' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Trade Log ───────────────────────────────────────────
export function TradeLog({ data }) {
  const { status, closedTrades, connected } = data

  const wins   = closedTrades.filter(t => t.pnl > 0)
  const losses = closedTrades.filter(t => t.pnl <= 0)
  const totalPnl = closedTrades.reduce((s, t) => s + (t.pnl || 0), 0)

  return (
    <div>
      <Header title="Trade Log" connected={connected} marketOpen={status?.market_open} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
        {[
          ['Total Trades', closedTrades.length, 'var(--blue)'],
          ['Wins', wins.length, 'var(--green)'],
          ['Losses', losses.length, 'var(--red)'],
          ['Net P&L', `${totalPnl>=0?'+':''}₹${totalPnl.toFixed(0)}`, totalPnl>=0?'var(--green)':'var(--red)'],
        ].map(([label, val, color]) => (
          <div key={label} style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '14px 16px',
          }}>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
              {label}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color }}>
              {val}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 10, overflow: 'hidden',
      }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase' }}>
            All Trades ({closedTrades.length})
          </div>
        </div>

        {closedTrades.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            No trades yet — history will appear here
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Date', 'Stock', 'Dir', 'Entry T', 'Exit T', 'Entry ₹', 'Exit ₹', 'P&L', 'Hold', 'Exit'].map(h => (
                    <th key={h} style={{
                      padding: '8px 12px', textAlign: 'left',
                      fontSize: 9, color: 'var(--text-muted)',
                      letterSpacing: 1, textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {closedTrades.map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #0f1419' }}>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                      {t.date}
                    </td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {t.stock}
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{
                        background: t.direction==='LONG'?'var(--green-dim)':'var(--red-dim)',
                        color: t.direction==='LONG'?'var(--green)':'var(--red)',
                        padding: '2px 7px', borderRadius: 4, fontSize: 9,
                      }}>{t.direction}</span>
                    </td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{t.entry_time}</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{t.exit_time}</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 11 }}>₹{t.entry_price?.toFixed(2)}</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 11 }}>₹{t.exit_price?.toFixed(2)}</td>
                    <td style={{
                      padding: '8px 12px', fontFamily: 'var(--font-mono)',
                      fontSize: 11, fontWeight: 600,
                      color: (t.pnl||0)>=0?'var(--green)':'var(--red)',
                    }}>
                      {(t.pnl||0)>=0?'+':''}₹{(t.pnl||0).toFixed(0)}
                    </td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                      {t.hold_mins}m
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{
                        background: t.exit_reason==='TARGET'?'var(--green-dim)':t.exit_reason==='STOP'?'var(--red-dim)':'var(--amber-dim)',
                        color: t.exit_reason==='TARGET'?'var(--green)':t.exit_reason==='STOP'?'var(--red)':'var(--amber)',
                        padding: '2px 7px', borderRadius: 4, fontSize: 9,
                      }}>{t.exit_reason}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
