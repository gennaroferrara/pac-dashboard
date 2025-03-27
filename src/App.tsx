// src/App.tsx

import React, { useState } from 'react'
import './styles.css'

import { Asset, MonthData } from '@/types'
import { AddAssetModal } from '@/components/AddAssetModal'
import { MonthSelector } from '@/components/MonthSelector'
import { AssetList } from '@/components/AssetList'
import { MonthSummaryCard } from '@/components/MonthSummaryCard'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Funzione per creare un mese iniziale
function createInitialMonth(id: number, name: string): MonthData {
  return {
    id,
    name,
    assets: [
      {
        code: 'IE00B4L5Y983',
        name: 'Core MSCI World',
        weekly: 33,
        value: 200,
        manualMonthlyTarget: 264,
      },
      {
        code: 'IE00BFNM3P36',
        name: 'MSCI EM IMI ESG',
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

const WEEKLY_BUDGET = 80

export default function App() {
  // Stato: array di mesi, con uno iniziale
  const [months, setMonths] = useState<MonthData[]>([
    createInitialMonth(1, 'Aprile 2025')
  ])

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0)
  const currentMonth = months[currentMonthIndex]
  if (!currentMonth) return <div>Nessun mese definito</div>

  // -- Logica modale per "Aggiungi Asset" --
  const [showModal, setShowModal] = useState(false)

  function handleAddAssetModalOpen() {
    setShowModal(true)
  }
  function handleCloseModal() {
    setShowModal(false)
  }

  // Riceviamo Nome e ISIN dal form nella modale
  function handleAddAssetConfirm(name: string, isin: string) {
    // Creiamo l'asset
    const newAsset: Asset = {
      name,
      code: isin,
      weekly: 0,
      value: 0,
      manualMonthlyTarget: 0
    }

    // Aggiungiamo al mese corrente
    setMonths(prev => {
      const copy = [...prev]
      const monthCopy = { ...copy[currentMonthIndex] }
      const assetsCopy = [...monthCopy.assets]
      assetsCopy.push(newAsset)
      monthCopy.assets = assetsCopy
      copy[currentMonthIndex] = monthCopy
      return copy
    })

    // Chiudiamo la modale
    setShowModal(false)
  }

  // Cambiare mese
  function handleChangeMonthIndex(index: number) {
    setCurrentMonthIndex(index)
  }

  // Aggiunge un nuovo mese clonando l'ultimo
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

  // Rimuovi asset
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

  // Handler per i campi di un asset
  function handleWeeklyChange(assetIndex: number, newVal: string) {
    const parsed = parseFloat(newVal) || 0
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

  function handleManualMonthlyTargetChange(assetIndex: number, newVal: string) {
    const parsed = parseFloat(newVal) || 0
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

  function handleValueChange(assetIndex: number, newVal: string) {
    const parsed = parseFloat(newVal) || 0
    setMonths(prev => {
      const copy = [...prev]
      const monthCopy = { ...copy[currentMonthIndex] }
      const assetsCopy = [...monthCopy.assets]
      assetsCopy[assetIndex] = { ...assetsCopy[assetIndex], value: parsed }
      monthCopy.assets = assetsCopy
      copy[currentMonthIndex] = monthCopy
      return copy
    })
  }

  // -----------------------
  // FUNZIONI DI CALCOLO
  // -----------------------
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

  function getAssetPercentOfMonthTarget(asset: Asset, month: MonthData): number {
    const totalTarget = getTotalManualTarget(month)
    if (totalTarget <= 0) return 0
    const fraction = (asset.manualMonthlyTarget / totalTarget) * 100
    return parseFloat(fraction.toFixed(2))
  }

  function getValuePercentOfMonth(asset: Asset, month: MonthData): number {
    const totalVal = getTotalValue(month) // esiste già
    if (totalVal <= 0) return 0
    const fraction = (asset.value / totalVal) * 100
    // Arrotondiamo a 2 cifre decimali
    return parseFloat(fraction.toFixed(2))
  }
  

  // -----------------------
  // EXPORT / IMPORT
  // -----------------------
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
  const COLORS = ['black', 'black', 'black', 'black', 'black', 'black'];

  // ---------------
  // RENDER
  // ---------------
  return (
    <div className="container">
      <h1 className="main-title">PAC Dashboard</h1>

      {/* Selettore Mese */}
      <MonthSelector
        months={months}
        currentMonthIndex={currentMonthIndex}
        onChangeMonthIndex={handleChangeMonthIndex}
        onAddNextMonth={addNextMonth}
        onAddAssetModalOpen={handleAddAssetModalOpen}
        onExportData={exportData}
        onImportDataFromFile={importDataFromFile}
      />

      <h2 className="subtitle">{currentMonth.name}</h2>

      {/* Elenco Asset */}
      <AssetList
        currentMonth={currentMonth}
        onWeeklyChange={handleWeeklyChange}
        onManualMonthlyTargetChange={handleManualMonthlyTargetChange}
        onValueChange={handleValueChange}
        onRemoveAsset={handleRemoveAsset}
        getPerformance={getPerformance}
        getToDeposit={getToDeposit}
        getAssetPercentOfMonthTarget={getAssetPercentOfMonthTarget}
        getValuePercentOfMonth={getValuePercentOfMonth}

      />

      {/* Riepilogo Mese */}
      <MonthSummaryCard
        currentMonth={currentMonth}
        WEEKLY_BUDGET={WEEKLY_BUDGET}
        getTotalValue={getTotalValue}
        getTotalManualTarget={getTotalManualTarget}
        getTotalDeposit={getTotalDeposit}
        getWeeklyDiff={getWeeklyDiff}
      />

      <div className="charts-container">
        <div className="chart-wrapper">
          <h3>Distribuzione Target Mensile</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={currentMonth.assets}
                dataKey="manualMonthlyTarget"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
              >
                {currentMonth.assets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-wrapper">
          <h3>Confronto Valore vs Target</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentMonth.assets}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Valore Attuale" fill="lightgreen" />
              <Bar dataKey="manualMonthlyTarget" name="Target Mensile" fill="green" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Modale per Aggiunta Asset */}
      <AddAssetModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleAddAssetConfirm}
      />
    </div>
  )
}



