import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Field from '../ui/Field.jsx';
import { createDeal, JOB_TYPES, DEAL_STAGES } from '../../lib/deals.js';
import { useAuth } from '../../context/AuthContext.jsx';

const EMPTY = {
  name: '',
  company: '',
  job_type: '',
  value: '',
  stage: 'prospecting',
  expected_close_date: '',
  notes: '',
};

const JOB_TYPE_OPTIONS = [
  { value: '', label: 'Sélectionner un type…' },
  ...JOB_TYPES.map((t) => ({ value: t, label: t })),
];

export default function DealFormModal({ open, onClose, onCreated }) {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const close = () => {
    if (saving) return;
    setForm(EMPTY);
    setError('');
    onClose?.();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Le nom de l'opportunité est requis.");
      return;
    }
    setSaving(true);
    setError('');
    const { error } = await createDeal({ ...form, created_by: user?.id ?? null });
    if (error) {
      setError(error.message || "Une erreur s'est produite lors de l'enregistrement.");
      setSaving(false);
      return;
    }
    setSaving(false);
    setForm(EMPTY);
    onCreated?.();
    onClose?.();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Créer une opportunité"
      subtitle="Saisissez les informations de l'opportunité"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={close} disabled={saving}>
            Annuler
          </Button>
          <Button size="sm" onClick={submit} disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Field label="Nom de l'opportunité" required value={form.name} onChange={set('name')} placeholder="Rénovation cuisine — Tremblay" />
        <Field label="Client / entreprise" value={form.company} onChange={set('company')} placeholder="Constructions ABC" />
        <Field label="Type de travaux" options={JOB_TYPE_OPTIONS} value={form.job_type} onChange={set('job_type')} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Field label="Valeur ($ CAD)" type="number" value={form.value} onChange={set('value')} placeholder="150000" />
          <Field label="Étape" options={DEAL_STAGES} value={form.stage} onChange={set('stage')} />
        </div>
        <Field label="Date de clôture prévue" type="date" value={form.expected_close_date} onChange={set('expected_close_date')} />
        <Field label="Notes" textarea value={form.notes} onChange={set('notes')} placeholder="Détails du projet…" />

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(252,129,129,0.10)',
            border: '1px solid rgba(252,129,129,0.25)',
            color: '#fc8181',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        <button type="submit" style={{ display: 'none' }} aria-hidden="true" tabIndex={-1} />
      </form>
    </Modal>
  );
}
