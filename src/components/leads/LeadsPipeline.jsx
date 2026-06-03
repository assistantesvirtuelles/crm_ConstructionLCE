import React, { useMemo, useState } from 'react';
import StatusPill from '../ui/StatusPill.jsx';
import { LEAD_STATUSES } from '../../lib/leads.js';

export default function LeadsPipeline({ leads, onMove, onCardClick }) {
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);

  const byStatus = useMemo(() => {
    const map = {};
    for (const s of LEAD_STATUSES) map[s.value] = [];
    for (const l of leads) {
      if (!map[l.status]) map[l.status] = [];
      map[l.status].push(l);
    }
    return map;
  }, [leads]);

  return (
    <div style={{ display: 'flex', gap: '12px', padding: '16px', overflowX: 'auto', alignItems: 'flex-start' }}>
      {LEAD_STATUSES.map((status) => {
        const items = byStatus[status.value] || [];
        const isOver = overCol === status.value;
        return (
          <div
            key={status.value}
            onDragOver={(e) => {
              e.preventDefault();
              if (overCol !== status.value) setOverCol(status.value);
            }}
            onDragLeave={() => setOverCol((c) => (c === status.value ? null : c))}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData('text/plain') || dragId;
              setOverCol(null);
              setDragId(null);
              if (id) onMove(id, status.value);
            }}
            style={{
              flex: '1 0 200px',
              minWidth: '200px',
              maxWidth: '300px',
              background: 'var(--surface-2)',
              border: `1px solid ${isOver ? 'rgba(46,204,82,0.5)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '12px',
              minHeight: '180px',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              boxShadow: isOver ? '0 0 0 1px rgba(46,204,82,0.3)' : 'none',
            }}
          >
            {/* Column header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <StatusPill status={status.pill} label={status.label} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>
                {items.length}
              </span>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', lead.id);
                    e.dataTransfer.effectAllowed = 'move';
                    setDragId(lead.id);
                  }}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverCol(null);
                  }}
                  onClick={() => onCardClick?.(lead)}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                    cursor: 'grab',
                    opacity: dragId === lead.id ? 0.45 : 1,
                    transition: 'opacity 0.12s ease',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.name}
                  </div>
                  {lead.company && (
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lead.company}
                    </div>
                  )}
                  {lead.email && (
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '11.5px', color: 'var(--muted)', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lead.email}
                    </div>
                  )}
                </div>
              ))}
              {items.length === 0 && (
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', textAlign: 'center', padding: '14px 0', opacity: 0.5 }}>
                  Déposez ici
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
