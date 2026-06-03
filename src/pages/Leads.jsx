import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Upload, Search, Loader2, UserPlus, Check, CheckCircle2, List, LayoutGrid } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import StatusPill from '../components/ui/StatusPill.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Modal from '../components/ui/Modal.jsx';
import LeadFormModal from '../components/leads/LeadFormModal.jsx';
import ImportLeadsModal from '../components/leads/ImportLeadsModal.jsx';
import LeadsPipeline from '../components/leads/LeadsPipeline.jsx';
import { fetchLeads, getStatusMeta, updateLeadStatus } from '../lib/leads.js';
import { convertLeadToContact } from '../lib/contacts.js';

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
  const navigate = useNavigate();
  const [convertTarget, setConvertTarget] = useState(null);
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState('');
  const [convertDone, setConvertDone] = useState(false);
  const [view, setView] = useState('pipeline');
  const [editTarget, setEditTarget] = useState(null);

  const moveLead = async (id, newStatus) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.status === newStatus) return;
    const previous = leads;
    // optimistic update
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    const { error } = await updateLeadStatus(id, newStatus);
    if (error) setLeads(previous); // revert on failure
  };

  const closeConvert = () => {
    if (converting) return;
    setConvertTarget(null);
    setConverting(false);
    setConvertError('');
    setConvertDone(false);
  };

  const doConvert = async () => {
    if (!convertTarget) return;
    setConverting(true);
    setConvertError('');
    const { error } = await convertLeadToContact(convertTarget);
    if (error) {
      setConvertError(error.message || "Une erreur s'est produite lors de la conversion.");
      setConverting(false);
      return;
    }
    setConverting(false);
    setConvertDone(true);
    load();
  };

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

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <ViewToggle view={view} setView={setView} />
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
        ) : view === 'pipeline' ? (
          <LeadsPipeline leads={filtered} onMove={moveLead} onCardClick={setEditTarget} />
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
              <div style={{ width: '150px', flexShrink: 0 }} />
            </div>

            {/* Rows */}
            {filtered.map((lead) => {
              const meta = getStatusMeta(lead.status);
              return (
                <div key={lead.id} onClick={() => setEditTarget(lead)} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '13px 24px',
                  borderBottom: '1px solid var(--border)',
                  gap: '16px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  cursor: 'pointer',
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
                  <div style={{ width: '150px', flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
                    {lead.status === 'converted' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--muted)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                        <Check size={13} color="#48c78e" /> Converti
                      </span>
                    ) : (
                      <Button variant="ghost" size="sm" icon={<UserPlus />} onClick={(e) => { e.stopPropagation(); setConvertTarget(lead); }}>
                        Convertir
                      </Button>
                    )}
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

      <LeadFormModal open={showAdd} onClose={() => setShowAdd(false)} onSaved={load} />
      <LeadFormModal
        open={!!editTarget}
        lead={editTarget}
        onClose={() => setEditTarget(null)}
        onSaved={load}
        onDeleted={load}
        onConvert={(lead) => setConvertTarget(lead)}
      />
      <ImportLeadsModal open={showImport} onClose={() => setShowImport(false)} onImported={load} />

      <Modal
        open={!!convertTarget}
        onClose={closeConvert}
        title="Convertir en contact"
        width={460}
        footer={
          convertDone ? (
            <>
              <Button variant="secondary" size="sm" onClick={closeConvert}>Fermer</Button>
              <Button size="sm" onClick={() => navigate('/contacts')}>Voir les contacts</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="sm" onClick={closeConvert} disabled={converting}>Annuler</Button>
              <Button size="sm" onClick={doConvert} disabled={converting}>
                {converting ? 'Conversion…' : 'Convertir'}
              </Button>
            </>
          )
        }
      >
        {convertDone ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: 'rgba(72,199,142,0.12)', border: '1px solid rgba(72,199,142,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircle2 size={24} color="#48c78e" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--text)', textAlign: 'center' }}>
              {convertTarget?.name} a été converti en contact
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', textAlign: 'center' }}>
              Le prospect est maintenant marqué « Converti ».
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--text)', lineHeight: 1.6 }}>
              Convertir <strong>{convertTarget?.name}</strong> en contact ?
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
              Un nouveau contact sera créé à partir des informations de ce prospect (nom, courriel,
              téléphone, entreprise, titre, notes), et le prospect sera marqué comme « Converti ».
            </div>
            {convertError && (
              <div style={{
                padding: '10px 14px', borderRadius: 'var(--radius-md)',
                background: 'rgba(252,129,129,0.10)', border: '1px solid rgba(252,129,129,0.25)',
                color: '#fc8181', fontFamily: 'var(--font-body)', fontSize: '13px',
              }}>
                {convertError}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
