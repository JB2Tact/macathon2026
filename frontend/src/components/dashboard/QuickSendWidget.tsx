
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Zap } from 'lucide-react';

interface QuickSendWidgetProps {
    onAnalyze: (text: string) => void;
    loading: boolean;
}

export function QuickSendWidget({ onAnalyze, loading }: QuickSendWidgetProps) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) onAnalyze(input);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-3xl mx-auto -mt-10 relative z-10"
        >
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-emerald-500/10 p-2 rounded-lg">
                        <Zap className="w-5 h-5 text-emerald-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Quick Send</h2>
                </div>

                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g., Send 200 USDC to India via Stellar"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-32 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
                        disabled={loading}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Analyzing...' : (
                            <>
                                Find Route <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-4 flex gap-3 text-sm text-gray-400">
                    <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5">Example:</span>
                    <button onClick={() => setInput("Send $500 to detailed-address-123")} className="hover:text-emerald-400 transition-colors">"Send $500 to detailed-address..."</button>
                </div>
            </div>
        </motion.div>
    );
}
