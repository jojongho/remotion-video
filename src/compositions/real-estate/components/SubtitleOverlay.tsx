import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export interface SubtitleCue {
  startFrame: number;
  endFrame: number;
  text: string;
}

interface SubtitleOverlayProps {
  cues: SubtitleCue[];
}

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({ cues }) => {
  const frame = useCurrentFrame();

  const activeCue = cues.find(
    (c) => frame >= c.startFrame && frame <= c.endFrame,
  );

  if (!activeCue) return null;

  const fadeIn = interpolate(
    frame,
    [activeCue.startFrame, activeCue.startFrame + 3],
    [0, 1],
    { extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 48,
      }}
    >
      <div
        style={{
          opacity: fadeIn,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          color: "#FFFFFF",
          fontSize: 36,
          fontWeight: 600,
          fontFamily: "Pretendard, system-ui, sans-serif",
          padding: "12px 32px",
          borderRadius: 12,
          maxWidth: "85%",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        {activeCue.text}
      </div>
    </AbsoluteFill>
  );
};
