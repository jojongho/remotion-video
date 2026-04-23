import { useState, useEffect, useCallback, useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  useDelayRender,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { parseSrt, createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption, TikTokPage } from "@remotion/captions";

// ============================================================
// 설정
// ============================================================
const SWITCH_CAPTIONS_EVERY_MS = 1800;
const HIGHLIGHT_COLOR = "#FFD700";
const TEXT_COLOR = "#FFFFFF";
const ACCENT_COLOR = "#4FC3F7";

// ============================================================
// 핵심 정보 인서트 데이터
// ============================================================
const INFO_INSERTS = [
  {
    startSec: 93, // 01:33 - 84B 타입 시작
    durationSec: 4,
    title: "84B 타입",
    subtitle: "타워형 · 전용 84㎡",
    icon: "🏠",
  },
  {
    startSec: 119, // 01:59 - 안방과 작은방 분리
    durationSec: 4,
    title: "공간 분리 설계",
    subtitle: "안방 · 작은방 2개 독립 배치",
    icon: "🚪",
  },
  {
    startSec: 179, // 02:59 - 양창 거실
    durationSec: 4,
    title: "양창 거실",
    subtitle: "남동 + 남서 이중 조망",
    icon: "🌅",
  },
  {
    startSec: 239, // 03:59 - 포켓주방
    durationSec: 4,
    title: "포켓 주방",
    subtitle: "냄새 차단 · 주방 환기창",
    icon: "🍳",
  },
  {
    startSec: 307, // 05:07 - 무상옵션
    durationSec: 5,
    title: "무상 기본 제공",
    subtitle: "드레스룸 · 파우더장 · 비데 · 붙박이장",
    icon: "🎁",
  },
  {
    startSec: 420, // 07:00 - 분양가
    durationSec: 6,
    title: "분양가 5억 1,010만원",
    subtitle: "20~25층 기준 · 계약금 약 2,550만원",
    icon: "💰",
  },
  {
    startSec: 448, // 07:28 - 투자포인트
    durationSec: 5,
    title: "3,000만원 미만 투자",
    subtitle: "확장 계약금 포함 · 분양권 전매 가능",
    icon: "📈",
  },
  {
    startSec: 462, // 07:42 - 입주시기
    durationSec: 5,
    title: "2029년 1월 입주",
    subtitle: "더샵 1·2·3차 입주 완료 후 입주",
    icon: "📅",
  },
];

// ============================================================
// 인트로 애니메이션 컴포넌트
// ============================================================
const IntroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = spring({ frame, fps, from: 40, to: 0, durationInFrames: 30 });

  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
  });
  const subtitleY = spring({
    frame: Math.max(0, frame - 15),
    fps,
    from: 30,
    to: 0,
    durationInFrames: 25,
  });

  const lineWidth = interpolate(frame, [10, 40], [0, 400], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const badgeOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(ellipse at center, rgba(15,52,96,0.95) 0%, rgba(10,10,30,0.98) 70%)",
      }}
    >
      {/* 배경 장식 원 */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          border: "1px solid rgba(79,195,247,0.15)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          border: "1px solid rgba(79,195,247,0.08)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* 메인 타이틀 */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 72,
          fontWeight: 800,
          color: "#FFFFFF",
          textAlign: "center",
          letterSpacing: -1,
        }}
      >
        탕정 동일하이빌 파크레인
      </div>

      {/* 구분선 */}
      <div
        style={{
          width: lineWidth,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${ACCENT_COLOR}, transparent)`,
          marginTop: 24,
          marginBottom: 24,
        }}
      />

      {/* 서브타이틀 */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontSize: 40,
          color: HIGHLIGHT_COLOR,
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        84B 타입 모델하우스 소개
      </div>

      {/* 배지 */}
      <div
        style={{
          opacity: badgeOpacity,
          marginTop: 40,
          display: "flex",
          gap: 16,
        }}
      >
        {["타워형", "전용 84㎡", "양창 거실"].map((tag) => (
          <div
            key={tag}
            style={{
              padding: "8px 20px",
              borderRadius: 20,
              border: `1px solid ${ACCENT_COLOR}`,
              color: ACCENT_COLOR,
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// 아웃트로 컴포넌트
// ============================================================
const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = spring({ frame, fps, from: 0.9, to: 1, durationInFrames: 25 });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(ellipse at center, rgba(15,52,96,0.95) 0%, rgba(10,10,30,0.98) 70%)",
        opacity,
      }}
    >
      <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
        <div style={{ fontSize: 56, fontWeight: 800, color: "#FFF" }}>
          관심 있으신 분은
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: HIGHLIGHT_COLOR,
            marginTop: 16,
          }}
        >
          꼭 한번 방문해 보세요!
        </div>
        <div
          style={{
            marginTop: 48,
            width: 300,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${ACCENT_COLOR}, transparent)`,
            margin: "48px auto 0",
          }}
        />
        <div
          style={{
            marginTop: 32,
            fontSize: 28,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          모델하우스 방문 · 분양 문의
        </div>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            gap: 24,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              padding: "14px 40px",
              borderRadius: 30,
              background: HIGHLIGHT_COLOR,
              color: "#000",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            👍 좋아요
          </div>
          <div
            style={{
              padding: "14px 40px",
              borderRadius: 30,
              border: "2px solid #FFF",
              color: "#FFF",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            🔔 구독하기
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// 정보 인서트 컴포넌트
// ============================================================
const InfoInsert: React.FC<{
  title: string;
  subtitle: string;
  icon: string;
}> = ({ title, subtitle, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({ frame, fps, from: 100, to: 0, durationInFrames: 15 });
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 80,
          right: 60,
          opacity,
          transform: `translateX(${slideIn}px)`,
          display: "flex",
          alignItems: "center",
          gap: 20,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(12px)",
          borderRadius: 16,
          padding: "20px 32px",
          border: `1px solid rgba(79,195,247,0.3)`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ fontSize: 48 }}>{icon}</div>
        <div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: HIGHLIGHT_COLOR,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.8)",
              marginTop: 4,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// 하단 정보 바 (항상 표시)
// ============================================================
const BottomBar: React.FC = () => {
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "0 40px 12px",
        }}
      >
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>
          탕정 동일하이빌 파크레인 | 84B 타입
        </div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>
          모델하우스 현장 리뷰
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// 캡션 페이지 컴포넌트 (개선)
// ============================================================
const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = (frame / fps) * 1000;
  const absoluteTimeMs = page.startMs + currentTimeMs;

  const fadeIn = interpolate(frame, [0, 5], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 100,
      }}
    >
      <div
        style={{
          opacity: fadeIn,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          borderRadius: 12,
          padding: "16px 32px",
          maxWidth: "75%",
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.5,
            wordBreak: "keep-all",
          }}
        >
          {page.tokens.map((token: any, i: number) => {
            const isActive =
              token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;

            return (
              <span
                key={`${token.fromMs}-${i}`}
                style={{
                  color: isActive ? HIGHLIGHT_COLOR : TEXT_COLOR,
                  textShadow: isActive
                    ? `0 0 20px ${HIGHLIGHT_COLOR}80`
                    : "1px 1px 4px rgba(0,0,0,0.5)",
                }}
              >
                {token.text}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// 메인 비디오 컴포넌트
// ============================================================
export const TangjeongVideo: React.FC = () => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { fps, durationInFrames } = useVideoConfig();
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const fetchCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile("subtitles.srt"));
      const text = await response.text();
      const { captions: parsed } = parseSrt({ input: text });
      setCaptions(parsed);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [continueRender, cancelRender, handle]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  const pages = useMemo(() => {
    if (!captions) return [];
    const { pages: p } = createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    });
    return p;
  }, [captions]);

  if (!captions) {
    return null;
  }

  const INTRO_DURATION = 4 * fps; // 4초
  const OUTRO_DURATION = 5 * fps; // 5초
  const OUTRO_START = durationInFrames - OUTRO_DURATION;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #0a0a1e 0%, #0f2340 40%, #162447 70%, #1a1a3e 100%)",
        fontFamily:
          "'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
      }}
    >
      {/* 배경 그리드 패턴 */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(79,195,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* 오디오 */}
      <Audio src={staticFile("audio.wav")} />

      {/* ---- 인트로 (0~4초) ---- */}
      <Sequence durationInFrames={INTRO_DURATION}>
        <IntroCard />
      </Sequence>

      {/* ---- 하단 정보 바 (인트로 이후~아웃트로 전) ---- */}
      <Sequence from={INTRO_DURATION} durationInFrames={OUTRO_START - INTRO_DURATION}>
        <BottomBar />
      </Sequence>

      {/* ---- 자막 (인트로 이후부터) ---- */}
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        const endFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          startFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps
        );
        const durationInFramesCalc = Math.max(
          1,
          Math.round(endFrame - startFrame)
        );

        return (
          <Sequence
            key={index}
            from={Math.round(startFrame)}
            durationInFrames={durationInFramesCalc}
          >
            <CaptionPage page={page} />
          </Sequence>
        );
      })}

      {/* ---- 정보 인서트 오버레이 ---- */}
      {INFO_INSERTS.map((insert, i) => (
        <Sequence
          key={`info-${i}`}
          from={insert.startSec * fps}
          durationInFrames={insert.durationSec * fps}
        >
          <InfoInsert
            title={insert.title}
            subtitle={insert.subtitle}
            icon={insert.icon}
          />
        </Sequence>
      ))}

      {/* ---- 아웃트로 ---- */}
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_DURATION}>
        <OutroCard />
      </Sequence>
    </AbsoluteFill>
  );
};
