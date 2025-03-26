// File: App.tsx
import { useState, useEffect } from 'react'
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
  // Il target mensile di base (personalizzato) per questo mese
  manualMonthlyTarget: number
}

// Modello dati per un singolo mese
interface MonthData {
  id: number
  name: string
  assets: Asset[]
}

// Funzione per creare il mese iniziale (puoi personalizzare i valori)
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
        manualMonthlyTarget: 264, // es. 33 * 4 * 2
      },
      {
        code: 'IE00BFNM3P36',
        name: 'MSCI EM IMI ESG',
        percent: 19,
        weekly: 15,
        value: 77,
        manualMonthlyTarget: 120, // 15 * 4 * 2
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

// Budget settimanale di riferimento
const WEEKLY_BUDGET = 80

export default function App() {
  // Stato con l'array di mesi
  const [months, setMonths] = useState<MonthData[]>(() => {
    const stored = localStorage.getItem('allMonths')
    if (stored) {
      return JSON.parse(stored) as MonthData[]
    }
    // Se non c'è nulla in localStorage, creiamo un mese iniziale
    return [createInitialMonth(1, 'Aprile 2025')]
  })

  // Stato per sapere quale mese stiamo visualizzando (indice)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0)

  // Salviamo i dati in localStorage ogni volta che months cambia
  useEffect(() => {
    localStorage.setItem('allMonths', JSON.stringify(months))
  }, [months])

  // Mese corrente
  const currentMonth = months[currentMonthIndex]

  // Se non abbiamo mesi, non mostriamo nulla
  if (!currentMonth) {
    return <div>Nessun mese definito</div>
  }

  // Quando l'utente cambia il valore a fine mese di un asset
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

  // Esempio: se vogliamo calcolare l'andamento in base a manualMonthlyTarget
  function getPerformance(asset: Asset): number {
    // differenza tra il valore attuale e la metà del target? O 4 settimane?
    // Dipende dalla tua logica. Qui usiamo manualMonthlyTarget come base
    const diff = asset.value - asset.manualMonthlyTarget
    const result = (diff / asset.manualMonthlyTarget) * 100
    return Math.round(result * 10000) / 10000
  }

  // Quota da versare = differenza dal manualMonthlyTarget, diviso 4
  function getToDeposit(asset: Asset): number {
    const diff = asset.manualMonthlyTarget - asset.value
    return diff <= 0 ? 0 : Math.ceil(diff / 4)
  }

  // Somma su tutti gli asset del mese
  function getTotalDeposit(month: MonthData) {
    return month.assets.reduce((sum, a) => sum + getToDeposit(a), 0)
  }

  function getTotalValue(month: MonthData) {
    return month.assets.reduce((sum, a) => sum + a.value, 0)
  }

  function getTotalManualTarget(month: MonthData) {
    return month.assets.reduce((sum, a) => sum + a.manualMonthlyTarget, 0)
  }

  // Differenza settimanale: Quota da Versare - WEEKLY_BUDGET
  function getWeeklyDiff(month: MonthData) {
    return getTotalDeposit(month) - WEEKLY_BUDGET
  }

  // Percentuale del singolo asset sul totale valori
  function getMonthlyAssetPercent(asset: Asset, month: MonthData) {
    const totalVal = getTotalValue(month)
    if (totalVal <= 0) return 0
    const fraction = (asset.value / totalVal) * 100
    return Math.round(fraction * 10000) / 10000
  }

  // Aggiunge un nuovo mese, clonando i dati dal mese attuale e incrementando i target
  // come richiesto: target nuovo mese = target attuale + weekly*4
  function addNextMonth() {
    setMonths(prev => {
      const oldMonth = prev[currentMonthIndex]
      const newMonth: MonthData = {
        id: oldMonth.id + 1,
        name: 'Mese #' + (oldMonth.id + 1),
        assets: oldMonth.assets.map(a => ({
          ...a,
          // Esempio: incrementa manualMonthlyTarget di weekly*4
          manualMonthlyTarget: a.manualMonthlyTarget + a.weekly * 4,
          // se vuoi azzerare il value per il nuovo mese
          value: 0,
        })),
      }
      return [...prev, newMonth]
    })
    // Se vuoi passare subito al nuovo mese...
    setCurrentMonthIndex(months.length) // perché l'abbiamo appena aggiunto in coda
  }

  return (
    <div className="container">
      <h1 className="main-title">PAC Dashboard – Multi Mese</h1>

      {/* Selettore mese */}
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
      </div>

      <h2 className="subtitle">{currentMonth.name}</h2>

      {/* Griglia con i singoli asset del mese corrente */}
      <div className="assets-grid">
        {currentMonth.assets.map((asset, idx) => (
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
                <span className="info-value">€{asset.manualMonthlyTarget}</span>
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

              <hr className="divider" />
              <div className="info-row">
                <span className="info-label">Peso sul Totale:</span>
                <span className="info-value highlight">{getMonthlyAssetPercent(asset, currentMonth)}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Riepilogo Totale per il mese corrente */}
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
            <span className="info-value highlight">€{getTotalDeposit(currentMonth)}</span>
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
