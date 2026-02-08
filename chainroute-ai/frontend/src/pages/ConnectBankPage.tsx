import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import { createBankLink, getBankStatus, disconnectBank } from '../services/api';
import toast from 'react-hot-toast';

export function ConnectBankPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [bankStatus, setBankStatus] = useState<{
        connected: boolean;
        account?: { brand: string; last4: string };
    } | null>(null);

    const sessionId = searchParams.get('session_id');
    const canceled = searchParams.get('canceled');

    useEffect(() => {
        async function checkStatus() {
            try {
                const status = await getBankStatus(sessionId || undefined);
                setBankStatus(status);

                if (sessionId && status.connected) {
                    toast.success('Card connected successfully!');
                    navigate('/connect-bank', { replace: true });
                }
            } catch (error) {
                console.error('Error checking bank status:', error);
                toast.error('Failed to check card status');
            } finally {
                setLoading(false);
            }
        }

        if (canceled) {
            toast.error('Card connection was canceled');
            navigate('/connect-bank', { replace: true });
            setLoading(false);
        } else {
            checkStatus();
        }
    }, [sessionId, canceled, navigate]);

    const handleConnect = async () => {
        setConnecting(true);
        try {
            const { url } = await createBankLink();
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error('Error creating bank link:', error);
            toast.error('Failed to start card connection');
            setConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        setDisconnecting(true);
        try {
            await disconnectBank();
            setBankStatus({ connected: false });
            toast.success('Card disconnected');
        } catch (error) {
            console.error('Error disconnecting:', error);
            toast.error('Failed to disconnect card');
        } finally {
            setDisconnecting(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                    <Spinner />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ maxWidth: '400px', margin: '0 auto' }}
            >
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0A0A0A', marginBottom: '8px' }}>
                    Payment Method
                </h1>
                <p style={{ color: '#666666', marginBottom: '32px' }}>
                    Connect a card to fund your transfers
                </p>

                <Card style={{ padding: '24px' }}>
                    {bankStatus?.connected ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '32px',
                                    background: 'linear-gradient(135deg, #00C853, #2196F3)',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
                                        {bankStatus.account?.brand || 'Card'}
                                    </span>
                                </div>
                                <div>
                                    <p style={{ color: '#0A0A0A', fontWeight: 500, margin: 0 }}>
                                        •••• •••• •••• {bankStatus.account?.last4 || '****'}
                                    </p>
                                    <p style={{ fontSize: '13px', color: '#00C853', margin: '4px 0 0 0' }}>Connected</p>
                                </div>
                            </div>

                            <Button
                                variant="secondary"
                                onClick={handleDisconnect}
                                disabled={disconnecting}
                                style={{ width: '100%' }}
                            >
                                {disconnecting ? <Spinner /> : 'Disconnect Card'}
                            </Button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    background: '#F0F0F0',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px'
                                }}>
                                    <span style={{ fontSize: '28px' }}>💳</span>
                                </div>
                                <p style={{ color: '#666666', margin: 0 }}>No card connected</p>
                                <p style={{ fontSize: '13px', color: '#999999', marginTop: '4px' }}>
                                    Connect a debit or credit card to start sending money
                                </p>
                            </div>

                            <Button
                                onClick={handleConnect}
                                disabled={connecting}
                                style={{ width: '100%' }}
                            >
                                {connecting ? <Spinner /> : 'Connect Card via Stripe'}
                            </Button>
                        </div>
                    )}
                </Card>

                <p style={{ fontSize: '12px', color: '#999999', textAlign: 'center', marginTop: '16px' }}>
                    Secured by Stripe. Your card details are never stored on our servers.
                </p>
            </motion.div>
        </Layout>
    );
}
