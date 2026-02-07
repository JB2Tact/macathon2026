
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInWhenVisibleProps {
    children: ReactNode;
    delay?: number;
}

export function FadeInWhenVisible({ children, delay = 0 }: FadeInWhenVisibleProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 }
            }}
        >
            {children}
        </motion.div>
    );
}
