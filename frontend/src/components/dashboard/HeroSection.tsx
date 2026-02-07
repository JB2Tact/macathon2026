
import { motion } from 'framer-motion';
import { FadeInWhenVisible } from '../common/FadeInWhenVisible';

export function HeroSection() {
    return (
        <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />

            <div className="container relative mx-auto px-4 text-center">
                <FadeInWhenVisible>
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        Send Money Globally <br />
                        <span className="text-emerald-500">Instantly & Intelligently</span>
                    </motion.h1>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.2}>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                        AI-powered routing that automatically finds the cheapest and fastest path for your crypto transfers. Secure, transparent, and built for speed.
                    </p>
                </FadeInWhenVisible>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/20 blur-[120px] rounded-full -z-10 pointer-events-none" />
            </div>
        </section>
    );
}
