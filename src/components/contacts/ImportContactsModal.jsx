import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { bulkInsertContacts, mapCsvRowToContact } from '../../lib/contacts.js';

export default function ImportContactsModal({ open, onClose, onImported }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [parsing, setParsing] = useState(false);
  const [contacts, setContacts] = useState(null);
  const [skipped, setSkipped] = useState(0);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const reset = () => {
    setFileName('');
    setParsing(false);
    setContacts(null);
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
    setContacts(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        const rows = results.data || [];
        const mapped = rows.map(mapCsvRowToContact);
        const valid = mapped.filter((c) => c.name && String(c.name).trim() !== '');
        setContacts(valid);
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
    if (!contacts || contacts.length === 0) return;
    setImporting(true);
    setError('');
    const { data, error } = await bulkInsertContacts(contacts);
    if (error) {
      setError(error.message || "Une erreur s'est produite lors de l'importation.");
      setImporting(false);
      return;
    }
    setResult({ inserted: data?.length ?? contacts.length });
    setImporting(false);
    onImported?.();
  };

  const sample = (contacts ?? []).slice(0, 5);

  return (
    <Modal
      open={open}
      onClose={close}
      width={620}
      title="Importer des contacts (CSV)"
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
              disabled={!contacts || contacts.length === 0 || importing}
            >
              {importing
                ? 'Importation…'
                : contacts && contacts.length > 0
                ? `Importer ${contacts.length} contact${contacts.length > 1 ? 's' : ''}`
                : 'Importer'}
            </Button>
          </>
        )
      }
    >
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
            {result.inserted} contact{result.inserted > 1 ? 's' : ''} importé{result.inserted > 1 ? 's' : ''} avec succès
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label
            htmlFor="csv-contacts-input"
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
              id="csv-contacts-input"
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
              style={{ display: 'none' }}
            />
          </label>

          <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
            Colonnes reconnues (français ou anglais) :{' '}
            <span style={{ color: 'var(--text)' }}>Nom</span>, Courriel, Téléphone, Entreprise,
            Titre, Industrie, Notes. Seule la colonne <span style={{ color: 'var(--text)' }}>Nom</span> est obligatoire.
          </div>

          {contacts && contacts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                <FileText size={14} color="var(--orange)" />
                {contacts.length} contact{contacts.length > 1 ? 's' : ''} prêt{contacts.length > 1 ? 's' : ''} à importer
              </div>

              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                {sample.map((c, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '12px', padding: '9px 14px',
                    borderBottom: i < sample.length - 1 ? '1px solid var(--border)' : 'none',
                    fontFamily: 'var(--font-body)', fontSize: '12.5px',
                  }}>
                    <span style={{ flex: 2, color: 'var(--text)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                    <span style={{ flex: 2, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.email || '—'}</span>
                    <span style={{ flex: 2, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.company || '—'}</span>
                  </div>
                ))}
                {contacts.length > sample.length && (
                  <div style={{ padding: '8px 14px', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
                    + {contacts.length - sample.length} de plus…
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
