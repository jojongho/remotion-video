import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface CtaOverlayProps {
  phone: string;
  label?: string;
  /** 숨길 프레임 구간 (다른 컴포넌트와 겹칠 때) */
  hideRanges?: { start: number; end: number }[];
  /** 시작 프레임 (이 프레임부터 나타남) */
  showFrom?: number;
}

const BRAND_DARK = "#234454";

export const CtaOverlay: React.FC<CtaOverlayProps> = ({
  phone,
  label = "견본주택 관람 문의",
  hideRanges = [],
  showFrom = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < showFrom) return null;

  // 숨김 구간 체크
  const isHidden = hideRanges.some((r) => frame >= r.start && frame < r.end);

  // 초기 진입 애니메이션
  const enter = spring({
    fps,
    frame: frame - showFrom,
    config: { damping: 14, stiffness: 100, mass: 0.5 },
  });

  // 숨김/표시 전환 (부드러운 페이드)
  const hideProgress = isHidden ? 0 : 1;
  const translateY = interpolate(enter, [0, 1], [-30, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "flex-end",
        padding: "32px 40px",
      }}
    >
      <div
        style={{
          opacity: enter * hideProgress,
          transform: `translateY(${translateY}px)`,
          display: "flex",
          alignItems: "center",
          gap: 16,
          backgroundColor: BRAND_DARK,
          borderRadius: 12,
          padding: "14px 32px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          fontFamily: "Pretendard, system-ui, sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {label}
        </span>
        <div
          style={{
            width: 2,
            height: 24,
            backgroundColor: "rgba(255,255,255,0.3)",
          }}
        />
        <span
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: 1,
          }}
        >
          {phone}
        </span>
      </div>
    </AbsoluteFill>
  );
};
