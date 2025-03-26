// MonthSummaryCard.tsx
import { Card, CardContent } from '@/components/ui/card'
import { MonthData } from '../types'

interface MonthSummaryCardProps {
  currentMonth: MonthData
  getTotalValue: (m: MonthData) => number
  getTotalManualTarget: (m: MonthData) => number
  getTotalDeposit: (m: MonthData) => number
  getWeeklyDiff: (m: MonthData) => number
  WEEKLY_BUDGET: number
}

export function MonthSummaryCard({
  currentMonth,
  getTotalValue,
  getTotalManualTarget,
  getTotalDeposit,
  getWeeklyDiff,
  WEEKLY_BUDGET
}: MonthSummaryCardProps) {

  return (
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
  )
}
