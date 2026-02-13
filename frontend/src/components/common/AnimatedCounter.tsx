
import { useMotionValue, animate, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    prefix?: string;
    decimals?: number;
}

export function AnimatedCounter({ value, duration = 1.5, prefix = '', decimals = 2 }: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const isInView = useInView(ref);

    useEffect(() => {
        if (isInView) {
            const controls = animate(motionValue, value, {
                duration,
                ease: 'easeOut',
            });
            return controls.stop;
        }
    }, [motionValue, isInView, value, duration]);

    useEffect(() => {
        const unsubscribe = motionValue.on('change', (latest) => {
            if (ref.current) {
                ref.current.textContent = `${prefix}${latest.toFixed(decimals)}`;
            }
        });
        return unsubscribe;
    }, [motionValue, decimals, prefix]);

    return <span ref={ref} />;
}
