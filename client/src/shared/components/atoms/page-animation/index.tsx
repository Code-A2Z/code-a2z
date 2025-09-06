import { ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  TargetAndTransition,
  Transition,
  VariantLabels,
} from "framer-motion";

interface AnimationWrapperProps {
  children: ReactNode;
  keyValue?: string | number;
  initial?: boolean | TargetAndTransition | VariantLabels | undefined;
  animate?: boolean | TargetAndTransition | VariantLabels | undefined;
  transition?: Transition | undefined;
  className?: string;
}

const AnimationWrapper = ({
  children,
  keyValue,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 1 },
  className,
}: AnimationWrapperProps) => {
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
  );
};

export default AnimationWrapper;
