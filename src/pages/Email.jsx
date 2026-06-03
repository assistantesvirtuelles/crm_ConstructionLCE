import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Inbox, PenSquare, Loader2, Settings as SettingsIcon } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  fetchUserSettings,
  buildInboxUrl,
  buildComposeUrl,
  getEmailProviderLabel,
} from '../lib/settings.js';

function openUrl(url) {
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
}

export default function Email() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) return;
      setLoading(true);
      const { data } = await fetchUserSettings(user.id);
      if (!mounted) return;
      setSettings(data || {});
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <Card style={{ padding: 0, animation: 'fadeUp 0.35s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '48px', color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
          <Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} />
          Chargement…
        </div>
      </Card>
    );
  }

  const provider = settings?.email_provider;
  const address = settings?.email_address;

  // Not connected
  if (!provider) {
    return (
      <div style={{ animation: 'fadeUp 0.35s ease both' }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <EmptyState
            icon={Mail}
            title="Connectez votre courriel"
            description="Ajoutez votre fournisseur de courriel dans les paramètres pour rédiger des messages et ouvrir votre boîte de réception depuis le CRM."
            action={
              <Button size="sm" icon={<SettingsIcon />} onClick={() => navigate('/settings')} style={{ marginTop: '4px' }}>
                Aller aux paramètres
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  const inboxUrl = buildInboxUrl(provider);
  const composeUrl = buildComposeUrl(provider, {});
  const providerLabel = getEmailProviderLabel(provider);

  return (
    <div style={{ animation: 'fadeUp 0.35s ease both', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Connected header + actions */}
      <Card style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'rgba(46,204,82,0.10)', border: '1px solid rgba(46,204,82,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Mail size={18} color="var(--orange)" strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>
              Courriels
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)' }}>
              Connecté{address ? ` : ${address}` : ''} · {providerLabel}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {inboxUrl && (
            <Button variant="secondary" icon={<Inbox />} onClick={() => openUrl(inboxUrl)}>
              Ouvrir ma boîte de réception
            </Button>
          )}
          <Button icon={<PenSquare />} onClick={() => openUrl(composeUrl)}>
            Rédiger un courriel
          </Button>
        </div>
      </Card>

      {/* Info */}
      <Card style={{ padding: '24px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
          Comment ça fonctionne
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
          Le CRM ouvre votre webmail ({providerLabel}) dans un nouvel onglet pour lire et rédiger vos courriels.
          Vos messages restent dans votre boîte de réception — ils ne sont pas synchronisés dans le CRM (cela
          nécessiterait l'API de votre fournisseur). Vous pouvez modifier ou déconnecter votre courriel dans{' '}
          <span onClick={() => navigate('/settings')} style={{ color: 'var(--orange)', cursor: 'pointer', fontWeight: 600 }}>
            les paramètres
          </span>.
        </div>
      </Card>
    </div>
  );
}
