import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { bulkInsertLeads, mapCsvRowToLead, getStatusMeta } from '../../lib/leads.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ImportLeadsModal({ open, onClose, onImported }) {
  const { user } = useAuth();
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [parsing, setParsing] = useState(false);
  const [leads, setLeads] = useState(null);   // mapped, valid leads (have a name)
  const [skipped, setSkipped] = useState(0);   // rows dropped for missing name
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);  // { inserted }
  const [error, setError] = useState('');

  const reset = () => {
    setFileName('');
    setParsing(false);
    setLeads(null);
    setSkipped(0);
    setImporting(false);
    setResult(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const close = () => {
    if (importing) return;
    reset();
    onClose?.();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setParsing(true);
    setError('');
    setResult(null);
    setLeads(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        const rows = results.data || [];
        const mapped = rows.map(mapCsvRowToLead);
        const valid = mapped.filter((l) => l.name && String(l.name).trim() !== '');
        setLeads(valid);
        setSkipped(rows.length - valid.length);
        setParsing(false);
        if (valid.length === 0) {
          setError(
            "Aucune ligne valide trouvée. Vérifiez que votre fichier contient une colonne « Nom » (ou « Name »)."
          );
        }
      },
      error: (err) => {
        setParsing(false);
        setError(err.message || 'Impossible de lire le fichier CSV.');
      },
    });
  };

  const doImport = async () => {
    if (!leads || leads.length === 0) return;
    setImporting(true);
    setError('');
    const payload = leads.map((l) => ({ ...l, created_by: user?.id ?? null }));
    const { data, error } = await bulkInsertLeads(payload);
    if (error) {
      setError(error.message || "Une erreur s'est produite lors de l'importation.");
      setImporting(false);
      return;
    }
    setResult({ inserted: data?.length ?? leads.length });
    setImporting(false);
    onImported?.();
  };

  const sample = (leads ?? []).slice(0, 5);

  return (
    <Modal
      open={open}
      onClose={close}
      width={620}
      title="Importer des prospects (CSV)"
      subtitle="Téléversez un fichier .csv exporté depuis Excel ou Google Sheets"
      footer={
        result ? (
          <Button size="sm" onClick={close}>Terminé</Button>
        ) : (
          <>
            <Button variant="secondary" size="sm" onClick={close} disabled={importing}>
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={doImport}
              disabled={!leads || leads.length === 0 || importing}
            >
              {importing
                ? 'Importation…'
                : leads && leads.length > 0
                ? `Importer ${leads.length} prospect${leads.length > 1 ? 's' : ''}`
                : 'Importer'}
            </Button>
          </>
        )
      }
    >
      {/* Success state */}
      {result ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '16px 0' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'rgba(72,199,142,0.12)', border: '1px solid rgba(72,199,142,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle2 size={24} color="#48c78e" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
            {result.inserted} prospect{result.inserted > 1 ? 's' : ''} importé{result.inserted > 1 ? 's' : ''} avec succès
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Upload zone */}
          <label
            htmlFor="csv-input"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '28px', borderRadius: 'var(--radius-lg)',
              border: '1.5px dashed var(--border)', background: 'var(--surface-2)',
              cursor: 'pointer', textAlign: 'center',
            }}
          >
            <Upload size={22} color="var(--orange)" />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '13.5px', fontWeight: 600, color: 'var(--text)' }}>
              {fileName ? fileName : 'Choisir un fichier CSV'}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)' }}>
              {parsing ? 'Lecture du fichier…' : 'Cliquez pour parcourir vos fichiers'}
            </div>
            <input
              id="csv-input"
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
              style={{ display: 'none' }}
            />
          </label>

          {/* Supported columns help */}
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6,
          }}>
            Colonnes reconnues (français ou anglais) :{' '}
            <span style={{ color: 'var(--text)' }}>Nom</span>, Courriel, Téléphone, Entreprise,
            Titre, Source, Statut, Notes. Seule la colonne <span style={{ color: 'var(--text)' }}>Nom</span> est obligatoire.
          </div>

          {/* Preview */}
          {leads && leads.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                <FileText size={14} color="var(--orange)" />
                {leads.length} prospect{leads.length > 1 ? 's' : ''} prêt{leads.length > 1 ? 's' : ''} à importer
              </div>

              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                {sample.map((l, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '12px', padding: '9px 14px',
                    borderBottom: i < sample.length - 1 ? '1px solid var(--border)' : 'none',
                    fontFamily: 'var(--font-body)', fontSize: '12.5px',
                  }}>
                    <span style={{ flex: 2, color: 'var(--text)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</span>
                    <span style={{ flex: 2, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.email || '—'}</span>
                    <span style={{ flex: 2, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.company || '—'}</span>
                    <span style={{ flex: 1, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{getStatusMeta(l.status || 'new').label}</span>
                  </div>
                ))}
                {leads.length > sample.length && (
                  <div style={{ padding: '8px 14px', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
                    + {leads.length - sample.length} de plus…
                  </div>
                )}
              </div>

              {skipped > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-body)', fontSize: '12px', color: '#e0a23b' }}>
                  <AlertTriangle size={13} />
                  {skipped} ligne{skipped > 1 ? 's' : ''} ignorée{skipped > 1 ? 's' : ''} (nom manquant)
                </div>
              )}
            </div>
          )}

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 'var(--radius-md)',
              background: 'rgba(252,129,129,0.10)', border: '1px solid rgba(252,129,129,0.25)',
              color: '#fc8181', fontFamily: 'var(--font-body)', fontSize: '13px',
            }}>
              {error}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
