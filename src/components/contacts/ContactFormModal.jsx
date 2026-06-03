import React, { useEffect, useState } from 'react';
import { Mail, Trash2 } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Field from '../ui/Field.jsx';
import { createContact, updateContact, deleteContact } from '../../lib/contacts.js';
import { fetchUserSettings, buildComposeUrl } from '../../lib/settings.js';
import { useAuth } from '../../context/AuthContext.jsx';

const EMPTY = {
  name: '', email: '', phone: '', company: '', title: '', industry: '', notes: '',
};

function fromContact(contact) {
  if (!contact) return { ...EMPTY };
  return {
    name: contact.name || '', email: contact.email || '', phone: contact.phone || '',
    company: contact.company || '', title: contact.title || '', industry: contact.industry || '',
    notes: contact.notes || '',
  };
}

export default function ContactFormModal({ open, onClose, contact = null, onSaved, onDeleted }) {
  const { user } = useAuth();
  const isEdit = Boolean(contact);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [composeUrl, setComposeUrl] = useState('');

  useEffect(() => {
    if (open) {
      setForm(fromContact(contact));
      setError('');
      setConfirmingDelete(false);
    }
  }, [open, contact]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!open || !isEdit || !user || !contact?.email) {
        setComposeUrl('');
        return;
      }
      const { data } = await fetchUserSettings(user.id);
      if (!mounted) return;
      const provider = data?.email_provider;
      setComposeUrl(
        provider ? buildComposeUrl(provider, { to: contact.email }, data?.email_address || '') : `mailto:${contact.email}`
      );
    })();
    return () => { mounted = false; };
  }, [open, isEdit, user, contact]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const close = () => { if (!saving) onClose?.(); };

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!form.name.trim()) { setError('Le nom est requis.'); return; }
    setSaving(true);
    setError('');
    const { error } = isEdit ? await updateContact(contact.id, form) : await createContact(form);
    if (error) {
      setError(error.message || "Une erreur s'est produite lors de l'enregistrement.");
      setSaving(false);
      return;
    }
    setSaving(false);
    onSaved?.();
    onClose?.();
  };

  const doDelete = async () => {
    setSaving(true);
    setError('');
    const { error } = await deleteContact(contact.id);
    if (error) {
      setError(error.message || 'Erreur lors de la suppression.');
      setSaving(false);
      return;
    }
    setSaving(false);
    onDeleted?.();
    onClose?.();
  };

  const footer = confirmingDelete ? (
    <>
      <span style={{ marginRight: 'auto', alignSelf: 'center', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)' }}>
        Supprimer définitivement ce contact ?
      </span>
      <Button variant="secondary" size="sm" onClick={() => setConfirmingDelete(false)} disabled={saving}>Annuler</Button>
      <Button variant="secondary" size="sm" onClick={doDelete} disabled={saving} style={{ color: '#fc8181', borderColor: 'rgba(252,129,129,0.35)' }}>
        {saving ? 'Suppression…' : 'Oui, supprimer'}
      </Button>
    </>
  ) : (
    <>
      {isEdit && (
        <Button variant="secondary" size="sm" icon={<Trash2 />} onClick={() => setConfirmingDelete(true)} disabled={saving} style={{ marginRight: 'auto', color: '#fc8181', borderColor: 'rgba(252,129,129,0.35)' }}>
          Supprimer
        </Button>
      )}
      <Button variant="secondary" size="sm" onClick={close} disabled={saving}>Annuler</Button>
      <Button size="sm" onClick={submit} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={close}
      title={isEdit ? 'Modifier le contact' : 'Ajouter un contact'}
      subtitle={isEdit ? 'Mettez à jour les informations du contact' : 'Saisissez les informations du nouveau contact'}
      footer={footer}
    >
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {isEdit && composeUrl && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant="secondary" size="sm" icon={<Mail />} onClick={() => window.open(composeUrl, '_blank', 'noopener,noreferrer')}>
              Envoyer un courriel
            </Button>
          </div>
        )}
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
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(252,129,129,0.10)', border: '1px solid rgba(252,129,129,0.25)', color: '#fc8181', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
            {error}
          </div>
        )}
        <button type="submit" style={{ display: 'none' }} aria-hidden="true" tabIndex={-1} />
      </form>
    </Modal>
  );
}
