import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Field from '../ui/Field.jsx';
import { createLead, LEAD_STATUSES } from '../../lib/leads.js';
import { useAuth } from '../../context/AuthContext.jsx';

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  company: '',
  title: '',
  status: 'new',
  source: '',
  notes: '',
};

export default function LeadFormModal({ open, onClose, onCreated }) {
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
      setError('Le nom est requis.');
      return;
    }
    setSaving(true);
    setError('');
    const { error } = await createLead({ ...form, created_by: user?.id ?? null });
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
      title="Ajouter un prospect"
      subtitle="Saisissez les informations du nouveau prospect"
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
        <Field label="Nom" required value={form.name} onChange={set('name')} placeholder="Jean Tremblay" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Field label="Courriel" type="email" value={form.email} onChange={set('email')} placeholder="jean@entreprise.com" />
          <Field label="Téléphone" value={form.phone} onChange={set('phone')} placeholder="514 555-0199" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Field label="Entreprise" value={form.company} onChange={set('company')} placeholder="Constructions ABC" />
          <Field label="Titre / poste" value={form.title} onChange={set('title')} placeholder="Directeur de projet" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Field label="Statut" options={LEAD_STATUSES} value={form.status} onChange={set('status')} />
          <Field label="Source" value={form.source} onChange={set('source')} placeholder="Référence, site web…" />
        </div>
        <Field label="Notes" textarea value={form.notes} onChange={set('notes')} placeholder="Informations supplémentaires…" />

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

        {/* Hidden submit so Enter submits the form */}
        <button type="submit" style={{ display: 'none' }} aria-hidden="true" tabIndex={-1} />
      </form>
    </Modal>
  );
}
