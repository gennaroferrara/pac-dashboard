// src/types.ts

export interface Asset {
  code: string      // ISIN inserito alla creazione
  name: string      // Nome ETF inserito alla creazione
  weekly: number
  value: number
  manualMonthlyTarget: number
}

export interface MonthData {
  id: number
  name: string
  assets: Asset[]
}
