import React, { useEffect, useState } from 'react';
import { Mail, UserPlus, Trash2 } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Field from '../ui/Field.jsx';
import { createLead, updateLead, deleteLead, LEAD_STATUSES } from '../../lib/leads.js';
import { fetchUserSettings, buildComposeUrl } from '../../lib/settings.js';
import { useAuth } from '../../context/AuthContext.jsx';

const EMPTY = {
  name: '', email: '', phone: '', company: '', title: '', status: 'new', source: '', notes: '', assigned_to: '',
};

function fromLead(lead) {
  if (!lead) return { ...EMPTY };
  return {
    name: lead.name || '', email: lead.email || '', phone: lead.phone || '',
    company: lead.company || '', title: lead.title || '', status: lead.status || 'new',
    source: lead.source || '', notes: lead.notes || '', assigned_to: lead.assigned_to || '',
  };
}

export default function LeadFormModal({ open, onClose, lead = null, onSaved, onDeleted, onConvert }) {
  const { user } = useAuth();
  const isEdit = Boolean(lead);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [composeUrl, setComposeUrl] = useState('');

  useEffect(() => {
    if (open) {
      setForm(fromLead(lead));
      setError('');
      setConfirmingDelete(false);
    }
  }, [open, lead]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!open || !isEdit || !user || !lead?.email) {
        setComposeUrl('');
        return;
      }
      const { data } = await fetchUserSettings(user.id);
      if (!mounted) return;
      const provider = data?.email_provider;
      setComposeUrl(
        provider ? buildComposeUrl(provider, { to: lead.email }, data?.email_address || '') : `mailto:${lead.email}`
      );
    })();
    return () => { mounted = false; };
  }, [open, isEdit, user, lead]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const close = () => { if (!saving) onClose?.(); };

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!form.name.trim()) { setError('Le nom est requis.'); return; }
    setSaving(true);
    setError('');
    const { error } = isEdit
      ? await updateLead(lead.id, form)
      : await createLead({ ...form, created_by: user?.id ?? null });
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
    const { error } = await deleteLead(lead.id);
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
        Supprimer définitivement ce prospect ?
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
      title={isEdit ? 'Modifier le prospect' : 'Ajouter un prospect'}
      subtitle={isEdit ? 'Mettez à jour les informations du prospect' : 'Saisissez les informations du nouveau prospect'}
      footer={footer}
    >
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {isEdit && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {composeUrl && (
              <Button variant="secondary" size="sm" icon={<Mail />} onClick={() => window.open(composeUrl, '_blank', 'noopener,noreferrer')}>
                Envoyer un courriel
              </Button>
            )}
            {lead?.status !== 'converted' && onConvert && (
              <Button variant="secondary" size="sm" icon={<UserPlus />} onClick={() => { onClose?.(); onConvert(lead); }}>
                Convertir en contact
              </Button>
            )}
          </div>
        )}
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
        <Field label="Assigné à" value={form.assigned_to} onChange={set('assigned_to')} placeholder="Nom du membre de l'équipe" />
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
