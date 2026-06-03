import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Field from '../ui/Field.jsx';
import { createContact } from '../../lib/contacts.js';

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  company: '',
  title: '',
  industry: '',
  notes: '',
};

export default function ContactFormModal({ open, onClose, onCreated }) {
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
    const { error } = await createContact(form);
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
      title="Ajouter un contact"
      subtitle="Saisissez les informations du nouveau contact"
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
        <Field label="Nom" required value={form.name} onChange={set('name')} placeholder="Marie Côté" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Field label="Courriel" type="email" value={form.email} onChange={set('email')} placeholder="marie@entreprise.com" />
          <Field label="Téléphone" value={form.phone} onChange={set('phone')} placeholder="514 555-0199" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Field label="Entreprise" value={form.company} onChange={set('company')} placeholder="Constructions ABC" />
          <Field label="Titre / poste" value={form.title} onChange={set('title')} placeholder="Propriétaire" />
        </div>
        <Field label="Industrie" value={form.industry} onChange={set('industry')} placeholder="Construction, immobilier…" />
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

        <button type="submit" style={{ display: 'none' }} aria-hidden="true" tabIndex={-1} />
      </form>
    </Modal>
  );
}
