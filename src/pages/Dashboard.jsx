import React from 'react';
import {
  Users,
  Handshake,
  DollarSign,
  CalendarDays,
  Activity,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

const STAT_CARDS = [
  {
    label: 'Total des prospects',
    value: '0',
    icon: Users,
    color: '#63b3ed',
    colorBg: 'rgba(99,179,237,0.10)',
    change: null,
  },
  {
    label: 'Opportunités actives',
    value: '0',
    icon: Handshake,
    color: 'var(--orange)',
    colorBg: 'rgba(46,204,82,0.10)',
    change: null,
  },
  {
    label: 'Revenus',
    value: '0 $',
    icon: DollarSign,
    color: '#48c78e',
    colorBg: 'rgba(72,199,142,0.10)',
    change: null,
  },
  {
    label: 'Rendez-vous cette semaine',
    value: '0',
    icon: CalendarDays,
    color: '#b794f4',
    colorBg: 'rgba(183,148,244,0.10)',
    change: null,
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          color: 'var(--muted)',
          background: 'var(--surface-2)',
          padding: '3px 8px',
          borderRadius: '6px',
          border: '1px solid var(--border)',
        }}>
          <TrendingUp size={10} />
          â€” %
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

function QuickActionCard({ icon: Icon, label, description, color, colorBg, delay }) {
  return (
    <Card
      hoverable
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Stat cards */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
      }}>
        {STAT_CARDS.map((card, i) => (
          <StatCard key={card.label} card={card} index={i} />
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
          />
          <QuickActionCard
            icon={Handshake}
            label="Créer une opportunité"
            description="Suivre une nouvelle opportunité"
            color="var(--orange)"
            colorBg="rgba(46,204,82,0.10)"
            delay="400ms"
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

      {/* Pipeline Overview placeholder */}
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
              Aperçu du pipeline
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)' }}>
              Les étapes des opportunités en un coup d'œil
            </div>
          </div>
          <Button variant="ghost" size="sm">Voir les opportunités</Button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0',
        }}>
          {['Prospection', 'Qualifié', 'Proposition', 'Négociation', 'Conclu'].map((stage, i) => (
            <div
              key={stage}
              style={{
                padding: '20px 24px',
                borderRight: i < 4 ? '1px solid var(--border)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '11.5px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                {stage}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>
                0
              </div>
              <div style={{
                height: '3px',
                borderRadius: '2px',
                background: 'var(--surface-2)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: '0%',
                  background: 'linear-gradient(90deg, var(--orange), var(--orange-dark))',
                  borderRadius: '2px',
                }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}
