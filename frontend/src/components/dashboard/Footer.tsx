
import { motion } from 'framer-motion';

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black/50 py-12 mt-20">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                        ChainRoute AI
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-white/10 text-gray-400">
                        TESTNET BETA
                    </span>
                </div>

                <div className="flex gap-6 text-sm text-gray-400">
                    <a href="#" className="hover:text-emerald-500 transition-colors">Documentation</a>
                    <a href="#" className="hover:text-emerald-500 transition-colors">GitHub</a>
                    <a href="#" className="hover:text-emerald-500 transition-colors">Status</a>
                </div>

                <p className="text-xs text-gray-600 max-w-xs text-center md:text-right">
                    This is a hackathon prototype. No real funds are transferred. All transactions occur on testnets.
                </p>
            </div>
        </footer>
    );
}
