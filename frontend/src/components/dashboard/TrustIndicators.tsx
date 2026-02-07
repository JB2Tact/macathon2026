
import { ShieldCheck, Lock, Cpu, Database } from 'lucide-react';
import { FadeInWhenVisible } from '../common/FadeInWhenVisible';

const TRUST_ITEMS = [
    { icon: ShieldCheck, title: "Non-Custodial", desc: "No private keys stored" },
    { icon: Lock, title: "Secure Auth", desc: "Firebase-secured login" },
    { icon: Cpu, title: "Testnet Only", desc: "Risk-free simulation" },
    { icon: Database, title: "Transparent", desc: "AI-explained routing" },
];

export function TrustIndicators() {
    return (
        <section className="py-20 border-t border-white/5 mt-20">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {TRUST_ITEMS.map((item, i) => (
                        <FadeInWhenVisible key={item.title} delay={i * 0.1}>
                            <div className="flex flex-col items-center text-center gap-3 group">
                                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-emerald-500/10 transition-colors">
                                    <item.icon className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">{item.title}</h4>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                            </div>
                        </FadeInWhenVisible>
                    ))}
                </div>
            </div>
        </section>
    );
}
