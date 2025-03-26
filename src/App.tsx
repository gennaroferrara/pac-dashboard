import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import './styles.css'

// ----------------------------
// MODELLI DI DATI (INTERFACCE)
// ----------------------------
interface Asset {
  code: string
  name: string
  /**
   * (Facoltativo) Se avevi 'percent' come campo, ora NON è più modificato manualmente.
   * Potresti anche rimuoverlo del tutto dal tipo, se non ti serve più archiviare la vecchia percentuale.
//  percent: number
  **/
  weekly: number
  value: number
  manualMonthlyTarget: number
}

interface MonthData {
  id: number
  name: string
  assets: Asset[]
}

// ---------------------------------
// FUNZIONE PER CREARE UN MESE BASE
// ---------------------------------
function createInitialMonth(id: number, name: string): MonthData {
  return {
    id,
    name,
    assets: [
      {
        code: 'IE00B4L5Y983',
        name: 'Core MSCI World',
        // percent: 41,  // <-- se non vuoi più usare percent, puoi rimuoverlo
        weekly: 33,
        value: 200,
        manualMonthlyTarget: 264,
      },
      {
        code: 'IE00BFNM3P36',
        name: 'MSCI EM IMI ESG',
        // percent: 19,
        weekly: 15,
        value: 77,
        manualMonthlyTarget: 120,
      },
      {
        code: 'IE00BF4RFH31',
        name: 'MSCI World Small Cap',
        // percent: 14,
        weekly: 11,
        value: 77,
        manualMonthlyTarget: 88,
      },
      {
        code: 'IE00B3WJKG14',
        name: 'S&P 500 Info Tech',
        // percent: 9,
        weekly: 7,
        value: 77,
        manualMonthlyTarget: 56,
      },
      {
        code: 'IE00BYZK4552',
        name: 'Automation & Robotics',
        // percent: 9,
        weekly: 7,
        value: 77,
        manualMonthlyTarget: 56,
      },
      {
        code: 'IE00BYXG2H39',
        name: 'NASDAQ USD Biotechnology',
        // percent: 9,
        weekly: 7,
        value: 77,
        manualMonthlyTarget: 56,
      },
    ],
  }
}

// Budget settimanale
const WEEKLY_BUDGET = 80

// ------------------------
// COMPONENTE PRINCIPALE
// ------------------------
export default function App() {
  // Stato: array di mesi, con uno iniziale
  const [months, setMonths] = useState<MonthData[]>([
    createInitialMonth(1, 'Aprile 2025')
  ])

  // Indice del mese correntemente selezionato
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0)

  // Mese corrente, se esiste
  const currentMonth = months[currentMonthIndex]
  if (!currentMonth) return <div>Nessun mese definito</div>

  // ----------------------------------------
  // FUNZIONI: AGGIUNGERE / RIMUOVERE MESI
  // ----------------------------------------

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
    // Seleziona subito il mese aggiunto
    setCurrentMonthIndex(months.length)
  }

  // --------------------------------------
  // FUNZIONI: AGGIUNGERE / RIMUOVERE ASSET
  // --------------------------------------

  function handleAddAsset() {
    setMonths(prev => {
      const copy = [...prev]
      const monthCopy = { ...copy[currentMonthIndex] }
      const assetsCopy = [...monthCopy.assets]

      const newAsset: Asset = {
        code: '',
        name: '',
        // percent: 0, // se vuoi rimuoverlo, non serve
        weekly: 0,
        value: 0,
        manualMonthlyTarget: 0
      }

      assetsCopy.push(newAsset)
      monthCopy.assets = assetsCopy
      copy[currentMonthIndex] = monthCopy
      return copy
    })
  }

  function handleRemoveAsset(assetIndex: number) {
    setMonths(prev => {
      const copy = [...prev]
      const monthCopy = { ...copy[currentMonthIndex] }
      const assetsCopy = [...monthCopy.assets]

      assetsCopy.splice(assetIndex, 1)
      monthCopy.assets = assetsCopy
      copy[currentMonthIndex] = monthCopy
      return copy
    })
  }

  // ----------------------------------
  // HANDLER: MODIFICA CAMPI DI UN ASSET
  // ----------------------------------

  function handleNameChange(assetIndex: number, newValue: string) {
    setMonths(prev => {
      const copy = [...prev]
      const monthCopy = { ...copy[currentMonthIndex] }
      const assetsCopy = [...monthCopy.assets]

      assetsCopy[assetIndex] = { ...assetsCopy[assetIndex], name: newValue }
      monthCopy.assets = assetsCopy
      copy[currentMonthIndex] = monthCopy
      return copy
    })
  }

  function handleCodeChange(assetIndex: number, newValue: string) {
    setMonths(prev => {
      const copy = [...prev]
      const monthCopy = { ...copy[currentMonthIndex] }
      const assetsCopy = [...monthCopy.assets]

      assetsCopy[assetIndex] = { ...assetsCopy[assetIndex], code: newValue }
      monthCopy.assets = assetsCopy
      copy[currentMonthIndex] = monthCopy
      return copy
    })
  }

  // (NON abbiamo più handlePercentChange, perché % Asset si calcola dinamicamente!)

  function handleWeeklyChange(assetIndex: number, newValue: string) {
    const parsed = parseFloat(newValue) || 0
    setMonths(prev => {
      const copy = [...prev]
      const monthCopy = { ...copy[currentMonthIndex] }
      const assetsCopy = [...monthCopy.assets]

      assetsCopy[assetIndex] = { ...assetsCopy[assetIndex], weekly: parsed }
      monthCopy.assets = assetsCopy
      copy[currentMonthIndex] = monthCopy
      return copy
    })
  }

  function handleManualMonthlyTargetChange(assetIndex: number, newValue: string) {
    const parsed = parseFloat(newValue) || 0
    setMonths(prev => {
      const copy = [...prev]
      const monthCopy = { ...copy[currentMonthIndex] }
      const assetsCopy = [...monthCopy.assets]

      assetsCopy[assetIndex] = {
        ...assetsCopy[assetIndex],
        manualMonthlyTarget: parsed
      }
      monthCopy.assets = assetsCopy
      copy[currentMonthIndex] = monthCopy
      return copy
    })
  }

  function handleValueChange(assetIndex: number, newValue: string) {
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

  // -------------------------
  // FUNZIONI DI CALCOLO
  // -------------------------
  function getPerformance(asset: Asset): number {
    if (asset.manualMonthlyTarget === 0) return 0
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

  // Calcolo del Peso % sul totale target mensile del mese
  function getAssetPercentOfMonthTarget(asset: Asset, month: MonthData): number {
    const totalTarget = getTotalManualTarget(month)
    if (totalTarget <= 0) return 0
    const fraction = (asset.manualMonthlyTarget / totalTarget) * 100
    return parseFloat(fraction.toFixed(2)) // 2 cifre decimali
  }

  // Peso sul totale valore (se volevi anche quello, ma si può omettere)
  function getMonthlyAssetPercentValue(asset: Asset, month: MonthData): number {
    const totalVal = getTotalValue(month)
    if (totalVal <= 0) return 0
    const fraction = (asset.value / totalVal) * 100
    return parseFloat(fraction.toFixed(2))
  }

  // -----------------------------
  // EXPORT / IMPORT IN JSON
  // -----------------------------
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

  // ------------
  // RENDER
  // ------------
  return (
    <div className="container">
      <h1 className="main-title">PAC Dashboard – Multi Mese</h1>

      {/* Selettore Mese e bottoni Import/Export */}
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

        {/* Bottone per aggiungere una Card (Asset) nel mese corrente */}
        <button onClick={handleAddAsset}>Aggiungi Asset</button>

        {/* Export / Import JSON */}
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

      {/* Griglia di card per ciascun Asset */}
      <div className="assets-grid">
        {currentMonth.assets.map((asset, idx) => (
          <Card key={`${asset.code}-${idx}`} className="card improved-card">
            <CardContent>
              <div className="card-header improved-header">
                <div className="card-title title-gradient">
                  {asset.name || 'Nuovo ETF'}
                </div>
                <div className="card-subtitle">
                  ({asset.code || 'ISIN...'})
                </div>
              </div>
              <hr className="divider" />

              {/* Nome ETF */}
              <div className="info-row">
                <label className="info-label">Nome ETF:</label>
                <Input
                  type="text"
                  value={asset.name}
                  onChange={e => handleNameChange(idx, e.target.value)}
                  className="input custom-input"
                />
              </div>

              {/* ISIN / Codice */}
              <div className="info-row">
                <label className="info-label">ISIN:</label>
                <Input
                  type="text"
                  value={asset.code}
                  onChange={e => handleCodeChange(idx, e.target.value)}
                  className="input custom-input"
                />
              </div>

              {/* Quota Settimanale */}
              <div className="info-row">
                <label className="info-label">Quota Settimanale:</label>
                <Input
                  type="number"
                  value={asset.weekly}
                  onChange={e => handleWeeklyChange(idx, e.target.value)}
                  className="input custom-input"
                />
              </div>

              {/* Target Mensile */}
              <div className="info-row">
                <label className="info-label">Target Mensile:</label>
                <Input
                  type="number"
                  value={asset.manualMonthlyTarget}
                  onChange={e => handleManualMonthlyTargetChange(idx, e.target.value)}
                  className="input custom-input"
                />
              </div>

              {/* Valore Fine Mese */}
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

              {/* % Asset calcolata (non modificabile!) */}
              <div className="info-row">
                <span className="info-label">% Asset:</span>
                <span className="info-value">
                  {getAssetPercentOfMonthTarget(asset, currentMonth)}%
                </span>
              </div>

              {/* Andamento */}
              <div className="info-row">
                <span className="info-label">Andamento:</span>
                <span
                  className="info-value"
                  style={{ color: getPerformance(asset) < 0 ? '#dc2626' : '#16a34a' }}
                >
                  {getPerformance(asset)}%
                </span>
              </div>

              {/* Da Versare */}
              <div className="info-row">
                <span className="info-label">Da Versare:</span>
                <span className="info-value highlight">€{getToDeposit(asset)}</span>
              </div>

              {/* Peso sul Totale Valori (se lo usi ancora) */}
              <hr className="divider" />
              <div className="info-row">
                <span className="info-label">Peso sul Totale Valori:</span>
                <span className="info-value highlight">
                  {getMonthlyAssetPercentValue(asset, currentMonth)}%
                </span>
              </div>

              {/* Bottone per rimuovere la card */}
              <button onClick={() => handleRemoveAsset(idx)} style={{ marginTop: '8px' }}>
                Rimuovi Asset
              </button>
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
