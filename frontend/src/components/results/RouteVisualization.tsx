
import { motion } from 'framer-motion';
import { User, Globe } from 'lucide-react';

interface RouteVisualizationProps {
    blockchain: string;
}

export function RouteVisualization({ blockchain }: RouteVisualizationProps) {
    return (
        <div className="relative py-12 px-4 mb-8 select-none">
            {/* Background Track */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 rounded-full" />

            {/* Animated Path */}
            <motion.div
                className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
            />

            <div className="relative flex justify-between items-center max-w-lg mx-auto">
                {/* Source Node */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center gap-2"
                >
                    <div className="w-12 h-12 bg-[#0A0A0A] border-2 border-emerald-500 rounded-full flex items-center justify-center z-10">
                        <User className="w-5 h-5 text-emerald-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-300">You</span>
                </motion.div>

                {/* Blockchain Node (Center) */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center gap-2"
                >
                    <div className="w-16 h-16 bg-[#0A0A0A] border-2 border-emerald-500 rounded-2xl flex items-center justify-center z-10 shadow-[0_0_30px_rgba(0,200,83,0.3)]">
                        <span className="text-2xl capitalize text-white font-bold">
                            {blockchain === 'stellar' ? '★' : blockchain === 'ethereum' ? '◆' : '◎'}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-emerald-500 capitalize">{blockchain} Network</span>
                </motion.div>

                {/* Destination Node */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col items-center gap-2"
                >
                    <div className="w-12 h-12 bg-[#0A0A0A] border-2 border-emerald-500 rounded-full flex items-center justify-center z-10">
                        <Globe className="w-5 h-5 text-emerald-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-300">Recipient</span>
                </motion.div>
            </div>
        </div>
    );
}
