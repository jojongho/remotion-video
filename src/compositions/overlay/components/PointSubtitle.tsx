import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const colors = {
  primary: "#2B5EA7",
  gold: "#C9A96E",
  red: "#D94032",
  warm: "rgba(30, 30, 30, 0.85)",
  text: "#3A3A3A",
  textLight: "#7A7060",
};

type PointSubtitleProps = {
  text: string;
  style: "point" | "price" | "subtitle";
  enterFrame: number;
  exitFrame: number;
  position?: "top" | "bottom";
};

export const PointSubtitle: React.FC<PointSubtitleProps> = ({
  text,
  style,
  enterFrame,
  exitFrame,
  position = "top",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    fps,
    frame: frame - enterFrame,
    config: { damping: 15, mass: 0.6 },
    durationInFrames: 15,
  });

  const slideOut = spring({
    fps,
    frame: frame - exitFrame + 10,
    config: { damping: 200 },
    durationInFrames: 10,
  });

  const y = position === "top" ? -80 : 80;
  const translateY = interpolate(slideIn, [0, 1], [y, 0]);
  const outY = interpolate(slideOut, [0, 1], [0, y]);
  const finalY = frame >= exitFrame - 10 ? outY : translateY;
  const opacity = frame < enterFrame ? 0 : frame >= exitFrame ? 0 : 1;

  const styleMap = {
    point: { bg: colors.primary, color: "#fff", fontSize: 32 },
    price: { bg: colors.red, color: "#fff", fontSize: 36 },
    subtitle: { bg: colors.warm, color: "#fff", fontSize: 28 },
  };

  const s = styleMap[style];

  const container: React.CSSProperties = useMemo(
    () => ({
      position: "absolute",
      [position === "top" ? "top" : "bottom"]: 80,
      left: "50%",
      transform: `translateX(-50%) translateY(${finalY}px)`,
      background: s.bg,
      color: s.color,
      padding: "16px 36px",
      borderRadius: 8,
      fontSize: s.fontSize,
      fontWeight: 700,
      fontFamily: "'Pretendard Variable', -apple-system, sans-serif",
      opacity,
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      whiteSpace: "nowrap" as const,
      borderLeft: style === "subtitle" ? `4px solid ${colors.primary}` : undefined,
    }),
    [finalY, opacity, s, style, position]
  );

  return <div style={container}>{text}</div>;
};
