// src/components/AddAssetModal.tsx

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'

// Props: un booleano "isOpen" per dire se la modale è aperta o chiusa,
// e due callback: "onConfirm" e "onClose".
interface AddAssetModalProps {
  isOpen: boolean
  onConfirm: (name: string, isin: string) => void
  onClose: () => void
}

export function AddAssetModal({ isOpen, onConfirm, onClose }: AddAssetModalProps) {
  // Stati locali per Nome e ISIN
  const [newName, setNewName] = useState('')
  const [newIsin, setNewIsin] = useState('')

  // Se la modale non è aperta, non renderizziamo nulla (ritorno null)
  if (!isOpen) {
    return null
  }

  // Quando l'utente fa clic su "Conferma"
  function handleConfirm() {
    if (!newName.trim() || !newIsin.trim()) {
      alert('Inserisci Nome ETF e ISIN!')
      return
    }
    // Passiamo i valori al parent e chiudiamo
    onConfirm(newName.trim(), newIsin.trim())
    // Resettiamo i campi (facoltativo)
    setNewName('')
    setNewIsin('')
  }

  // Quando la modale si apre, potresti resettare i campi
  // ma lo facciamo appena l’utente apre la modale (vedi App.tsx).

  return (
    // "overlay" scuro
    <div className="modal-overlay" onClick={onClose}>
      {/* Riquadro bianco interno */}
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Aggiungi Nuovo Asset</h2>

        <label>Nome ETF:</label>
        <Input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />

        <label>ISIN:</label>
        <Input
          type="text"
          value={newIsin}
          onChange={e => setNewIsin(e.target.value)}
        />

        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleConfirm} style={{ marginRight: '8px' }}>
            Conferma
          </button>
          <button onClick={onClose}>Annulla</button>
        </div>
      </div>
    </div>
  )
}
