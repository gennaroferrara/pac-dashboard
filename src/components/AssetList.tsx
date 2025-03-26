import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MonthData, Asset } from '@/types'

interface AssetListProps {
  currentMonth: MonthData
  onWeeklyChange: (assetIndex: number, newVal: string) => void
  onManualMonthlyTargetChange: (assetIndex: number, newVal: string) => void
  onValueChange: (assetIndex: number, newVal: string) => void
  onRemoveAsset: (assetIndex: number) => void
  
  // Funzioni di calcolo
  getPerformance: (asset: Asset) => number
  getToDeposit: (asset: Asset) => number
  getAssetPercentOfMonthTarget: (asset: Asset, month: MonthData) => number
}

export function AssetList({
  currentMonth,
  onWeeklyChange,
  onManualMonthlyTargetChange,
  onValueChange,
  onRemoveAsset,
  getPerformance,
  getToDeposit,
  getAssetPercentOfMonthTarget
}: AssetListProps) {

  return (
    <div className="assets-grid">
      {currentMonth.assets.map((asset, idx) => (
        <Card key={`${asset.code}-${idx}`} className="card improved-card">
          <CardContent>
            <div className="card-header improved-header">
              <div className="card-title title-gradient">
                {asset.name || 'ETF Sconosciuto'}
              </div>
              <div className="card-subtitle">
                ({asset.code || 'ISIN non specificato'})
              </div>
            </div>
            <hr className="divider" />

            {/* Quota Settimanale */}
            <div className="info-row">
              <label className="info-label">Quota Settimanale:</label>
              <Input
                type="number"
                value={asset.weekly}
                onChange={e => onWeeklyChange(idx, e.target.value)}
                className="input custom-input"
              />
            </div>

            {/* Target Mensile */}
            <div className="info-row">
              <label className="info-label">Target Mensile:</label>
              <Input
                type="number"
                value={asset.manualMonthlyTarget}
                onChange={e => onManualMonthlyTargetChange(idx, e.target.value)}
                className="input custom-input"
              />
            </div>

            {/* Valore Fine Mese */}
            <div className="info-row">
              <label className="info-label">Valore Fine Mese:</label>
              <Input
                type="number"
                value={asset.value}
                onChange={e => onValueChange(idx, e.target.value)}
                className="input custom-input"
              />
            </div>

            <hr className="divider" />

            {/* % Asset (basata sul target) */}
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

            {/* Bottone rimuovi */}
            <hr className="divider" />
            <button onClick={() => onRemoveAsset(idx)} style={{ marginTop: '8px' }}>
              Rimuovi Asset
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
