// MonthSelector.tsx
import React from 'react'
import { MonthData } from '../types'

interface MonthSelectorProps {
  months: MonthData[]
  currentMonthIndex: number
  onChangeMonthIndex: (newIndex: number) => void
  onAddNextMonth: () => void
  onExport: () => void
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function MonthSelector({
  months,
  currentMonthIndex,
  onChangeMonthIndex,
  onAddNextMonth,
  onExport,
  onImport
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

      <button onClick={onExport} className="export-btn">Esporta JSON</button>
      <label className="import-label">
        Importa JSON
        <input
          type="file"
          accept=".json"
          onChange={onImport}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  )
}
