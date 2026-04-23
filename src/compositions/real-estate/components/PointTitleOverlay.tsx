import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface PointTitleConfig {
  id: string;
  startFrame: number;
  durationFrames: number;
  /** 상단 작은 태그 (예: "핵심 포인트 ①") */
  tag?: string;
  /** 메인 타이틀 (크게) */
  title: string;
  /** 서브 텍스트 */
  sub?: string;
  /** 위치 */
  position?: "center" | "bottom";
}

interface PointTitleOverlayProps {
  configs: PointTitleConfig[];
}

const BRAND = {
  dark: "#234454",
  mid: "#345866",
  gray: "#8a9ca4",
  light: "#eceff0",
  black: "#040404",
};

export const PointTitleOverlay: React.FC<PointTitleOverlayProps> = ({
  configs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const active = configs.find(
    (c) => frame >= c.startFrame && frame < c.startFrame + c.durationFrames
  );

  if (!active) return null;

  const localFrame = frame - active.startFrame;
  const pos = active.position ?? "center";

  // 전체 진입
  const enter = spring({
    fps,
    frame: localFrame,
    config: { damping: 12, stiffness: 80, mass: 0.7 },
  });

  // 전체 퇴장
  const exit = interpolate(
    localFrame,
    [active.durationFrames - 15, active.durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = Math.min(enter, exit);

  // 배경 딤
  const dimOpacity = interpolate(opacity, [0, 1], [0, 0.55]);

  // tag 등장
  const tagEnter = spring({
    fps,
    frame: localFrame - 3,
    config: { damping: 10, stiffness: 120, mass: 0.4 },
  });

  // title 등장 (스케일 + 페이드)
  const titleEnter = spring({
    fps,
    frame: localFrame - 6,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });
  const titleScale = interpolate(titleEnter, [0, 1], [0.7, 1]);

  // sub 등장
  const subEnter = spring({
    fps,
    frame: localFrame - 14,
    config: { damping: 14, stiffness: 100, mass: 0.5 },
  });

  return (
    <AbsoluteFill>
      {/* 반투명 딤 배경 */}
      <AbsoluteFill
        style={{
          backgroundColor: BRAND.black,
          opacity: dimOpacity,
        }}
      />

      {/* 콘텐츠 */}
      <AbsoluteFill
        style={{
          justifyContent: pos === "center" ? "center" : "flex-end",
          alignItems: "center",
          paddingBottom: pos === "bottom" ? 200 : 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            opacity,
          }}
        >
          {/* Tag */}
          {active.tag && (
            <div
              style={{
                opacity: tagEnter,
                transform: `translateY(${interpolate(tagEnter, [0, 1], [-20, 0])}px)`,
                backgroundColor: BRAND.dark,
                color: BRAND.light,
                fontSize: 28,
                fontWeight: 700,
                padding: "10px 28px",
                borderRadius: 6,
                fontFamily: "Pretendard, system-ui, sans-serif",
                letterSpacing: 1,
              }}
            >
              {active.tag}
            </div>
          )}

          {/* Title */}
          <div
            style={{
              opacity: titleEnter,
              transform: `scale(${titleScale})`,
              fontSize: 72,
              fontWeight: 900,
              color: "#FFFFFF",
              fontFamily: "Pretendard, system-ui, sans-serif",
              textAlign: "center",
              lineHeight: 1.3,
              textShadow: `0 4px 20px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5)`,
              padding: "0 100px",
              WebkitTextStroke: "1px rgba(0,0,0,0.15)",
            }}
          >
            {active.title}
          </div>

          {/* Sub */}
          {active.sub && (
            <div
              style={{
                opacity: subEnter,
                transform: `translateY(${interpolate(subEnter, [0, 1], [15, 0])}px)`,
                fontSize: 32,
                fontWeight: 600,
                color: BRAND.light,
                fontFamily: "Pretendard, system-ui, sans-serif",
                textAlign: "center",
                textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                marginTop: 8,
              }}
            >
              {active.sub}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
