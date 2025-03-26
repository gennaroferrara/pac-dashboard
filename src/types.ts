// types.ts
export interface Asset {
    code: string
    name: string
    percent: number
    weekly: number
    value: number
    manualMonthlyTarget: number
  }
  
  export interface MonthData {
    id: number
    name: string
    assets: Asset[]
  }
  