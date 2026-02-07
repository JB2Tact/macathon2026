
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/common/Layout';
import { HeroSection } from '../components/dashboard/HeroSection';
import { QuickSendWidget } from '../components/dashboard/QuickSendWidget';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { TrustIndicators } from '../components/dashboard/TrustIndicators';
import { Footer } from '../components/dashboard/Footer';
import { analyzeSend } from '../services/api';
import type { SendResponse } from '../types';
import toast from 'react-hot-toast';

export function DashboardPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAnalyze = async (text: string) => {
        try {
            setLoading(true);
            const result: SendResponse = await analyzeSend({ naturalLanguage: text });
            navigate('/results', { state: result });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to analyze request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-[#0A0A0A] text-white">
                <HeroSection />
                <div className="relative z-10 -mt-20 px-4">
                    <QuickSendWidget onAnalyze={handleAnalyze} loading={loading} />
                </div>
                <RecentTransactions />
                <TrustIndicators />
                <Footer />
            </div>
        </Layout>
    );
}
