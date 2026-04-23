import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface InfoCardItem {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface InfoCardConfig {
  id: string;
  startFrame: number;
  durationFrames: number;
  tag: string;
  items: InfoCardItem[];
  /** "right" = 우측 사이드, "bottom" = 하단 full-width, "left" = 좌측 사이드 */
  position?: "right" | "bottom" | "left";
}

interface InfoCardOverlayProps {
  cards: InfoCardConfig[];
}

const BRAND = {
  dark: "#234454",
  mid: "#345866",
  gray: "#8a9ca4",
  light: "#eceff0",
  black: "#040404",
};

const SideCard: React.FC<{
  card: InfoCardConfig;
  localFrame: number;
}> = ({ card, localFrame }) => {
  const { fps } = useVideoConfig();
  const isRight = (card.position ?? "right") === "right";

  const enter = spring({
    fps,
    frame: localFrame,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });

  const exit = interpolate(
    localFrame,
    [card.durationFrames - 18, card.durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = Math.min(enter, exit);
  const translateX = interpolate(enter, [0, 1], [isRight ? 60 : -60, 0]);

  const tagEnter = spring({
    fps,
    frame: localFrame - 4,
    config: { damping: 12, stiffness: 120, mass: 0.4 },
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        width: 480,
        backgroundColor: BRAND.dark,
        borderRadius: 16,
        padding: "28px 36px",
        fontFamily: "Pretendard, system-ui, sans-serif",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {/* Tag */}
      <div
        style={{
          opacity: tagEnter,
          display: "inline-block",
          backgroundColor: BRAND.mid,
          color: BRAND.light,
          fontSize: 20,
          fontWeight: 700,
          padding: "6px 16px",
          borderRadius: 6,
          marginBottom: 20,
        }}
      >
        {card.tag}
      </div>

      {/* Items */}
      {card.items.map((item, i) => {
        const itemEnter = spring({
          fps,
          frame: localFrame - 8 - i * 5,
          config: { damping: 14, stiffness: 100, mass: 0.5 },
        });
        return (
          <div
            key={i}
            style={{
              opacity: itemEnter,
              transform: `translateX(${interpolate(itemEnter, [0, 1], [20, 0])}px)`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom:
                i < card.items.length - 1
                  ? `1px solid ${BRAND.mid}`
                  : "none",
            }}
          >
            <span
              style={{
                color: BRAND.gray,
                fontSize: 22,
                fontWeight: 500,
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                color: item.highlight ? "#FFFFFF" : BRAND.light,
                fontSize: 26,
                fontWeight: 800,
                marginLeft: 16,
              }}
            >
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const BottomCard: React.FC<{
  card: InfoCardConfig;
  localFrame: number;
}> = ({ card, localFrame }) => {
  const { fps } = useVideoConfig();

  const enter = spring({
    fps,
    frame: localFrame,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });

  const exit = interpolate(
    localFrame,
    [card.durationFrames - 18, card.durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = Math.min(enter, exit);
  const translateY = interpolate(enter, [0, 1], [60, 0]);

  const tagEnter = spring({
    fps,
    frame: localFrame - 3,
    config: { damping: 12, stiffness: 120, mass: 0.4 },
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        width: 1920,
        backgroundColor: BRAND.dark,
        padding: "40px 100px",
        borderTop: `4px solid ${BRAND.mid}`,
        fontFamily: "Pretendard, system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        gap: 0,
      }}
    >
      {/* Tag (좌측) */}
      <div
        style={{
          opacity: tagEnter,
          backgroundColor: BRAND.mid,
          color: BRAND.light,
          fontSize: 22,
          fontWeight: 700,
          padding: "10px 24px",
          borderRadius: 8,
          marginRight: 48,
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {card.tag}
      </div>

      {/* Items (가로 배치) */}
      <div style={{ display: "flex", flex: 1, gap: 0, alignItems: "center" }}>
        {card.items.map((item, i) => {
          const itemEnter = spring({
            fps,
            frame: localFrame - 6 - i * 4,
            config: { damping: 14, stiffness: 100, mass: 0.5 },
          });
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <div
                  style={{
                    width: 2,
                    height: 60,
                    backgroundColor: BRAND.mid,
                    flexShrink: 0,
                  }}
                />
              )}
              <div
                style={{
                  opacity: itemEnter,
                  flex: 1,
                  padding: "0 36px",
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: BRAND.gray,
                    marginBottom: 6,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: item.highlight ? "#FFFFFF" : BRAND.light,
                    lineHeight: 1.2,
                  }}
                >
                  {item.value}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export const InfoCardOverlay: React.FC<InfoCardOverlayProps> = ({ cards }) => {
  const frame = useCurrentFrame();

  const activeCard = cards.find(
    (c) => frame >= c.startFrame && frame < c.startFrame + c.durationFrames
  );

  if (!activeCard) return null;

  const localFrame = frame - activeCard.startFrame;
  const pos = activeCard.position ?? "right";

  if (pos === "bottom") {
    return (
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <BottomCard card={activeCard} localFrame={localFrame} />
      </AbsoluteFill>
    );
  }

  // side card (right or left)
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: pos === "right" ? "flex-end" : "flex-start",
        padding: pos === "right" ? "0 50px 0 0" : "0 0 0 50px",
      }}
    >
      <SideCard card={activeCard} localFrame={localFrame} />
    </AbsoluteFill>
  );
};
