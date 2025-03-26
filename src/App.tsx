import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import './styles.css'

// Modello dati per un singolo asset
interface Asset {
  code: string
  name: string
  percent: number
  weekly: number
  value: number
  manualMonthlyTarget: number
}

// Modello dati per un singolo mese
interface MonthData {
  id: number
  name: string
  assets: Asset[]
}

// Funzione per creare il mese iniziale
function createInitialMonth(id: number, name: string): MonthData {
  return {
    id,
    name,
    assets: [
      {
        code: 'IE00B4L5Y983',
        name: 'Core MSCI World',
        percent: 41,
        weekly: 33,
        value: 200,
        manualMonthlyTarget: 264,
      },
      {
        code: 'IE00BFNM3P36',
        name: 'MSCI EM IMI ESG',
        percent: 19,
        weekly: 15,
        value: 77,
        manualMonthlyTarget: 120,
      },
      {
        code: 'IE00BF4RFH31',
        name: 'MSCI World Small Cap',
        percent: 14,
        weekly: 11,
        value: 77,
        manualMonthlyTarget: 88,
      },
      {
        code: 'IE00B3WJKG14',
        name: 'S&P 500 Info Tech',
        percent: 9,
        weekly: 7,
        value: 77,
        manualMonthlyTarget: 56,
      },
      {
        code: 'IE00BYZK4552',
        name: 'Automation & Robotics',
        percent: 9,
        weekly: 7,
        value: 77,
        manualMonthlyTarget: 56,
      },
      {
        code: 'IE00BYXG2H39',
        name: 'NASDAQ USD Biotechnology',
        percent: 9,
        weekly: 7,
        value: 77,
        manualMonthlyTarget: 56,
      },
    ],
  }
}

const WEEKLY_BUDGET = 80

export default function App() {
  // Nessun localStorage
  const [months, setMonths] = useState<MonthData[]>([
    createInitialMonth(1, 'Aprile 2025')
  ])

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0)

  const currentMonth = months[currentMonthIndex]
  if (!currentMonth) {
    return <div>Nessun mese definito</div>
  }

  // Handlers per aggiornare i campi modificabili

  // Percentuale asset
  const handlePercentChange = (assetIndex: number, newValue: string) => {
    const newVal = parseFloat(newValue) || 0
    setMonths(prev => {
      const copy = [...prev]
      const monthCopy = { ...copy[currentMonthIndex] }
      const assetsCopy = [...monthCopy.assets]
      assetsCopy[assetIndex] = { ...assetsCopy[assetIndex], percent: newVal }
      monthCopy.assets = assetsCopy
      copy[currentMonthIndex] = monthCopy
      return copy
    })
  }

  // Quota Settimanale
  const handleWeeklyChange = (assetIndex: number, newValue: string) => {
    const newVal = parseFloat(newValue) || 0
    setMonths(prev => {
      const copy = [...prev]
      const monthCopy = { ...copy[currentMonthIndex] }
      const assetsCopy = [...monthCopy.assets]
      assetsCopy[assetIndex] = { ...assetsCopy[assetIndex], weekly: newVal }
      monthCopy.assets = assetsCopy
      copy[currentMonthIndex] = monthCopy
      return copy
    })
  }

  // Target Mensile
  const handleManualMonthlyTargetChange = (assetIndex: number, newValue: string) => {
    const newVal = parseFloat(newValue) || 0
    setMonths(prev => {
      const copy = [...prev]
      const monthCopy = { ...copy[currentMonthIndex] }
      const assetsCopy = [...monthCopy.assets]
      assetsCopy[assetIndex] = { ...assetsCopy[assetIndex], manualMonthlyTarget: newVal }
      monthCopy.assets = assetsCopy
      copy[currentMonthIndex] = monthCopy
      return copy
    })
  }

  // Valore Fine Mese
  const handleValueChange = (assetIndex: number, newValue: string) => {
    const newVal = parseFloat(newValue) || 0
    setMonths(prev => {
      const copy = [...prev]
      const monthCopy = { ...copy[currentMonthIndex] }
      const assetsCopy = [...monthCopy.assets]
      assetsCopy[assetIndex] = { ...assetsCopy[assetIndex], value: newVal }
      monthCopy.assets = assetsCopy
      copy[currentMonthIndex] = monthCopy
      return copy
    })
  }

  // Funzioni di calcolo
  function getPerformance(asset: Asset): number {
    const diff = asset.value - asset.manualMonthlyTarget
    const result = (diff / asset.manualMonthlyTarget) * 100
    return Math.round(result * 10000) / 10000
  }

  function getToDeposit(asset: Asset): number {
    const diff = asset.manualMonthlyTarget - asset.value
    return diff <= 0 ? 0 : Math.ceil(diff / 4)
  }

  function getTotalDeposit(month: MonthData) {
    return month.assets.reduce((sum, a) => sum + getToDeposit(a), 0)
  }

  function getTotalValue(month: MonthData) {
    return month.assets.reduce((sum, a) => sum + a.value, 0)
  }

  function getTotalManualTarget(month: MonthData) {
    return month.assets.reduce((sum, a) => sum + a.manualMonthlyTarget, 0)
  }

  function getWeeklyDiff(month: MonthData) {
    return getTotalDeposit(month) - WEEKLY_BUDGET
  }

  // Arrotondiamo a 2 cifre decimali
  function getMonthlyAssetPercent(asset: Asset, month: MonthData) {
    const totalVal = getTotalValue(month)
    if (totalVal <= 0) return 0
    const fraction = (asset.value / totalVal) * 100
    return parseFloat(fraction.toFixed(2)) // Restituisce, ad esempio, 12.34
  }

  // Aggiungi nuovo mese
  function addNextMonth() {
    setMonths(prev => {
      const lastMonth = prev[prev.length - 1]
      const newMonth: MonthData = {
        id: lastMonth.id + 1,
        name: 'Mese #' + (lastMonth.id + 1),
        assets: lastMonth.assets.map(a => ({
          ...a,
          manualMonthlyTarget: a.manualMonthlyTarget + a.weekly * 4,
          value: 0,
        })),
      }
      return [...prev, newMonth]
    })
    setCurrentMonthIndex(months.length)
  }

  // Export / Import
  function exportData() {
    const dataStr = JSON.stringify(months, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'pac-data.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  function importDataFromFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
      if (!e.target?.result) return
      try {
        const parsed = JSON.parse(e.target.result as string) as MonthData[]
        setMonths(parsed)
        setCurrentMonthIndex(0)
      } catch (err) {
        alert('File JSON non valido!')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="container">
      <h1 className="main-title">PAC Dashboard – Multi Mese</h1>

      <div className="month-selector">
        <label>Seleziona mese: </label>
        <select
          value={currentMonthIndex}
          onChange={e => setCurrentMonthIndex(parseInt(e.target.value))}
        >
          {months.map((m, i) => (
            <option key={m.id} value={i}>
              {m.name}
            </option>
          ))}
        </select>

        <button onClick={addNextMonth} className="add-month-btn">
          Aggiungi Mese Successivo
        </button>

        <button onClick={exportData} className="export-btn">Esporta JSON</button>
        <label className="import-label">
          Importa JSON
          <input
            type="file"
            accept=".json"
            onChange={importDataFromFile}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <h2 className="subtitle">{currentMonth.name}</h2>

      <div className="assets-grid">
        {currentMonth.assets.map((asset, idx) => (
          <Card key={asset.code} className="card improved-card">
            <CardContent>
              <div className="card-header improved-header">
                <div className="card-title title-gradient">{asset.name}</div>
                <div className="card-subtitle">({asset.code})</div>
              </div>
              <hr className="divider" />

              {/* % Asset modificabile */}
              <div className="info-row">
                <label className="info-label">% Asset:</label>
                <Input
                  type="number"
                  value={asset.percent}
                  onChange={e => handlePercentChange(idx, e.target.value)}
                  className="input custom-input"
                />
              </div>

              {/* Quota Settimanale modificabile */}
              <div className="info-row">
                <label className="info-label">Quota Settimanale:</label>
                <Input
                  type="number"
                  value={asset.weekly}
                  onChange={e => handleWeeklyChange(idx, e.target.value)}
                  className="input custom-input"
                />
              </div>

              {/* Target Mensile modificabile */}
              <div className="info-row">
                <label className="info-label">Target Mensile:</label>
                <Input
                  type="number"
                  value={asset.manualMonthlyTarget}
                  onChange={e => handleManualMonthlyTargetChange(idx, e.target.value)}
                  className="input custom-input"
                />
              </div>

              {/* Valore Fine Mese modificabile */}
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

              <hr className="divider" />
              <div className="info-row">
                <span className="info-label">Peso sul Totale:</span>
                <span className="info-value highlight">
                  {getMonthlyAssetPercent(asset, currentMonth)}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="card improved-card">
        <CardContent>
          <h2 className="card-title title-gradient">Riepilogo di {currentMonth.name}</h2>
          <hr className="divider" />
          <div className="info-row">
            <span className="info-label">Valore Attuale Totale:</span>
            <span className="info-value">€{getTotalValue(currentMonth)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Target Mensile Totale:</span>
            <span className="info-value">€{getTotalManualTarget(currentMonth)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Quota da Versare Complessiva:</span>
            <span className="info-value highlight">
              €{getTotalDeposit(currentMonth)}
            </span>
          </div>

          <hr className="divider" />
          <div className="info-row">
            <span className="info-label">Budget Settimanale:</span>
            <span className="info-value">€{WEEKLY_BUDGET}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Differenza Settimanale:</span>
            <span
              className="info-value"
              style={{ color: getWeeklyDiff(currentMonth) >= 0 ? '#dc2626' : '#16a34a' }}
            >
              {getWeeklyDiff(currentMonth) >= 0
                ? `+${getWeeklyDiff(currentMonth)}`
                : getWeeklyDiff(currentMonth)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
