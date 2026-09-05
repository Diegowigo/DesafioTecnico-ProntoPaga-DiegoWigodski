'use client';

import React, { useEffect, useRef } from 'react';
import { getScoreCategory } from '@/utils/scoreCategory';
import styles from './ScoreGauge.module.css';

interface Props {
  score: number;
  animated?: boolean;
}

export default function ScoreGauge({ score, animated = true }: Props) {
  const category = getScoreCategory(score);
  const circleRef = useRef<SVGCircleElement>(null);

  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 85;
  const strokeWidth = 14;

  // Arc spans 240 degrees (from 150° to 390°)
  const totalArc = 240;
  const circumference = 2 * Math.PI * r;
  const arcLength = (totalArc / 360) * circumference;
  const gap = circumference - arcLength;
  const offset = circumference - (score / 100) * arcLength;

  // Rotation so arc starts at bottom-left (150deg)
  const rotation = 150;

  useEffect(() => {
    if (!animated || !circleRef.current) return;
    // Reset and animate
    circleRef.current.style.transition = 'none';
    circleRef.current.style.strokeDashoffset = String(circumference - 0);
    // Force reflow
    void circleRef.current.getBoundingClientRect();
    circleRef.current.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)';
    circleRef.current.style.strokeDashoffset = String(offset);
  }, [score, animated, circumference, offset]);

  return (
    <div className={styles.wrapper}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={styles.svg}
        aria-label={`Score: ${score} — ${category.label}`}
        role="img"
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="25%" stopColor="#F97316" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={category.color} />
            <stop offset="100%" stopColor={category.color} stopOpacity="0.7" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${gap}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(${rotation}, ${cx}, ${cy})`}
        />

        {/* Score arc */}
        <circle
          ref={circleRef}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={`url(#scoreGrad)`}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${gap}`}
          strokeDashoffset={animated ? circumference : offset}
          strokeLinecap="round"
          transform={`rotate(${rotation}, ${cx}, ${cy})`}
          filter="url(#glow)"
          style={animated ? undefined : undefined}
        />

        {/* Center content */}
        <text
          x={cx}
          y={cy - 14}
          textAnchor="middle"
          fill={category.color}
          fontSize="48"
          fontWeight="800"
          fontFamily="Inter, sans-serif"
          letterSpacing="-2"
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="12"
          fontWeight="500"
          fontFamily="Inter, sans-serif"
          letterSpacing="2"
        >
          DE 100
        </text>

        {/* Min / Max labels */}
        <text
          x={cx - r + 4}
          y={cy + 52}
          textAnchor="middle"
          fill="rgba(255,255,255,0.3)"
          fontSize="10"
          fontFamily="Inter, sans-serif"
        >
          0
        </text>
        <text
          x={cx + r - 4}
          y={cy + 52}
          textAnchor="middle"
          fill="rgba(255,255,255,0.3)"
          fontSize="10"
          fontFamily="Inter, sans-serif"
        >
          100
        </text>
      </svg>

      <div className={styles.badge} style={{ background: category.bgColor, color: category.color, borderColor: `${category.color}40` }}>
        <span className={styles.dot} style={{ background: category.color }} />
        {category.label}
      </div>

      <p className={styles.description}>{category.description}</p>
    </div>
  );
}
