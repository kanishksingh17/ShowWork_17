"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TransitionPageProps {
  message: string;
}

const TransitionPage: React.FC<TransitionPageProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="flex items-center justify-center h-full"
      variants={container}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <h1 className="text-3xl font-bold">{message}</h1>
    </motion.div>
  );
};

export default TransitionPage;
