import React, { useEffect, useMemo, useState } from 'react';
import { Handshake, Plus, Search, Loader2, List, LayoutGrid } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import StatusPill from '../components/ui/StatusPill.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import DealFormModal from '../components/deals/DealFormModal.jsx';
import DealsPipeline from '../components/deals/DealsPipeline.jsx';
import { fetchDeals, getStageMeta, formatCurrency, updateDealStage } from '../lib/deals.js';

function ViewToggle({ view, setView }) {
  const btn = (key, label, Icon) => {
    const active = view === key;
    return (
      <button
        onClick={() => setView(key)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 12px',
          border: 'none',
          background: active ? 'rgba(46,204,82,0.12)' : 'transparent',
          color: active ? 'var(--orange)' : 'var(--muted)',
          fontFamily: 'var(--font-display)',
          fontSize: '12.5px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <Icon size={14} />
        {label}
      </button>
    );
  };
  return (
    <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface-2)' }}>
      {btn('pipeline', 'Pipeline', LayoutGrid)}
      <div style={{ width: '1px', background: 'var(--border)' }} />
      {btn('list', 'Liste', List)}
    </div>
  );
}

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('fr-CA');
  } catch {
    return '—';
  }
}

const COLUMNS = [
  { key: 'name', label: 'Opportunité', flex: 2 },
  { key: 'company', label: 'Client', flex: 1.5 },
  { key: 'job_type', label: 'Type de travaux', flex: 1.8 },
  { key: 'value', label: 'Valeur', flex: 1 },
  { key: 'stage', label: 'Étape', flex: 1.2 },
  { key: 'expected_close_date', label: 'Clôture prévue', flex: 1.2 },
];

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [view, setView] = useState('pipeline');
  const [editTarget, setEditTarget] = useState(null);

  const moveDeal = async (id, newStage) => {
    const deal = deals.find((d) => d.id === id);
    if (!deal || deal.stage === newStage) return;
    const previous = deals;
    setDeals((ds) => ds.map((d) => (d.id === id ? { ...d, stage: newStage } : d)));
    const { error } = await updateDealStage(id, newStage);
    if (error) setDeals(previous);
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await fetchDeals();
    if (error) {
      setError(error.message || 'Impossible de charger les opportunités.');
    } else {
      setDeals(data || []);
      setError('');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return deals;
    return deals.filter((d) =>
      [d.name, d.company, d.job_type].some((v) => v && v.toLowerCase().includes(q))
    );
  }, [deals, query]);

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
              placeholder="Rechercher des opportunités…"
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

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <ViewToggle view={view} setView={setView} />
            <Button size="sm" icon={<Plus />} onClick={() => setShowAdd(true)}>
              Créer une opportunité
            </Button>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '48px', color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
            <Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} />
            Chargement des opportunités…
          </div>
        ) : error ? (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: '#fc8181', marginBottom: '8px' }}>
              Impossible de charger les opportunités
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>
              {error}
              <br />
              Avez-vous exécuté la migration <code style={{ color: 'var(--text)' }}>0003_deals.sql</code> dans l'éditeur SQL de Supabase ?
            </div>
          </div>
        ) : deals.length === 0 ? (
          <EmptyState
            icon={Handshake}
            title="Aucune opportunité pour le moment"
            description="Créez votre première opportunité pour suivre vos projets, du premier contact jusqu'à la conclusion."
            action={
              <Button size="sm" icon={<Plus />} onClick={() => setShowAdd(true)} style={{ marginTop: '4px' }}>
                Créer une opportunité
              </Button>
            }
          />
        ) : view === 'pipeline' ? (
          <DealsPipeline deals={filtered} onMove={moveDeal} onCardClick={setEditTarget} />
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
            {filtered.map((deal) => {
              const meta = getStageMeta(deal.stage);
              return (
                <div key={deal.id} onClick={() => setEditTarget(deal)} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '13px 24px',
                  borderBottom: '1px solid var(--border)',
                  gap: '16px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}>
                  <div style={{ flex: 2, color: 'var(--text)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{deal.name}</div>
                  <div style={{ flex: 1.5, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{deal.company || '—'}</div>
                  <div style={{ flex: 1.8, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{deal.job_type || '—'}</div>
                  <div style={{ flex: 1, color: 'var(--text)', fontWeight: 600, whiteSpace: 'nowrap' }}>{formatCurrency(deal.value)}</div>
                  <div style={{ flex: 1.2 }}>
                    <StatusPill status={meta.pill} label={meta.label} />
                  </div>
                  <div style={{ flex: 1.2, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{formatDate(deal.expected_close_date)}</div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ padding: '32px 24px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)' }}>
                Aucune opportunité ne correspond à « {query} ».
              </div>
            )}

            <div style={{ padding: '12px 24px', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)' }}>
              {filtered.length} opportunité{filtered.length > 1 ? 's' : ''}
              {query.trim() && deals.length !== filtered.length ? ` sur ${deals.length}` : ''}
            </div>
          </div>
        )}
      </Card>

      <DealFormModal open={showAdd} onClose={() => setShowAdd(false)} onSaved={load} />
      <DealFormModal
        open={!!editTarget}
        deal={editTarget}
        onClose={() => setEditTarget(null)}
        onSaved={load}
        onDeleted={load}
      />
    </div>
  );
}
