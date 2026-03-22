import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTrading } from './hooks/useTrading.js'
import Sidebar from './components/Sidebar.jsx'
import LiveTrades from './pages/LiveTrades.jsx'
import Signals from './pages/Signals.jsx'
import EquityCurve from './pages/EquityCurve.jsx'
import { StrategyStats, TradeLog } from './pages/StatsAndLog.jsx'

export default function App() {
  const trading = useTrading()
  const capital = trading.stats?.V2?.capital || 100000

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar connected={trading.connected} capital={capital} />

        <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          <Routes>
            <Route path="/"        element={<LiveTrades    data={trading}/>}/>
            <Route path="/signals" element={<Signals       data={trading}/>}/>
            <Route path="/stats"   element={<StrategyStats data={trading}/>}/>
            <Route path="/equity"  element={<EquityCurve   data={trading}/>}/>
            <Route path="/log"     element={<TradeLog      data={trading}/>}/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
