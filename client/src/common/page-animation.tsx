import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode } from "react";

interface AnimationWrapperProps {
    children: ReactNode;
    keyValue?: any;
    initial?: { opacity: number };
    animate?: { opacity: number };
    transition?: { duration: number; delay?: number };
    className?: any;
}

const AnimationWrapper = ({ children, keyValue = "", initial = { opacity: 0 }, animate = { opacity: 1 }, transition = { duration: 1 }, className = "" }: AnimationWrapperProps) => {
    return (
        <AnimatePresence>
            <motion.div
                key={keyValue}
                initial={initial}
                animate={animate}
                transition={transition}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

export default AnimationWrapper;
