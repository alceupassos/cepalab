'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  value?: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  loading?: boolean;
  onClick?: () => void;
  glow?: boolean;
  animationDelay?: number;
}

export function AnimatedCard({
  children,
  className,
  variant = 'default',
  icon,
  title,
  subtitle,
  value,
  change,
  loading = false,
  onClick,
  glow = false,
  animationDelay = 0
}: AnimatedCardProps) {
  const variants = {
    default: 'bg-white border-gray-200 text-gray-900',
    success: 'bg-success-50 border-success-200 text-success-900',
    warning: 'bg-warning-50 border-warning-200 text-warning-900',
    danger: 'bg-danger-50 border-danger-200 text-danger-900',
    info: 'bg-info-50 border-info-200 text-info-900'
  };

  const glowVariants = {
    default: 'hover:shadow-lg hover:shadow-primary/20',
    success: 'hover:shadow-lg hover:shadow-success/20',
    warning: 'hover:shadow-lg hover:shadow-warning/20',
    danger: 'hover:shadow-lg hover:shadow-danger/20',
    info: 'hover:shadow-lg hover:shadow-info/20'
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: animationDelay,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const shimmerVariants = {
    animate: {
      backgroundPosition: ['-200px 0', '200px 0'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const ShimmerLoader = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
  );

  const TrendIndicator = ({ trend, value }: { trend: 'up' | 'down' | 'neutral'; value: number }) => {
    const trendColors = {
      up: 'text-success',
      down: 'text-danger',
      neutral: 'text-gray-500'
    };

    const trendIcons = {
      up: '↑',
      down: '↓',
      neutral: '→'
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn("flex items-center gap-1 text-sm font-medium", trendColors[trend])}
      >
        <motion.span
          animate={{ rotate: trend === 'up' ? 0 : trend === 'down' ? 180 : 90 }}
          transition={{ duration: 0.3 }}
        >
          {trendIcons[trend]}
        </motion.span>
        <span>{Math.abs(value)}%</span>
      </motion.div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={onClick ? "hover" : undefined}
        className={cn(
          "relative p-6 rounded-xl border-2 transition-all duration-300 overflow-hidden",
          "hover:shadow-xl",
          variants[variant],
          glow && glowVariants[variant],
          onClick && "cursor-pointer",
          className
        )}
        onClick={onClick}
      >
        {/* Glow Effect */}
        {glow && (
          <motion.div
            className={cn(
              "absolute inset-0 opacity-0 transition-opacity duration-300",
              "bg-gradient-to-r from-transparent via-white/30 to-transparent"
            )}
            whileHover={{ opacity: 1 }}
          />
        )}

        {/* Shimmer Loading Effect */}
        {loading && (
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-30"
            style={{
              backgroundSize: '200px 100%',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}

        <div className="relative z-10">
          {/* Header with Icon and Title */}
          {(icon || title) && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {icon && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: animationDelay + 0.1, duration: 0.3 }}
                    className={cn(
                      "p-2 rounded-lg",
                      variant === 'default' && "bg-gray-100 text-gray-600",
                      variant === 'success' && "bg-success-100 text-success-600",
                      variant === 'warning' && "bg-warning-100 text-warning-600",
                      variant === 'danger' && "bg-danger-100 text-danger-600",
                      variant === 'info' && "bg-info-100 text-info-600"
                    )}
                  >
                    {icon}
                  </motion.div>
                )}
                {title && (
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: animationDelay + 0.2, duration: 0.3 }}
                    className="text-sm font-medium text-gray-600"
                  >
                    {title}
                  </motion.h3>
                )}
              </div>
              {change && <TrendIndicator trend={change.trend} value={change.value} />}
            </div>
          )}

          {/* Main Content */}
          {loading ? (
            <ShimmerLoader />
          ) : (
            <>
              {value !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: animationDelay + 0.3, duration: 0.4 }}
                  className="mb-2"
                >
                  <div className="text-3xl font-bold">
                    {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
                  </div>
                  {subtitle && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: animationDelay + 0.4 }}
                      className="text-sm text-gray-500 mt-1"
                    >
                      {subtitle}
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* Children Content */}
              {children && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: animationDelay + 0.5, duration: 0.3 }}
                >
                  {children}
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Interactive Ripple Effect */}
        {onClick && (
          <motion.div
            className="absolute inset-0 bg-white/20 opacity-0"
            whileTap={{ opacity: 1, scale: 0.95 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export function AnimatedCardGrid({
  children,
  className,
  staggerDelay = 0.1
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCardList({
  children,
  className,
  staggerDelay = 0.05
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={cn("space-y-4", className)}
    >
      {children}
    </motion.div>
  );
}