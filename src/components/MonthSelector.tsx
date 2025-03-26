// src/components/MonthSelector.tsx
import React from 'react'
import { MonthData } from '@/types'

interface MonthSelectorProps {
  months: MonthData[]
  currentMonthIndex: number
  onChangeMonthIndex: (index: number) => void
  onAddNextMonth: () => void
  onAddAssetModalOpen: () => void
  onExportData: () => void
  onImportDataFromFile: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function MonthSelector({
  months,
  currentMonthIndex,
  onChangeMonthIndex,
  onAddNextMonth,
  onAddAssetModalOpen,
  onExportData,
  onImportDataFromFile
}: MonthSelectorProps) {

  return (
    <div className="month-selector">
      <label>Seleziona mese: </label>
      <select
        value={currentMonthIndex}
        onChange={e => onChangeMonthIndex(parseInt(e.target.value))}
      >
        {months.map((m, i) => (
          <option key={m.id} value={i}>
            {m.name}
          </option>
        ))}
      </select>

      <button onClick={onAddNextMonth} className="add-month-btn">
        Aggiungi Mese Successivo
      </button>

      {/* Bottone per aprire la modale di creazione asset */}
      <button onClick={onAddAssetModalOpen}>
        Aggiungi Asset
      </button>

      <button onClick={onExportData} className="export-btn">
        Esporta JSON
      </button>

      <label className="import-label">
        Importa JSON
        <input
          type="file"
          accept=".json"
          onChange={onImportDataFromFile}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  )
}
