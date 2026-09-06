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
  const pathRef = useRef<SVGPathElement>(null);

  const size = 220;
  const cx = 110;
  const cy = 110;
  const r = 80;
  const strokeWidth = 14;

  // Arc path from 150° (near 0) clockwise over the top to 30°/390° (near 100)
  const arcPath = 'M 40.72 150 A 80 80 0 1 1 179.28 150';
  
  // Total circumference for 240° arc of radius 80
  const arcLength = (240 / 360) * 2 * Math.PI * r; // ~335.103
  const clampScore = Math.max(0, Math.min(100, score));
  const targetOffset = arcLength * (1 - clampScore / 100);

  useEffect(() => {
    if (!animated || !pathRef.current) return;
    // Reset to 0% filled
    pathRef.current.style.transition = 'none';
    pathRef.current.style.strokeDashoffset = String(arcLength);
    // Force reflow
    void pathRef.current.getBoundingClientRect();
    // Animate smoothly to score percentage
    pathRef.current.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
    pathRef.current.style.strokeDashoffset = String(targetOffset);
  }, [score, animated, arcLength, targetOffset]);

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
          <linearGradient id="scoreGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={category.color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={category.color} />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background track (full 240° empty arc) */}
        <path
          d={arcPath}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Dynamic score arc (fills from 0 up to score%) */}
        <path
          ref={pathRef}
          d={arcPath}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${arcLength}`}
          strokeDashoffset={animated ? arcLength : targetOffset}
          filter="url(#glow)"
        />

        {/* Center content */}
        <text
          x={cx}
          y={cy - 10}
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
          y={cy + 16}
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="12"
          fontWeight="500"
          fontFamily="Inter, sans-serif"
          letterSpacing="2"
        >
          DE 100
        </text>

        {/* Min / Max labels at the base of the arc */}
        <text
          x={cx - r - 12}
          y={cy + 54}
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="11"
          fontWeight="600"
          fontFamily="Inter, sans-serif"
        >
          0
        </text>
        <text
          x={cx + r + 16}
          y={cy + 54}
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="11"
          fontWeight="600"
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
