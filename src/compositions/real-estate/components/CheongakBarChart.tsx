import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { BarChartConfig } from "../content/cheongak_tts/timeline";

const BRAND = {
  dark: "rgba(0,0,0,0.82)",
  accent: "#2563EB",
  highlight: "#F59E0B",
  text: "#FFFFFF",
  muted: "#94A3B8",
};

export const CheongakBarChart: React.FC<BarChartConfig> = ({
  title,
  bars,
  unit,
  maxValue,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerEnter = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 90, mass: 0.7 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-start",
        padding: "0 0 80px 80px",
      }}
    >
      <div
        style={{
          opacity: containerEnter,
          transform: `translateY(${interpolate(containerEnter, [0, 1], [40, 0])}px)`,
          backgroundColor: BRAND.dark,
          borderRadius: 20,
          padding: "32px 40px",
          minWidth: 520,
          fontFamily: "Pretendard, system-ui, sans-serif",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* 제목 */}
        <div
          style={{
            color: BRAND.muted,
            fontSize: 22,
            fontWeight: 600,
            marginBottom: 28,
            letterSpacing: -0.3,
          }}
        >
          {title}
        </div>

        {/* 막대들 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {bars.map((bar, i) => {
            const barEnter = spring({
              fps,
              frame: frame - 6 - i * 8,
              config: { damping: 12, stiffness: 100, mass: 0.5 },
            });

            const barWidth = interpolate(
              barEnter,
              [0, 1],
              [0, (bar.value / maxValue) * 360],
            );

            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {/* 레이블 + 수치 */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      color: bar.highlight ? BRAND.highlight : BRAND.muted,
                      fontSize: 20,
                      fontWeight: 500,
                    }}
                  >
                    {bar.label}
                  </span>
                  <span
                    style={{
                      color: bar.highlight ? BRAND.highlight : BRAND.text,
                      fontSize: 26,
                      fontWeight: 800,
                      opacity: barEnter,
                    }}
                  >
                    {bar.value.toLocaleString()}{unit}
                  </span>
                </div>

                {/* 막대 트랙 */}
                <div
                  style={{
                    height: 14,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: 7,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: barWidth,
                      height: "100%",
                      backgroundColor: bar.highlight ? BRAND.highlight : BRAND.accent,
                      borderRadius: 7,
                      transition: "none",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
