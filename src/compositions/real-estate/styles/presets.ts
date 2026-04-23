/**
 * 🎬 Remotion 자막/오버레이 스타일 프리셋
 * 
 * 레퍼런스: 걸리버하우스 유튜브 건축 영상 스타일
 * - 미니멀, 모던, 고급스러운 느낌
 * - 자막바 제외, 정보 카드/타이틀/라벨 스타일 중심
 * - 뉴트럴 톤 컬러 팔레트
 */

import { CSSProperties } from "react";

// ============================================================
// 🎨 디자인 토큰 (Design Tokens)
// ============================================================

export const TOKENS = {
  // 컬러
  colors: {
    white: "#FFFFFF",
    offWhite: "#F5F5F0",
    lightGray: "#E8E8E3",
    warmGray: "#B5B0A8",
    mediumGray: "#8A8580",
    darkGray: "#3D3D3D",
    charcoal: "#2A2A2A",
    black: "#1A1A1A",
    
    // 포인트 컬러
    gold: "#C9A96E",
    softGold: "#D4BA82",
    warmBeige: "#D4C5A9",
    forestGreen: "#4A6741",
    deepNavy: "#2C3E50",
    
    // 강조 컬러 (유튜브 인트로 스타일)
    emphasisYellow: "#FFD700",
    emphasisOrange: "#FF8C00",
    emphasisRed: "#FF4444",
    emphasisCyan: "#00D4FF",
    
    // 부동산 광고 전용 원색 (가독성 극대화)
    adRed: "#E61919",
    adYellow: "#FFE600",
    adNavy: "#002855",
    adBlue: "#005BAC",
    
    // 반투명
    overlayLight: "rgba(255, 255, 255, 0.85)",
    overlayDark: "rgba(26, 26, 26, 0.75)",
    overlayDarkStrong: "rgba(26, 26, 26, 0.90)",
    overlayBlur: "rgba(255, 255, 255, 0.15)",
  },

  // 폰트
  fonts: {
    primary: "'Pretendard', 'Noto Sans KR', sans-serif",
    display: "'Noto Serif KR', serif",
    impact: "'Black Han Sans', 'Noto Sans KR', sans-serif",  // 강조용 임팩트체 (꼭 등)
    gmarket: "'Gmarket Sans', 'Noto Sans KR', sans-serif", // 부동산 광고용 굵고 단단한 폰트
    mono: "'JetBrains Mono', monospace",
  },

  // 폰트 크기 (1920x1080 기준)
  fontSize: {
    xs: 18,
    sm: 22,
    md: 28,
    lg: 36,
    xl: 48,
    xxl: 64,
    hero: 80,
    mega: 120,    // 강조 텍스트 ("꼭" 스타일)
    ultra: 160,   // 초대형 한 글자 강조
  },

  // 자간
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 1,
    wider: 2,
    widest: 4,
  },

  // 그림자
  shadows: {
    text: "0 2px 8px rgba(0,0,0,0.3)",
    textStrong: "0 2px 12px rgba(0,0,0,0.6)",
    card: "0 4px 20px rgba(0,0,0,0.15)",
    cardStrong: "0 8px 32px rgba(0,0,0,0.25)",
  },

  // 둥글기
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },
} as const;

// ============================================================
// 📐 레이아웃 프리셋 (위치)
// ============================================================

export const POSITION = {
  /** 화면 중앙 */
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  } as CSSProperties,

  /** 하단 중앙 (자막 영역) */
  bottomCenter: {
    position: "absolute" as const,
    bottom: 80,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
  } as CSSProperties,

  /** 하단 좌측 */
  bottomLeft: {
    position: "absolute" as const,
    bottom: 60,
    left: 60,
  } as CSSProperties,

  /** 상단 좌측 */
  topLeft: {
    position: "absolute" as const,
    top: 60,
    left: 60,
  } as CSSProperties,

  /** 상단 우측 */
  topRight: {
    position: "absolute" as const,
    top: 60,
    right: 60,
  } as CSSProperties,

  /** 좌측 중앙 */
  centerLeft: {
    position: "absolute" as const,
    top: "50%",
    left: 60,
    transform: "translateY(-50%)",
  } as CSSProperties,

  /** उ측 하단 (정보 카드 영역) */
  bottomRight: {
    position: "absolute" as const,
    bottom: 60,
    right: 60,
  } as CSSProperties,

  /** 우측 세로 배너 영역 (부동산 전단지 특징) */
  rightVertical: {
    position: "absolute" as const,
    top: 0,
    bottom: 0,
    right: 0,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    padding: "40px 20px",
  } as CSSProperties,
};

// ============================================================
// 🏷️ 프리셋 스타일 (Preset Styles)
// ============================================================

/**
 * PRESET-01: 메인 타이틀
 * - 큰 세리프 폰트 + 가는 라인
 * - 중앙 배치, 고급스러운 느낌
 */
export const PRESET_MAIN_TITLE: CSSProperties = {
  fontFamily: TOKENS.fonts.display,
  fontSize: TOKENS.fontSize.hero,
  fontWeight: 300,
  color: TOKENS.colors.white,
  letterSpacing: TOKENS.letterSpacing.widest,
  textShadow: TOKENS.shadows.textStrong,
  textAlign: "center",
  lineHeight: 1.3,
};

/**
 * PRESET-02: 섹션 타이틀 (공간 이름)
 * - 예: "거실", "주방", "안마당"
 * - 좌측 골드 라인 + 깔끔한 고딕
 */
export const PRESET_SECTION_TITLE: CSSProperties = {
  fontFamily: TOKENS.fonts.primary,
  fontSize: TOKENS.fontSize.xl,
  fontWeight: 600,
  color: TOKENS.colors.white,
  letterSpacing: TOKENS.letterSpacing.wide,
  textShadow: TOKENS.shadows.text,
  borderLeft: `3px solid ${TOKENS.colors.gold}`,
  paddingLeft: 16,
};

/**
 * PRESET-03: 서브 타이틀 / 설명
 * - 섹션 타이틀 아래 부가 설명
 */
export const PRESET_SUB_TITLE: CSSProperties = {
  fontFamily: TOKENS.fonts.primary,
  fontSize: TOKENS.fontSize.md,
  fontWeight: 300,
  color: TOKENS.colors.warmGray,
  letterSpacing: TOKENS.letterSpacing.wide,
  lineHeight: 1.6,
};

/**
 * PRESET-04: 정보 라벨
 * - 예: "면적 84㎡ | 방 3 | 욕실 2"
 * - 반투명 배경 카드 + 작은 글씨
 */
export const PRESET_INFO_LABEL: CSSProperties = {
  fontFamily: TOKENS.fonts.primary,
  fontSize: TOKENS.fontSize.sm,
  fontWeight: 400,
  color: TOKENS.colors.offWhite,
  letterSpacing: TOKENS.letterSpacing.wider,
  background: TOKENS.colors.overlayDark,
  backdropFilter: "blur(12px)",
  padding: "10px 20px",
  borderRadius: TOKENS.radius.sm,
};

/**
 * PRESET-05: 핵심 수치 / 가격
 * - 큰 숫자 + 골드 컬러
 * - 예: "5억 1,010만원"
 */
export const PRESET_KEY_NUMBER: CSSProperties = {
  fontFamily: TOKENS.fonts.primary,
  fontSize: TOKENS.fontSize.xxl,
  fontWeight: 700,
  color: TOKENS.colors.gold,
  letterSpacing: TOKENS.letterSpacing.tight,
  textShadow: TOKENS.shadows.textStrong,
};

/**
 * PRESET-06: 정보 카드
 * - 반투명 배경 + 블러 + 라운드
 * - 제목 + 본문 구조
 */
export const PRESET_INFO_CARD: CSSProperties = {
  background: TOKENS.colors.overlayDarkStrong,
  backdropFilter: "blur(16px)",
  borderRadius: TOKENS.radius.lg,
  padding: "24px 32px",
  border: `1px solid rgba(255,255,255,0.08)`,
  maxWidth: 480,
  boxShadow: TOKENS.shadows.cardStrong,
};

/** 정보 카드 내부 제목 */
export const PRESET_INFO_CARD_TITLE: CSSProperties = {
  fontFamily: TOKENS.fonts.primary,
  fontSize: TOKENS.fontSize.lg,
  fontWeight: 600,
  color: TOKENS.colors.white,
  marginBottom: 8,
  letterSpacing: TOKENS.letterSpacing.wide,
};

/** 정보 카드 내부 본문 */
export const PRESET_INFO_CARD_BODY: CSSProperties = {
  fontFamily: TOKENS.fonts.primary,
  fontSize: TOKENS.fontSize.sm,
  fontWeight: 300,
  color: TOKENS.colors.lightGray,
  lineHeight: 1.7,
};

/**
 * PRESET-07: 미니멀 캡션 (일반 자막 대체)
 * - 하단 중앙, 깔끔한 흰 글씨
 * - 미세한 그림자만
 */
export const PRESET_MINIMAL_CAPTION: CSSProperties = {
  fontFamily: TOKENS.fonts.primary,
  fontSize: TOKENS.fontSize.lg,
  fontWeight: 400,
  color: TOKENS.colors.white,
  textShadow: "0 1px 6px rgba(0,0,0,0.5), 0 0px 2px rgba(0,0,0,0.8)",
  textAlign: "center",
  lineHeight: 1.5,
  maxWidth: 900,
};

/**
 * PRESET-08: 태그 배지
 * - 예: "#모델하우스" "#분양중"
 * - 작은 필 뱃지
 */
export const PRESET_TAG_BADGE: CSSProperties = {
  fontFamily: TOKENS.fonts.primary,
  fontSize: TOKENS.fontSize.xs,
  fontWeight: 500,
  color: TOKENS.colors.gold,
  background: "rgba(201, 169, 110, 0.15)",
  border: `1px solid rgba(201, 169, 110, 0.3)`,
  padding: "6px 14px",
  borderRadius: TOKENS.radius.round,
  letterSpacing: TOKENS.letterSpacing.wide,
};

/**
 * PRESET-09: 위치/주소 라벨
 * - 예: "📍 충남 아산시 탕정면"
 * - 아이콘 + 작은 텍스트
 */
export const PRESET_LOCATION_LABEL: CSSProperties = {
  fontFamily: TOKENS.fonts.primary,
  fontSize: TOKENS.fontSize.sm,
  fontWeight: 400,
  color: TOKENS.colors.warmBeige,
  letterSpacing: TOKENS.letterSpacing.wider,
  display: "flex",
  alignItems: "center",
  gap: 8,
};

/**
 * PRESET-10: 구분선 (Divider)
 * - 골드 색상의 가는 수평선
 */
export const PRESET_DIVIDER: CSSProperties = {
  width: 60,
  height: 1,
  background: TOKENS.colors.gold,
  margin: "16px 0",
  opacity: 0.6,
};

/**
 * PRESET-11: CTA / 아웃트로
 * - "좋아요 & 구독" 영역
 */
export const PRESET_CTA: CSSProperties = {
  fontFamily: TOKENS.fonts.primary,
  fontSize: TOKENS.fontSize.md,
  fontWeight: 500,
  color: TOKENS.colors.white,
  background: TOKENS.colors.gold,
  padding: "14px 36px",
  borderRadius: TOKENS.radius.md,
  letterSpacing: TOKENS.letterSpacing.wide,
  textAlign: "center",
  cursor: "pointer",
};

/**
 * PRESET-12: 워터마크 / 채널명
 * - 우하단 반투명
 */
export const PRESET_WATERMARK: CSSProperties = {
  fontFamily: TOKENS.fonts.primary,
  fontSize: TOKENS.fontSize.xs,
  fontWeight: 300,
  color: "rgba(255,255,255,0.4)",
  letterSpacing: TOKENS.letterSpacing.widest,
  textTransform: "uppercase" as const,
};

// ============================================================
// 🔥 강조 프리셋 (Emphasis Presets) - 유튜브 인트로 스타일
// ============================================================

/**
 * PRESET-13: 강조 텍스트 (Emphasis Word)
 * - 레퍼런스: "꼭" 스타일
 * - 매우 큰 노란색 볼드, 강한 그림자
 * - 1~2글자 핵심 키워드에 사용
 */
export const PRESET_EMPHASIS_WORD: CSSProperties = {
  fontFamily: TOKENS.fonts.impact,
  fontSize: TOKENS.fontSize.mega,
  fontWeight: 900,
  color: TOKENS.colors.emphasisYellow,
  textShadow: "0 4px 16px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.8)",
  lineHeight: 1.0,
  letterSpacing: TOKENS.letterSpacing.tight,
};

/**
 * PRESET-14: 강조 텍스트 (초대형, 한 글자)
 * - 레퍼런스: "꼭" 한 글자가 화면 중앙에 크게
 * - ultra 사이즈, 단독 사용
 */
export const PRESET_EMPHASIS_SINGLE: CSSProperties = {
  fontFamily: TOKENS.fonts.impact,
  fontSize: TOKENS.fontSize.ultra,
  fontWeight: 900,
  color: TOKENS.colors.emphasisYellow,
  textShadow: "0 6px 24px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.9)",
  lineHeight: 0.9,
};

/**
 * PRESET-15: 강조 옆 일반 텍스트
 * - 레퍼런스: "가봐야하는 국내여행지" 스타일
 * - 강조 텍스트 옆/아래에 배치되는 흰색 본문
 */
export const PRESET_EMPHASIS_BODY: CSSProperties = {
  fontFamily: TOKENS.fonts.primary,
  fontSize: TOKENS.fontSize.xl,
  fontWeight: 700,
  color: TOKENS.colors.white,
  textShadow: "0 2px 12px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.9)",
  lineHeight: 1.3,
};

/**
 * PRESET-16: 곡선 영문 라벨
 * - 레퍼런스: "SOUTH KOREA" 아치형 텍스트
 * - 작은 영문, 넓은 자간, 골드/흰색
 */
export const PRESET_ARCH_LABEL: CSSProperties = {
  fontFamily: TOKENS.fonts.primary,
  fontSize: TOKENS.fontSize.sm,
  fontWeight: 600,
  color: TOKENS.colors.softGold,
  letterSpacing: TOKENS.letterSpacing.widest,
  textTransform: "uppercase" as const,
  textShadow: TOKENS.shadows.text,
};

/**
 * PRESET-17: 해시태그 배지 (유튜브 인트로 스타일)
 * - 레퍼런스: "#국내여행 #먹방여행 #한국여행"
 * - 반투명 다크 배경 + 라운드 + 흰색 텍스트
 * - 하단에 가로 나열
 */
export const PRESET_HASHTAG_BADGE: CSSProperties = {
  fontFamily: TOKENS.fonts.primary,
  fontSize: TOKENS.fontSize.md,
  fontWeight: 500,
  color: TOKENS.colors.white,
  background: "rgba(0, 0, 0, 0.45)",
  backdropFilter: "blur(8px)",
  padding: "10px 24px",
  borderRadius: TOKENS.radius.md,
  letterSpacing: TOKENS.letterSpacing.wide,
};

/** 해시태그 배지 컨테이너 (가로 나열용) */
export const PRESET_HASHTAG_ROW: CSSProperties = {
  display: "flex",
  gap: 16,
  justifyContent: "center",
  flexWrap: "wrap" as const,
};

// ============================================================
// 📣 부동산 광고 프리셋 (Real Estate Ad Presets) - 블로그/전단지 스타일
// ============================================================

/**
 * PRESET-18: 광고 메인 헤드라인 (두꺼운 테두리)
 * - 레퍼런스: "천안성성자이", "분양예정" 등
 * - Gmarket Sans 등 매우 굵고 단단한 고딕, 글씨 외곽선(Stroke)
 */
export const PRESET_AD_STROKE_TEXT: CSSProperties = {
  fontFamily: TOKENS.fonts.gmarket,
  fontSize: TOKENS.fontSize.hero,
  fontWeight: 900,
  color: TOKENS.colors.white,
  WebkitTextStroke: `4px ${TOKENS.colors.adNavy}`, // 글씨 테두리 효과
  textShadow: "0 6px 12px rgba(0,0,0,0.3)",
  letterSpacing: TOKENS.letterSpacing.tight,
  lineHeight: 1.1,
};

/**
 * PRESET-19: 하이라이트 박스 텍스트
 * - 레퍼런스: "매출 쌉보장!", "선착순 동호지정"
 * - 노란 배경 + 네이비/검정 텍스트로 극강의 가독성
 */
export const PRESET_AD_HIGHLIGHT_BOX: CSSProperties = {
  fontFamily: TOKENS.fonts.gmarket,
  fontSize: TOKENS.fontSize.xl,
  fontWeight: 800,
  color: TOKENS.colors.adNavy,
  backgroundColor: TOKENS.colors.adYellow,
  padding: "16px 32px",
  borderRadius: TOKENS.radius.sm,
  display: "inline-block",
  boxShadow: TOKENS.shadows.card,
};

/**
 * PRESET-20: 우측 세로 배너
 * - 레퍼런스: "당첨자발표", "미분양줍줍" 우측 세로 나열
 * - 빨간 배경 + 흰 글씨 또는 흰 배경 + 빨간 글씨, 세로 쓰기 레이아웃은 외부에서 flex-direction:column으로 처리 권장
 */
export const PRESET_AD_VERTICAL_BANNER: CSSProperties = {
  fontFamily: TOKENS.fonts.impact,
  fontSize: TOKENS.fontSize.xxl,
  fontWeight: 900,
  color: TOKENS.colors.adRed,
  backgroundColor: TOKENS.colors.white,
  padding: "40px 20px",
  textAlign: "center",
  lineHeight: 1.1,
  boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
  wordBreak: "keep-all",
};

/**
 * PRESET-21: 전화번호 박스
 * - 레퍼런스: "010-8282-8684" 알약 모양 배경
 * - 연한 하늘색/회색 배경 + 파란색 진한 번호 글씨
 */
export const PRESET_AD_PHONE_BOX: CSSProperties = {
  fontFamily: TOKENS.fonts.gmarket,
  fontSize: TOKENS.fontSize.xl,
  fontWeight: 800,
  color: TOKENS.colors.adBlue,
  backgroundColor: "#E6F0FA",
  padding: "12px 40px",
  borderRadius: TOKENS.radius.round,
  letterSpacing: 2,
  border: `2px solid ${TOKENS.colors.adBlue}`,
};

/**
 * PRESET-22: 리본형 타이틀 배너
 * - 레퍼런스: "천안아산 부동산 소식" 양끝이 뾰족한/잘린 모양 (CSS clip-path 활용 가능)
 */
export const PRESET_AD_RIBBON: CSSProperties = {
  fontFamily: TOKENS.fonts.gmarket,
  fontSize: TOKENS.fontSize.lg,
  fontWeight: 700,
  color: TOKENS.colors.adBlue,
  backgroundColor: "#F0F0F0",
  padding: "16px 60px",
  textAlign: "center",
  // 리본 모양을 위한 간단한 clip-path (브라우저 지원)
  clipPath: "polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%, 5% 50%)",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

// ============================================================
// 🎬 전체 프리셋 맵 (이름으로 참조)
// ============================================================

export const PRESETS = {
  // 기본 (걸리버하우스 스타일)
  mainTitle: PRESET_MAIN_TITLE,
  sectionTitle: PRESET_SECTION_TITLE,
  subTitle: PRESET_SUB_TITLE,
  infoLabel: PRESET_INFO_LABEL,
  keyNumber: PRESET_KEY_NUMBER,
  infoCard: PRESET_INFO_CARD,
  infoCardTitle: PRESET_INFO_CARD_TITLE,
  infoCardBody: PRESET_INFO_CARD_BODY,
  minimalCaption: PRESET_MINIMAL_CAPTION,
  tagBadge: PRESET_TAG_BADGE,
  locationLabel: PRESET_LOCATION_LABEL,
  divider: PRESET_DIVIDER,
  cta: PRESET_CTA,
  watermark: PRESET_WATERMARK,
  // 강조 (유튜브 인트로 스타일)
  emphasisWord: PRESET_EMPHASIS_WORD,
  emphasisSingle: PRESET_EMPHASIS_SINGLE,
  emphasisBody: PRESET_EMPHASIS_BODY,
  archLabel: PRESET_ARCH_LABEL,
  hashtagBadge: PRESET_HASHTAG_BADGE,
  hashtagRow: PRESET_HASHTAG_ROW,
  // 부동산 광고 썸네일/전단지 스타일
  adStrokeText: PRESET_AD_STROKE_TEXT,
  adHighlightBox: PRESET_AD_HIGHLIGHT_BOX,
  adVerticalBanner: PRESET_AD_VERTICAL_BANNER,
  adPhoneBox: PRESET_AD_PHONE_BOX,
  adRibbon: PRESET_AD_RIBBON,
} as const;

export default PRESETS;
