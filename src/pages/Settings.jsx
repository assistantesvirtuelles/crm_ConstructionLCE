import React, { useEffect, useState } from 'react';
import { Plug, User, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Field from '../components/ui/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';
import { fetchUserSettings, upsertUserSettings } from '../lib/settings.js';

const PLACEHOLDER_SECTIONS = [
  { label: 'Espace de travail', description: "Nom de l'équipe, logo et détails du forfait" },
  { label: 'Notifications', description: 'Alertes et résumés par courriel' },
];

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
      <div style={{
        width: '42px', height: '42px', borderRadius: '12px',
        background: 'rgba(46,204,82,0.10)', border: '1px solid rgba(46,204,82,0.22)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={18} color="var(--orange)" strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>{title}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)' }}>{subtitle}</div>
      </div>
    </div>
  );
}

function SavedTag() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#48c78e', fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: 600 }}>
      <CheckCircle2 size={14} /> Enregistré
    </span>
  );
}

function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 'var(--radius-md)',
      background: 'rgba(252,129,129,0.10)', border: '1px solid rgba(252,129,129,0.25)',
      color: '#fc8181', fontFamily: 'var(--font-body)', fontSize: '13px',
    }}>
      {message}
    </div>
  );
}

function ProfileCard({ user }) {
  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    const { error } = await supabase.auth.updateUser({ data: { full_name: name.trim() } });
    if (error) {
      setError(error.message || "Erreur lors de l'enregistrement.");
      setSaving(false);
      return;
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Card style={{ padding: '24px' }}>
      <SectionHeader icon={User} title="Profil" subtitle="Votre nom et votre adresse courriel." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '18px' }}>
        <Field label="Nom complet" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nadia Dupuis" />
        <Field label="Courriel" value={user?.email || ''} onChange={() => {}} disabled />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button size="sm" onClick={save} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
          {saved && <SavedTag />}
        </div>
        <ErrorBox message={error} />
      </div>
    </Card>
  );
}

function SecurityCard() {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    setError('');
    setSaved(false);
    if (pw.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (pw !== pw2) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) {
      setError(error.message || 'Erreur lors de la mise à jour du mot de passe.');
      setSaving(false);
      return;
    }
    setSaving(false);
    setSaved(true);
    setPw('');
    setPw2('');
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Card style={{ padding: '24px' }}>
      <SectionHeader icon={Lock} title="Sécurité" subtitle="Modifiez votre mot de passe." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Field label="Nouveau mot de passe" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
          <Field label="Confirmer le mot de passe" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button size="sm" onClick={save} disabled={saving}>{saving ? 'Mise à jour…' : 'Mettre à jour'}</Button>
          {saved && <SavedTag />}
        </div>
        <ErrorBox message={error} />
      </div>
    </Card>
  );
}

function IntegrationsCard({ user }) {
  const [bookingUrl, setBookingUrl] = useState('');
  const [calendarId, setCalendarId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) return;
      setLoading(true);
      const { data } = await fetchUserSettings(user.id);
      if (!mounted) return;
      if (data) {
        setBookingUrl(data.booking_url || '');
        setCalendarId(data.calendar_id || '');
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    setError('');
    setSaved(false);
    const { error } = await upsertUserSettings(user.id, {
      booking_url: bookingUrl.trim() || null,
      calendar_id: calendarId.trim() || null,
    });
    if (error) {
      setError(error.message || "Erreur lors de l'enregistrement.");
      setSaving(false);
      return;
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Card style={{ padding: '24px' }}>
      <SectionHeader icon={Plug} title="Intégrations — Google Agenda" subtitle="Connectez votre propre page de réservation et votre agenda. Chaque utilisateur configure les siens." />
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '24px 0 4px', color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
          <Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Chargement…
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '18px' }}>
          <Field label="Lien de réservation Google (page de rendez-vous)" value={bookingUrl} onChange={(e) => setBookingUrl(e.target.value)} placeholder="https://calendar.app.google/…" />
          <Field label="ID de l'agenda Google" value={calendarId} onChange={(e) => setCalendarId(e.target.value)} placeholder="vous@votredomaine.ca" />
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text)' }}>Où les trouver :</strong> l'ID de l'agenda se trouve dans Google Agenda → Paramètres → [votre agenda] → « Intégrer l'agenda ». Le lien de réservation provient de votre planification de rendez-vous (Partager → copier le lien). Vous pouvez coller le lien complet — l'ID sera extrait automatiquement.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button size="sm" onClick={save} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
            {saved && <SavedTag />}
          </div>
          <ErrorBox message={error} />
        </div>
      )}
    </Card>
  );
}

function PlaceholderCard({ label, description }) {
  return (
    <Card style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '3px' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)' }}>{description}</div>
      </div>
      <span style={{
        fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600,
        color: 'var(--muted)', background: 'var(--surface-2)', border: '1px solid var(--border)',
        padding: '3px 10px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap',
      }}>
        Bientôt
      </span>
    </Card>
  );
}

export default function Settings() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeUp 0.35s ease both' }}>
      <ProfileCard user={user} />
      <SecurityCard />
      <IntegrationsCard user={user} />
      {PLACEHOLDER_SECTIONS.map((s) => (
        <PlaceholderCard key={s.label} label={s.label} description={s.description} />
      ))}
    </div>
  );
}
