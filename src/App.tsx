// File: App.tsx
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import './styles.css'

interface Asset {
  code: string
  name: string
  percent: number
  weekly: number
  value: number
}

// Inizializziamo l’array con i dati della tabella
const initialAssets: Asset[] = [
  {
    code: 'IE00B4L5Y983',
    name: 'Core MSCI World',
    percent: 41,
    weekly: 33,
    value: 200,
  },
  {
    code: 'IE00BFNM3P36',
    name: 'MSCI EM IMI ESG',
    percent: 19,
    weekly: 15,
    value: 77,
  },
  {
    code: 'IE00BF4RFH31',
    name: 'MSCI World Small Cap',
    percent: 14,
    weekly: 11,
    value: 77,
  },
  {
    code: 'IE00B3WJKG14',
    name: 'S&P 500 Info Tech',
    percent: 9,
    weekly: 7,
    value: 77,
  },
  {
    code: 'IE00BYZK4552',
    name: 'Automation & Robotics',
    percent: 9,
    weekly: 7,
    value: 77,
  },
  {
    code: 'IE00BYXG2H39',
    name: 'NASDAQ USD Biotechnology',
    percent: 9,
    weekly: 7,
    value: 77,
  },
]

// Supponiamo un budget settimanale fisso
const WEEKLY_BUDGET = 80

export default function App() {
  const [assets, setAssets] = useState<Asset[]>(() => {
    const stored = localStorage.getItem('allAssets')
    return stored ? JSON.parse(stored) : initialAssets
  })

  // Salvataggio in localStorage
  useEffect(() => {
    localStorage.setItem('allAssets', JSON.stringify(assets))
  }, [assets])

  // Quando l’utente cambia il valore a fine mese
  const handleValueChange = (index: number, newValue: string) => {
    const updated = [...assets]
    updated[index].value = parseFloat(newValue) || 0
    setAssets(updated)
  }

  // Target mensile = (quota settimanale * 4) * 2
  const getMonthlyTarget = (asset: Asset): number => asset.weekly * 4 * 2

  // Andamento = ((Valore attuale - (weekly*4)) / (weekly*4)) * 100
  const getPerformance = (asset: Asset): number => {
    const expected = asset.weekly * 4
    const diff = asset.value - expected
    const result = (diff / expected) * 100
    return Math.round(result * 10000) / 10000 // 4 decimali
  }

  // Quota da versare = se (targetMensile - valoreAttuale) < 0 => 0, altrimenti roundUp / 4
  const getToDeposit = (asset: Asset): number => {
    const diff = getMonthlyTarget(asset) - asset.value
    return diff < 0 ? 0 : Math.ceil(diff / 4)
  }

  // Somma totale “Da versare” su tutti gli asset
  const getTotalDeposit = () => {
    return assets.reduce((sum, a) => sum + getToDeposit(a), 0)
  }

  // Somma dei valori attuali
  const getTotalValue = () => {
    return assets.reduce((sum, a) => sum + a.value, 0)
  }

  // Somma dei target totali
  const getTotalMonthlyTarget = () => {
    return assets.reduce((sum, a) => sum + getMonthlyTarget(a), 0)
  }

  // Differenza (es. budget 80 vs spesa weekly reale)
  const getWeeklyDiff = () => {
    return getTotalDeposit() - WEEKLY_BUDGET
  }

  // Percentuale del singolo asset sul totale valori
  const getMonthlyAssetPercent = (asset: Asset) => {
    const totalVal = getTotalValue()
    if (totalVal <= 0) return 0
    const fraction = asset.value / totalVal * 100
    return Math.round(fraction * 10000) / 10000 // 4 decimali
  }

  return (
    <div className="container">
      <h1 className="main-title">PAC Dashboard – Multi Asset</h1>

      {/* Griglia a 3 colonne per le card */}
      <div className="assets-grid">
        {assets.map((asset, idx) => (
          <Card key={asset.code} className="card improved-card">
            <CardContent>
              <div className="card-header improved-header">
                <div className="card-title title-gradient">{asset.name}</div>
                <div className="card-subtitle">({asset.code})</div>
              </div>
              <hr className="divider" />
              <div className="info-row">
                <span className="info-label">% Asset:</span>
                <span className="info-value">{asset.percent}%</span>
              </div>
              <div className="info-row">
                <span className="info-label">Quota Settimanale:</span>
                <span className="info-value">€{asset.weekly}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Target Mensile:</span>
                <span className="info-value">€{getMonthlyTarget(asset)}</span>
              </div>
              <div className="info-row">
                <label className="info-label">Valore Fine Mese:</label>
                <Input
                  type="number"
                  value={asset.value}
                  onChange={e => handleValueChange(idx, e.target.value)}
                  className="input custom-input"
                />
              </div>
              <hr className="divider" />
              <div className="info-row">
                <span className="info-label">Andamento:</span>
                <span
                  className="info-value"
                  style={{ color: getPerformance(asset) < 0 ? '#dc2626' : '#16a34a' }}
                >
                  {getPerformance(asset)}%
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Da Versare:</span>
                <span className="info-value highlight">€{getToDeposit(asset)}</span>
              </div>

              {/* Nuovo: % sul totale valori mensili */}
              <hr className="divider" />
              <div className="info-row">
                <span className="info-label">Peso Attuale sul Totale:</span>
                <span className="info-value highlight">{getMonthlyAssetPercent(asset)}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Riepilogo Totale */}
      <Card className="card improved-card">
  <CardContent>
    <h2 className="card-title title-gradient">Riepilogo Totale</h2>
    <hr className="divider" />
    <div className="info-row">
      <span className="info-label">Valore Attuale Totale:</span>
      <span className="info-value">€{getTotalValue()}</span>
    </div>
    <div className="info-row">
      <span className="info-label">Target Mensile Totale:</span>
      <span className="info-value">€{getTotalMonthlyTarget()}</span>
    </div>
    <div className="info-row">
      <span className="info-label">Quota da Versare Complessiva:</span>
      <span className="info-value highlight">€{getTotalDeposit()}</span>
    </div>
    <hr className="divider" />
    {/* Weekly Info */}
    <div className="info-row">
      <span className="info-label">Budget Settimanale:</span>
      <span className="info-value">€{WEEKLY_BUDGET}</span>
    </div>
    <div className="info-row">
      <span className="info-label">Differenza Settimanale:</span>
      <span
        className="info-value"
        style={{ color: getWeeklyDiff() >= 0 ? '#dc2626' : '#16a34a' }}
      >
        {getWeeklyDiff() >= 0 ? `+${getWeeklyDiff()}` : getWeeklyDiff()}
      </span>
    </div>
  </CardContent>
</Card>

    </div>
  )
}