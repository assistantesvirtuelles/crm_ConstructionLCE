import React, { useEffect, useMemo, useState } from 'react';
import { Contact, Plus, Search, Loader2 } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ContactFormModal from '../components/contacts/ContactFormModal.jsx';
import { fetchContacts } from '../lib/contacts.js';

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('fr-CA');
  } catch {
    return '—';
  }
}

const COLUMNS = [
  { key: 'name', label: 'Nom', flex: 2 },
  { key: 'email', label: 'Courriel', flex: 2 },
  { key: 'company', label: 'Entreprise', flex: 2 },
  { key: 'title', label: 'Titre', flex: 1.5 },
  { key: 'industry', label: 'Industrie', flex: 1.5 },
  { key: 'created_at', label: 'Créé le', flex: 1 },
];

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await fetchContacts();
    if (error) {
      setError(error.message || 'Impossible de charger les contacts.');
    } else {
      setContacts(data || []);
      setError('');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) =>
      [c.name, c.email, c.company].some((v) => v && v.toLowerCase().includes(q))
    );
  }, [contacts, query]);

  return (
    <div style={{ animation: 'fadeUp 0.35s ease both' }}>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          gap: '12px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--surface-2)',
            border: `1px solid ${searchFocused ? 'rgba(46,204,82,0.4)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '7px 14px',
            minWidth: '240px',
            transition: 'border-color 0.18s ease',
          }}>
            <Search size={13} color="var(--muted)" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Rechercher des contacts…"
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--text)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                width: '100%',
              }}
            />
          </div>

          <Button size="sm" icon={<Plus />} onClick={() => setShowAdd(true)}>
            Ajouter un contact
          </Button>
        </div>

        {/* Body */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '48px', color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
            <Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} />
            Chargement des contacts…
          </div>
        ) : error ? (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: '#fc8181', marginBottom: '8px' }}>
              Impossible de charger les contacts
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>
              {error}
            </div>
          </div>
        ) : contacts.length === 0 ? (
          <EmptyState
            icon={Contact}
            title="Aucun contact pour le moment"
            description="Ajoutez votre premier contact, ou convertissez un prospect en contact depuis la page Prospects."
            action={
              <Button size="sm" icon={<Plus />} onClick={() => setShowAdd(true)} style={{ marginTop: '4px' }}>
                Ajouter un contact
              </Button>
            }
          />
        ) : (
          <div>
            {/* Column headers */}
            <div style={{ display: 'flex', padding: '10px 24px', borderBottom: '1px solid var(--border)', gap: '16px' }}>
              {COLUMNS.map((col) => (
                <div key={col.key} style={{
                  flex: col.flex,
                  fontFamily: 'var(--font-display)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {col.label}
                </div>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((c) => (
              <div key={c.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '13px 24px',
                borderBottom: '1px solid var(--border)',
                gap: '16px',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
              }}>
                <div style={{ flex: 2, color: 'var(--text)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                <div style={{ flex: 2, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.email || '—'}</div>
                <div style={{ flex: 2, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.company || '—'}</div>
                <div style={{ flex: 1.5, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title || '—'}</div>
                <div style={{ flex: 1.5, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.industry || '—'}</div>
                <div style={{ flex: 1, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{formatDate(c.created_at)}</div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{ padding: '32px 24px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)' }}>
                Aucun contact ne correspond à « {query} ».
              </div>
            )}

            <div style={{ padding: '12px 24px', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)' }}>
              {filtered.length} contact{filtered.length > 1 ? 's' : ''}
              {query.trim() && contacts.length !== filtered.length ? ` sur ${contacts.length}` : ''}
            </div>
          </div>
        )}
      </Card>

      <ContactFormModal open={showAdd} onClose={() => setShowAdd(false)} onCreated={load} />
    </div>
  );
}
