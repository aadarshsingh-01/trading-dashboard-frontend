import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://159.65.153.191:8000'
const WS_URL   = API_BASE.replace('http', 'ws') + '/ws'

export function useTrading() {
  const [status,       setStatus]       = useState(null)
  const [stats,        setStats]        = useState(null)
  const [openTrades,   setOpenTrades]   = useState([])
  const [closedTrades, setClosedTrades] = useState([])
  const [signals,      setSignals]      = useState([])
  const [equity,       setEquity]       = useState([])
  const [prices,       setPrices]       = useState({})
  const [connected,    setConnected]    = useState(false)
  const [lastUpdate,   setLastUpdate]   = useState(null)

  const wsRef = useRef(null)
  const pingRef = useRef(null)

  // ── REST fetchers ──────────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      const [s, st, ot, ct, sig, eq] = await Promise.all([
        axios.get(`${API_BASE}/api/status`),
        axios.get(`${API_BASE}/api/stats`),
        axios.get(`${API_BASE}/api/trades/open`),
        axios.get(`${API_BASE}/api/trades/closed`),
        axios.get(`${API_BASE}/api/signals`),
        axios.get(`${API_BASE}/api/equity`),
      ])
      setStatus(s.data)
      setStats(st.data)
      setOpenTrades(ot.data)
      setClosedTrades(ct.data)
      setSignals(sig.data)
      setEquity(eq.data)
      setLastUpdate(new Date())
    } catch (e) {
      console.error('API fetch error:', e)
    }
  }, [])

  // ── WebSocket ──────────────────────────────────────────
  const connectWS = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      // Ping every 20s to keep alive
      pingRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send('ping')
      }, 20000)
    }

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      setLastUpdate(new Date())

      switch (msg.type) {
        case 'init':
          setStats(msg.stats)
          setOpenTrades(msg.trades || [])
          break

        case 'tick':
          setPrices(prev => ({ ...prev, ...msg.data }))
          break

        case 'signals':
          setSignals(msg.data || [])
          break

        case 'trade_update':
          setOpenTrades(msg.trades || [])
          break

        case 'trade_closed':
          setOpenTrades(prev => prev.filter(t => t.id !== msg.trade.id))
          setClosedTrades(prev => [msg.trade, ...prev])
          setStats(prev => ({
            ...prev,
            V2: { ...prev?.V2, capital: msg.capital }
          }))
          setEquity(prev => [...prev, {
            trade_num: prev.length + 1,
            capital: msg.capital,
            pnl: msg.trade.pnl,
            exit_reason: msg.trade.exit_reason,
          }])
          break

        case 'pong':
          break
      }
    }

    ws.onclose = () => {
      setConnected(false)
      clearInterval(pingRef.current)
      // Reconnect after 3s
      setTimeout(connectWS, 3000)
    }

    ws.onerror = () => ws.close()
  }, [])

  useEffect(() => {
    fetchAll()
    connectWS()
    // Refresh REST data every 30s
    const interval = setInterval(fetchAll, 30000)
    return () => {
      clearInterval(interval)
      clearInterval(pingRef.current)
      wsRef.current?.close()
    }
  }, [fetchAll, connectWS])

  return {
    status, stats, openTrades, closedTrades,
    signals, equity, prices, connected, lastUpdate,
    refresh: fetchAll,
  }
}
