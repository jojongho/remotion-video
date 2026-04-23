import React, { useMemo } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const colors = {
  primary: "#2B5EA7",
  gold: "#C9A96E",
  red: "#D94032",
  warm: "#F7F4EF",
  warmBorder: "#E0D8CC",
  text: "#3A3A3A",
  textLight: "#7A7060",
  green: "#2E8B57",
};

type SidePanelProps = {
  side: "left" | "right";
  title: string;
  subtitle?: string;
  tags?: string[];
  items?: { k: string; v: string; color?: "red" | "green" | "gold" }[];
  bigPrice?: string;
  bullets?: string[];
  checklist?: string[];
  footer?: string;
  enterFrame: number;
  exitFrame: number;
};

export const SidePanel: React.FC<SidePanelProps> = ({
  side,
  title,
  subtitle,
  tags,
  items,
  bigPrice,
  bullets,
  checklist,
  footer,
  enterFrame,
  exitFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 슬라이드인 애니메이션
  const slideIn = spring({
    fps,
    frame: frame - enterFrame,
    config: { damping: 15, mass: 0.8 },
    durationInFrames: 20,
  });

  // 슬라이드아웃
  const slideOut = spring({
    fps,
    frame: frame - exitFrame + 15,
    config: { damping: 200 },
    durationInFrames: 15,
  });

  const translateX = interpolate(slideIn, [0, 1], [side === "right" ? 700 : -700, 0]);
  const outX = interpolate(slideOut, [0, 1], [0, side === "right" ? 700 : -700]);
  const finalX = frame >= exitFrame - 15 ? outX : translateX;
  const opacity = frame < enterFrame ? 0 : frame >= exitFrame ? 0 : 1;

  // 내부 아이템 순차 등장
  const itemDelay = (index: number) =>
    spring({
      fps,
      frame: frame - enterFrame - 10 - index * 3,
      config: { damping: 20 },
      durationInFrames: 15,
    });

  const container: React.CSSProperties = useMemo(
    () => ({
      position: "absolute",
      [side]: 0,
      top: 0,
      width: 680,
      height: 1080,
      background: `rgba(30, 30, 30, 0.85)`,
      [`border${side === "right" ? "Left" : "Right"}`]: `4px solid ${colors.primary}`,
      padding: "60px 48px",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center",
      transform: `translateX(${finalX}px)`,
      opacity,
      fontFamily: "'Pretendard Variable', -apple-system, sans-serif",
    }),
    [side, finalX, opacity]
  );

  return (
    <div style={container}>
      {/* 태그 */}
      {tags && (
        <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
          {tags.map((tag, i) => (
            <div
              key={tag}
              style={{
                background: i === 0 ? colors.primary : colors.gold,
                color: i === 0 ? "#fff" : "#2D2D2D",
                padding: "6px 16px",
                borderRadius: 4,
                fontSize: 18,
                fontWeight: 700,
                opacity: itemDelay(i),
                transform: `translateY(${interpolate(itemDelay(i), [0, 1], [20, 0])}px)`,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      )}

      {/* 제목 */}
      <div
        style={{
          fontSize: 46,
          fontWeight: 800,
          color: "#fff",
          lineHeight: 1.3,
          marginBottom: 20,
          whiteSpace: "pre-line",
          opacity: itemDelay(0),
          transform: `translateY(${interpolate(itemDelay(0), [0, 1], [30, 0])}px)`,
        }}
      >
        {title.split("\n").map((line, i) => (
          <div key={i}>
            {line.includes("휴먼빌") ? (
              <>
                {line.split("휴먼빌")[0]}
                <span style={{ color: colors.primary }}>휴먼빌</span>
                {line.split("휴먼빌")[1]}
              </>
            ) : (
              line
            )}
          </div>
        ))}
      </div>

      {/* 부제목 */}
      {subtitle && (
        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.3,
            marginBottom: 24,
            whiteSpace: "pre-line",
            opacity: itemDelay(1),
            transform: `translateY(${interpolate(itemDelay(1), [0, 1], [30, 0])}px)`,
          }}
        >
          {subtitle.split(/(\d+\.\d+억~?)/).map((part, i) =>
            /\d+\.\d+억/.test(part) ? (
              <span key={i} style={{ color: colors.red }}>{part}</span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
      )}

      {/* 큰 가격 */}
      {bigPrice && (
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: colors.red,
            margin: "16px 0",
            opacity: itemDelay(1),
            transform: `scale(${interpolate(itemDelay(1), [0, 1], [0.8, 1])})`,
          }}
        >
          {bigPrice}
        </div>
      )}

      {/* 리스트 아이템 */}
      {items?.map((item, i) => (
        <div
          key={item.k}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "14px 0",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            fontSize: 24,
            opacity: itemDelay(i + 2),
            transform: `translateX(${interpolate(itemDelay(i + 2), [0, 1], [side === "right" ? 40 : -40, 0])}px)`,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.65)" }}>{item.k}</span>
          <span
            style={{
              fontWeight: 700,
              color: item.color === "red" ? colors.red : item.color === "green" ? colors.green : item.color === "gold" ? colors.gold : "#fff",
            }}
          >
            {item.v}
          </span>
        </div>
      ))}

      {/* 불렛 */}
      {bullets?.map((b, i) => (
        <div
          key={b}
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.8,
            opacity: itemDelay(i + 2),
            transform: `translateY(${interpolate(itemDelay(i + 2), [0, 1], [15, 0])}px)`,
          }}
        >
          ✓ {b}
        </div>
      ))}

      {/* 체크리스트 */}
      {checklist?.map((c, i) => (
        <div
          key={c}
          style={{
            fontSize: 22,
            padding: "10px 0",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            color: "#fff",
            opacity: itemDelay(i + 2),
            transform: `translateX(${interpolate(itemDelay(i + 2), [0, 1], [side === "right" ? 30 : -30, 0])}px)`,
          }}
        >
          {c.startsWith("✓") ? c : `✓ ${c}`}
        </div>
      ))}

      {/* 푸터 */}
      {footer && (
        <div
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.65)",
            marginTop: 16,
            lineHeight: 1.6,
            opacity: itemDelay(8),
          }}
        >
          {footer}
        </div>
      )}

      {/* 워터마크 */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          [side]: 24,
          fontSize: 16,
          fontWeight: 700,
          color: "rgba(255,255,255,0.2)",
          letterSpacing: 2,
        }}
      >
        HUMANVILLE
      </div>
    </div>
  );
};
