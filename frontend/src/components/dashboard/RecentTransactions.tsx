
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';

const MOCK_TRANSACTIONS = [
    { id: 1, to: 'Maria (Mexico)', amount: '$100.00', status: 'completed', date: '2 mins ago', method: 'Stellar' },
    { id: 2, to: 'Ahmed (Egypt)', amount: '$50.00', status: 'pending', date: '5 mins ago', method: 'Solana' },
    { id: 3, to: 'Priya (India)', amount: '$200.00', status: 'failed', date: '1 hour ago', method: 'Ethereum' },
];

export function RecentTransactions() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 max-w-4xl mx-auto"
        >
            <div className="flex justify-between items-center mb-6 px-4">
                <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
                <button className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors">View All</button>
            </div>

            <div className="space-y-3">
                {MOCK_TRANSACTIONS.map((tx, i) => (
                    <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + (i * 0.1) }}
                        className="group bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-4 flex items-center justify-between transition-all hover:bg-white/[0.07]"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                    tx.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                        'bg-red-500/10 text-red-500'
                                }`}>
                                {tx.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                                    tx.status === 'pending' ? <Clock className="w-5 h-5" /> :
                                        <XCircle className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-medium text-white">Sent to {tx.to}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>{tx.date}</span>
                                    <span>•</span>
                                    <span>via {tx.method}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="font-mono font-semibold text-white">{tx.amount}</p>
                            <span className={`text-xs capitalize ${tx.status === 'completed' ? 'text-emerald-500' :
                                    tx.status === 'pending' ? 'text-amber-500' :
                                        'text-red-500'
                                }`}>{tx.status}</span>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-1/2 -translate-y-1/2 translate-x-12 group-hover:translate-x-0">
                            <ArrowUpRight className="w-5 h-5 text-gray-500" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
