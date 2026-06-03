import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Handshake,
  DollarSign,
  CalendarDays,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import LeadFormModal from '../components/leads/LeadFormModal.jsx';
import DealFormModal from '../components/deals/DealFormModal.jsx';
import { fetchLeadStats, LEAD_STATUSES } from '../lib/leads.js';
import { fetchDealStats, formatCurrency } from '../lib/deals.js';

const STAT_CARDS = [
  {
    key: 'leads',
    label: 'Total des prospects',
    value: '0',
    icon: Users,
    color: '#63b3ed',
    colorBg: 'rgba(99,179,237,0.10)',
  },
  {
    key: 'deals',
    label: 'Opportunités actives',
    value: '0',
    icon: Handshake,
    color: 'var(--orange)',
    colorBg: 'rgba(46,204,82,0.10)',
  },
  {
    key: 'revenue',
    label: 'Revenus',
    value: '0 $',
    icon: DollarSign,
    color: '#48c78e',
    colorBg: 'rgba(72,199,142,0.10)',
  },
  {
    key: 'meetings',
    label: 'Rendez-vous cette semaine',
    value: '0',
    icon: CalendarDays,
    color: '#b794f4',
    colorBg: 'rgba(183,148,244,0.10)',
  },
];

function StatCard({ card, index }) {
  const Icon = card.icon;
  return (
    <Card
      hoverable
      style={{
        padding: '24px',
        animation: 'fadeUp 0.4s ease both',
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: card.colorBg,
          border: `1px solid ${card.color}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={18} color={card.color} strokeWidth={1.8} />
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '30px',
        fontWeight: 800,
        color: 'var(--text)',
        letterSpacing: '-1px',
        lineHeight: 1,
        marginBottom: '6px',
      }}>
        {card.value}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        color: 'var(--muted)',
      }}>
        {card.label}
      </div>
    </Card>
  );
}

function QuickActionCard({ icon: Icon, label, description, color, colorBg, delay, onClick }) {
  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        cursor: 'pointer',
        animation: 'fadeUp 0.4s ease both',
        animationDelay: delay,
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: colorBg,
        border: `1px solid ${color}22`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={17} color={color} strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)' }}>{description}</div>
      </div>
      <ArrowUpRight size={14} color="var(--muted)" />
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [showAddLead, setShowAddLead] = useState(false);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [stats, setStats] = useState(null);
  const [dealStats, setDealStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const loadStats = async () => {
    setStatsLoading(true);
    const [leadRes, dealRes] = await Promise.all([fetchLeadStats(), fetchDealStats()]);
    if (!leadRes.error) setStats(leadRes);
    if (!dealRes.error) setDealStats(dealRes);
    setStatsLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const statValue = (card) => {
    if (statsLoading) return '…';
    if (card.key === 'leads') return String(stats?.total ?? 0);
    if (card.key === 'deals') return String(dealStats?.active ?? 0);
    if (card.key === 'revenue') return formatCurrency(dealStats?.revenue ?? 0);
    return card.value; // meetings: no backing table yet
  };

  const total = stats?.total ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Stat cards */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
      }}>
        {STAT_CARDS.map((card, i) => (
          <StatCard key={card.label} card={{ ...card, value: statValue(card) }} index={i} />
        ))}
      </section>

      {/* Middle row: Recent Activity + Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '16px',
        animation: 'fadeUp 0.4s ease both',
        animationDelay: '340ms',
      }}>

        {/* Recent Activity */}
        <Card style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>
                Activité récente
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)' }}>
                Dernières mises à jour de votre pipeline
              </div>
            </div>
            <Button variant="ghost" size="sm">Tout voir</Button>
          </div>
          <EmptyState
            icon={Activity}
            title="Aucune activité récente"
            description="Les actions comme les nouveaux prospects, les mises à jour d'opportunités et les rendez-vous apparaîtront ici au fur et à mesure que votre pipeline se développe."
          />
        </Card>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--muted)',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '2px',
          }}>
            Actions rapides
          </div>
          <QuickActionCard
            icon={Users}
            label="Ajouter un prospect"
            description="Enregistrer un nouveau prospect"
            color="#63b3ed"
            colorBg="rgba(99,179,237,0.10)"
            delay="360ms"
            onClick={() => setShowAddLead(true)}
          />
          <QuickActionCard
            icon={Handshake}
            label="Créer une opportunité"
            description="Suivre une nouvelle opportunité"
            color="var(--orange)"
            colorBg="rgba(46,204,82,0.10)"
            delay="400ms"
            onClick={() => setShowAddDeal(true)}
          />
          <QuickActionCard
            icon={CalendarDays}
            label="Planifier un rendez-vous"
            description="Réserver du temps avec un contact"
            color="#b794f4"
            colorBg="rgba(183,148,244,0.10)"
            delay="440ms"
          />
        </div>
      </div>

      {/* Prospects by status — live counts */}
      <Card style={{
        padding: '0',
        overflow: 'hidden',
        animation: 'fadeUp 0.4s ease both',
        animationDelay: '480ms',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>
              Prospects par statut
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)' }}>
              Répartition de vos prospects par statut
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/leads')}>Voir les prospects</Button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${LEAD_STATUSES.length}, 1fr)`,
          gap: '0',
        }}>
          {LEAD_STATUSES.map((status, i) => {
            const count = stats?.byStatus?.[status.value] ?? 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div
                key={status.value}
                style={{
                  padding: '20px 24px',
                  borderRight: i < LEAD_STATUSES.length - 1 ? '1px solid var(--border)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '11.5px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                  {status.label}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>
                  {statsLoading ? '…' : count}
                </div>
                <div style={{
                  height: '3px',
                  borderRadius: '2px',
                  background: 'var(--surface-2)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, var(--orange), var(--orange-dark))',
                    borderRadius: '2px',
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <LeadFormModal
        open={showAddLead}
        onClose={() => setShowAddLead(false)}
        onCreated={() => navigate('/leads')}
      />
      <DealFormModal
        open={showAddDeal}
        onClose={() => setShowAddDeal(false)}
        onCreated={() => navigate('/deals')}
      />
    </div>
  );
}
