import React, { useMemo, useState } from 'react';
import StatusPill from '../ui/StatusPill.jsx';
import { DEAL_STAGES, formatCurrency } from '../../lib/deals.js';

export default function DealsPipeline({ deals, onMove }) {
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);

  const byStage = useMemo(() => {
    const map = {};
    for (const s of DEAL_STAGES) map[s.value] = [];
    for (const d of deals) {
      if (!map[d.stage]) map[d.stage] = [];
      map[d.stage].push(d);
    }
    return map;
  }, [deals]);

  return (
    <div style={{ display: 'flex', gap: '12px', padding: '16px', overflowX: 'auto', alignItems: 'flex-start' }}>
      {DEAL_STAGES.map((stage) => {
        const items = byStage[stage.value] || [];
        const isOver = overCol === stage.value;
        const total = items.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
        return (
          <div
            key={stage.value}
            onDragOver={(e) => {
              e.preventDefault();
              if (overCol !== stage.value) setOverCol(stage.value);
            }}
            onDragLeave={() => setOverCol((c) => (c === stage.value ? null : c))}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData('text/plain') || dragId;
              setOverCol(null);
              setDragId(null);
              if (id) onMove(id, stage.value);
            }}
            style={{
              flex: '1 0 210px',
              minWidth: '210px',
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <StatusPill status={stage.pill} label={stage.label} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>
                {items.length}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '11.5px', color: 'var(--muted)', marginBottom: '12px', paddingLeft: '2px' }}>
              {formatCurrency(total)}
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map((deal) => (
                <div
                  key={deal.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', deal.id);
                    e.dataTransfer.effectAllowed = 'move';
                    setDragId(deal.id);
                  }}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverCol(null);
                  }}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                    cursor: 'grab',
                    opacity: dragId === deal.id ? 0.45 : 1,
                    transition: 'opacity 0.12s ease',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {deal.name}
                  </div>
                  {deal.company && (
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {deal.company}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: 700, color: 'var(--text)' }}>
                      {formatCurrency(deal.value)}
                    </span>
                    {deal.job_type && (
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '55%', textAlign: 'right' }}>
                        {deal.job_type}
                      </span>
                    )}
                  </div>
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
