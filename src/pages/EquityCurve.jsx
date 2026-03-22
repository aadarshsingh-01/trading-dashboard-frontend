import Header from '../components/Header.jsx'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: '#111827', border: '1px solid var(--border)',
      borderRadius: 8, padding: '10px 14px', fontSize: 11,
      fontFamily: 'var(--font-mono)',
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Trade #{d.trade_num}</div>
      <div style={{ color: 'var(--green)', fontWeight: 700, fontSize: 14 }}>
        ₹{d.capital?.toLocaleString('en-IN')}
      </div>
      {d.pnl !== undefined && (
        <div style={{ color: d.pnl >= 0 ? 'var(--green)' : 'var(--red)', marginTop: 4 }}>
          {d.pnl >= 0 ? '+' : ''}₹{d.pnl?.toFixed(0)} ({d.exit_reason})
        </div>
      )}
    </div>
  )
}

export default function EquityCurve({ data }) {
  const { status, equity, connected, stats } = data
  const v2 = stats?.V2 || {}
  const capital = v2.capital || 100000
  const totalReturn = (((capital - 100000) / 100000) * 100).toFixed(2)

  const chartData = equity.length > 0
    ? [{ trade_num: 0, capital: 100000 }, ...equity]
    : [{ trade_num: 0, capital: 100000 }]

  return (
    <div>
      <Header title="Equity Curve" connected={connected} marketOpen={status?.market_open} />

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          ['Starting Capital', '₹1,00,000', 'var(--text-muted)'],
          ['Current Capital', `₹${capital.toLocaleString('en-IN')}`, 'var(--green)'],
          ['Total Return', `${parseFloat(totalReturn) >= 0 ? '+' : ''}${totalReturn}%`, parseFloat(totalReturn) >= 0 ? 'var(--green)' : 'var(--red)'],
          ['Total Trades', equity.length, 'var(--blue)'],
        ].map(([label, val, color]) => (
          <div key={label} style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '14px 16px',
          }}>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
              {label}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color }}>
              {val}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '16px',
      }}>
        <div style={{
          fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1,
          textTransform: 'uppercase', marginBottom: 16,
        }}>
          Portfolio Growth
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#00ff9d" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00ff9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2530" vertical={false}/>
            <XAxis
              dataKey="trade_num"
              tick={{ fill: '#4a5568', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false} tickLine={false}
              label={{ value: 'Trade #', position: 'insideBottom', offset: -2, fill: '#4a5568', fontSize: 10 }}
            />
            <YAxis
              tick={{ fill: '#4a5568', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false} tickLine={false}
              tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip/>}/>
            <ReferenceLine y={100000} stroke="#4a5568" strokeDasharray="4 4"/>
            <Area
              type="monotone" dataKey="capital"
              stroke="#00ff9d" strokeWidth={2}
              fill="url(#equityGrad)"
              dot={equity.length < 50 ? { fill: '#00ff9d', r: 3, strokeWidth: 0 } : false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
