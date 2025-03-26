// AssetCard.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Asset, MonthData } from '../types'

interface AssetCardProps {
  asset: Asset
  assetIndex: number
  currentMonth: MonthData
  
  // Funzioni per gestire i cambi
  onPercentChange: (assetIndex: number, newVal: string) => void
  onWeeklyChange: (assetIndex: number, newVal: string) => void
  onTargetChange: (assetIndex: number, newVal: string) => void
  onValueChange: (assetIndex: number, newVal: string) => void

  // Funzioni di calcolo
  getPerformance: (asset: Asset) => number
  getToDeposit: (asset: Asset) => number
  getMonthlyAssetPercent: (asset: Asset, month: MonthData) => number
}

export function AssetCard({
  asset,
  assetIndex,
  currentMonth,
  onPercentChange,
  onWeeklyChange,
  onTargetChange,
  onValueChange,
  getPerformance,
  getToDeposit,
  getMonthlyAssetPercent
}: AssetCardProps) {

  return (
    <Card className="card improved-card">
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
            onChange={e => onPercentChange(assetIndex, e.target.value)}
            className="input custom-input"
          />
        </div>

        {/* Quota Settimanale modificabile */}
        <div className="info-row">
          <label className="info-label">Quota Settimanale:</label>
          <Input
            type="number"
            value={asset.weekly}
            onChange={e => onWeeklyChange(assetIndex, e.target.value)}
            className="input custom-input"
          />
        </div>

        {/* Target Mensile modificabile */}
        <div className="info-row">
          <label className="info-label">Target Mensile:</label>
          <Input
            type="number"
            value={asset.manualMonthlyTarget}
            onChange={e => onTargetChange(assetIndex, e.target.value)}
            className="input custom-input"
          />
        </div>

        {/* Valore Fine Mese modificabile */}
        <div className="info-row">
          <label className="info-label">Valore Fine Mese:</label>
          <Input
            type="number"
            value={asset.value}
            onChange={e => onValueChange(assetIndex, e.target.value)}
            className="input custom-input"
          />
        </div>

        <hr className="divider" />
        <div className="info-row">
          <span className="info-label">% Da compensare:</span>
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
  )
}
