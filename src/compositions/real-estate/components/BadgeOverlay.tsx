import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface BadgeConfig {
  id: string;
  startFrame: number;
  durationFrames: number;
  badges: string[];
}

interface BadgeOverlayProps {
  configs: BadgeConfig[];
}

const BRAND_DARK = "#234454";
const BRAND_MID = "#345866";

export const BadgeOverlay: React.FC<BadgeOverlayProps> = ({ configs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const active = configs.find(
    (c) => frame >= c.startFrame && frame < c.startFrame + c.durationFrames
  );

  if (!active) return null;

  const localFrame = frame - active.startFrame;

  const exit = interpolate(
    localFrame,
    [active.durationFrames - 15, active.durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: "40px 50px",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, opacity: exit }}>
        {active.badges.map((badge, i) => {
          const enter = spring({
            fps,
            frame: localFrame - i * 4,
            config: { damping: 12, stiffness: 100, mass: 0.5 },
          });
          return (
            <div
              key={i}
              style={{
                opacity: enter,
                transform: `scale(${enter})`,
                backgroundColor: i === 0 ? BRAND_DARK : BRAND_MID,
                color: "#FFFFFF",
                fontSize: 24,
                fontWeight: 700,
                padding: "12px 26px",
                borderRadius: 10,
                fontFamily: "Pretendard, system-ui, sans-serif",
                boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              }}
            >
              {badge}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
