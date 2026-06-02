import React, { useEffect, useMemo, useState } from 'react';
import { Users, Plus, Upload, Search, Loader2 } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import StatusPill from '../components/ui/StatusPill.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import LeadFormModal from '../components/leads/LeadFormModal.jsx';
import ImportLeadsModal from '../components/leads/ImportLeadsModal.jsx';
import { fetchLeads, getStatusMeta } from '../lib/leads.js';

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
  { key: 'status', label: 'Statut', flex: 1 },
  { key: 'source', label: 'Source', flex: 1 },
  { key: 'created_at', label: 'Créé le', flex: 1 },
];

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await fetchLeads();
    if (error) {
      setError(error.message || 'Impossible de charger les prospects.');
    } else {
      setLeads(data || []);
      setError('');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) =>
      [l.name, l.email, l.company].some((v) => v && v.toLowerCase().includes(q))
    );
  }, [leads, query]);

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
              placeholder="Rechercher des prospects…"
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

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" size="sm" icon={<Upload />} onClick={() => setShowImport(true)}>
              Importer CSV
            </Button>
            <Button size="sm" icon={<Plus />} onClick={() => setShowAdd(true)}>
              Ajouter un prospect
            </Button>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '48px', color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
            <Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} />
            Chargement des prospects…
          </div>
        ) : error ? (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: '#fc8181', marginBottom: '8px' }}>
              Impossible de charger les prospects
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>
              {error}
              <br />
              Avez-vous exécuté la migration <code style={{ color: 'var(--text)' }}>0002_leads.sql</code> dans l'éditeur SQL de Supabase ?
            </div>
          </div>
        ) : leads.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Aucun prospect pour le moment"
            description="Ajoutez votre premier prospect ou importez une liste depuis un fichier CSV pour commencer à construire votre pipeline."
            action={
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <Button size="sm" variant="secondary" icon={<Upload />} onClick={() => setShowImport(true)}>
                  Importer CSV
                </Button>
                <Button size="sm" icon={<Plus />} onClick={() => setShowAdd(true)}>
                  Ajouter un prospect
                </Button>
              </div>
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
            {filtered.map((lead) => {
              const meta = getStatusMeta(lead.status);
              return (
                <div key={lead.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '13px 24px',
                  borderBottom: '1px solid var(--border)',
                  gap: '16px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                }}>
                  <div style={{ flex: 2, color: 'var(--text)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.name}
                  </div>
                  <div style={{ flex: 2, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.email || '—'}
                  </div>
                  <div style={{ flex: 2, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.company || '—'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <StatusPill status={meta.pill} label={meta.label} />
                  </div>
                  <div style={{ flex: 1, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.source || '—'}
                  </div>
                  <div style={{ flex: 1, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {formatDate(lead.created_at)}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ padding: '32px 24px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)' }}>
                Aucun prospect ne correspond à « {query} ».
              </div>
            )}

            {/* Count footer */}
            <div style={{ padding: '12px 24px', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)' }}>
              {filtered.length} prospect{filtered.length > 1 ? 's' : ''}
              {query.trim() && leads.length !== filtered.length ? ` sur ${leads.length}` : ''}
            </div>
          </div>
        )}
      </Card>

      <LeadFormModal open={showAdd} onClose={() => setShowAdd(false)} onCreated={load} />
      <ImportLeadsModal open={showImport} onClose={() => setShowImport(false)} onImported={load} />
    </div>
  );
}
