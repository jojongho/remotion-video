/**
 * AreaExplainer.tsx — v3
 * "국민평형 84타입인데 왜 이렇게 좁아 보이나요?"
 *
 * 변경 사항 (v3):
 *  - 실제 SRT 타이밍 기반 (총 7분 12초, 432s)
 *  - 84타입 = 전용 84㎡ = 26평 (국민주택 규모, 85㎡ 이하)
 *  - 서비스면적 5~6평 (발코니), 확장 후 31~32평 체감
 *  - 공급 115㎡ = 35평, 계약 169㎡ = 51평
 *  - "33평형" = 예전 공급 109㎡ ÷ 3.3 관행적 명칭
 *  - SRT 자막 싱크, 섹션별 인포그래픽 애니메이션
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { SubtitleOverlay, SubtitleCue } from './components/SubtitleOverlay';
import { parseSrt } from './utils/parseSrt';

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

// ─────────────────────────────────────
// 실제 녹음 기반 섹션 타이밍 (SRT 분석)
// ─────────────────────────────────────
const T = {
  hook:    { from: s(0),   dur: s(24)  },
  intro:   { from: s(23),  dur: s(80)  },
  jeon:    { from: s(100), dur: s(115) },
  service: { from: s(214), dur: s(143) },
  gong:    { from: s(356), dur: s(140) },
  summary: { from: s(495), dur: s(123) },
  tip:     { from: s(617), dur: s(75)  },
  cta:     { from: s(692), dur: s(40)  },
};

// ─────────────────────────────────────
// 색상 팔레트
// ─────────────────────────────────────
const C = {
  jeon:    { main: '#2563EB', bg: '#EFF6FF', border: '#93C5FD', light: '#DBEAFE' },
  service: { main: '#16A34A', bg: '#F0FDF4', border: '#86EFAC', light: '#DCFCE7' },
  gong:    { main: '#D97706', bg: '#FFFBEB', border: '#FCD34D', light: '#FEF3C7' },
  gyeyak:  { main: '#6B7280', bg: '#F9FAFB', border: '#D1D5DB', light: '#F3F4F6' },
  dark:    '#111827',
  mid:     '#374151',
  muted:   '#6B7280',
};

// ─────────────────────────────────────
// 유틸
// ─────────────────────────────────────
const spr = (frame: number, fps: number, delay = 0) =>
  spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 16, stiffness: 110 } });

const fadeSeq = (frame: number, from: number, dur: number) => {
  const i = interpolate(frame, [from, from + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const o = interpolate(frame, [from + dur - 6, from + dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return Math.min(i, o);
};

// ─────────────────────────────────────
// 아파트 평면도 SVG — 단계별
// ─────────────────────────────────────
const FloorPlanSVG: React.FC<{ phase: 0|1|2|3|4; localFrame: number }> = ({ phase, localFrame }) => {
  const { fps } = useVideoConfig();
  const op1 = phase >= 1 ? spr(localFrame, fps, 0)  : 0;
  const op2 = phase >= 2 ? spr(localFrame, fps, 8)  : 0;
  const op3 = phase >= 3 ? spr(localFrame, fps, 16) : 0;
  const op4 = phase >= 4 ? spr(localFrame, fps, 24) : 0;

  return (
    <svg viewBox="0 0 600 520" style={{ width: '100%', height: '100%' }}>
      {/* 계약 (기타공용) */}
      <g opacity={op4}>
        <rect x="4" y="4" width="592" height="512" rx="16"
          fill={C.gyeyak.light} stroke={C.gyeyak.border} strokeWidth="3" strokeDasharray="10,5" />
        <text x="300" y="30" textAnchor="middle" fill={C.gyeyak.main}
          fontSize="14" fontWeight="700" fontFamily="Pretendard,sans-serif">
          기타공용 (지하주차장·관리소·커뮤니티) — 16.3평
        </text>
        <text x="300" y="505" textAnchor="middle" fill="#9CA3AF"
          fontSize="13" fontFamily="Pretendard,sans-serif">계약면적 169㎡ ≈ 51평</text>
      </g>
      {/* 공급 (주거공용) */}
      <g opacity={op3}>
        <rect x="54" y="50" width="492" height="418" rx="12"
          fill={C.gong.bg} stroke={C.gong.border} strokeWidth="3" />
        <text x="300" y="78" textAnchor="middle" fill={C.gong.main}
          fontSize="14" fontWeight="700" fontFamily="Pretendard,sans-serif">
          주거공용 (복도·계단·엘리베이터) — 9.2평
        </text>
        <text x="300" y="460" textAnchor="middle" fill={C.gong.main}
          fontSize="13" fontFamily="Pretendard,sans-serif">공급면적 115㎡ ≈ 35평</text>
      </g>
      {/* 서비스 (발코니) */}
      <g opacity={op2}>
        <rect x="108" y="96" width="62" height="330" rx="8"
          fill={C.service.bg} stroke={C.service.border} strokeWidth="3" />
        <text x="139" y="270" textAnchor="middle" fill={C.service.main}
          fontSize="12" fontWeight="700" fontFamily="Pretendard,sans-serif"
          transform="rotate(-90,139,270)">발코니(서비스) ≈ 5~6평</text>
        <rect x="430" y="96" width="62" height="330" rx="8"
          fill={C.service.bg} stroke={C.service.border} strokeWidth="3" />
        <text x="461" y="270" textAnchor="middle" fill={C.service.main}
          fontSize="12" fontWeight="700" fontFamily="Pretendard,sans-serif"
          transform="rotate(90,461,270)">발코니(서비스) ≈ 5~6평</text>
      </g>
      {/* 전용 */}
      <g opacity={op1}>
        <rect x="172" y="96" width="256" height="330" rx="8"
          fill={C.jeon.bg} stroke={C.jeon.main} strokeWidth="4" />
        <line x1="300" y1="96" x2="300" y2="426" stroke={C.jeon.border} strokeWidth="1.5" />
        <line x1="172" y1="240" x2="428" y2="240" stroke={C.jeon.border} strokeWidth="1.5" />
        <text x="236" y="182" textAnchor="middle" fill="#93C5FD" fontSize="14" fontFamily="Pretendard,sans-serif">거실</text>
        <text x="364" y="182" textAnchor="middle" fill="#93C5FD" fontSize="14" fontFamily="Pretendard,sans-serif">주방</text>
        <text x="236" y="344" textAnchor="middle" fill="#93C5FD" fontSize="14" fontFamily="Pretendard,sans-serif">침실①</text>
        <text x="364" y="344" textAnchor="middle" fill="#93C5FD" fontSize="14" fontFamily="Pretendard,sans-serif">침실②</text>
        <text x="300" y="220" textAnchor="middle" fill={C.jeon.main} fontSize="17"
          fontWeight="900" fontFamily="Pretendard,sans-serif">전용면적</text>
        <text x="300" y="252" textAnchor="middle" fill={C.jeon.main} fontSize="30"
          fontWeight="900" fontFamily="Pretendard,sans-serif">84㎡</text>
        <text x="300" y="278" textAnchor="middle" fill="#3B82F6" fontSize="15"
          fontWeight="700" fontFamily="Pretendard,sans-serif">≈ 26평 · 내 등기 공간</text>
      </g>
      {phase === 0 && (
        <text x="300" y="265" textAnchor="middle" fill="#D1D5DB" fontSize="20"
          fontFamily="Pretendard,sans-serif">면적 구분 다이어그램</text>
      )}
    </svg>
  );
};

// ─────────────────────────────────────
// 발코니 확장 Before/After
// ─────────────────────────────────────
const BalconyExpansion: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const { fps } = useVideoConfig();
  const progress = spr(localFrame, fps, s(3));

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center', width: '100%' }}>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ background: C.jeon.bg, border: `3px solid ${C.jeon.main}`, borderRadius: 16, padding: '24px 20px' }}>
          <div style={{ fontSize: 14, color: C.muted, marginBottom: 8 }}>확장 전</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'flex-end' }}>
            {[{side:'left'},{side:'right'}].map((b, i) => (
              <React.Fragment key={i}>
                {i === 1 && (
                  <div style={{ width: 90, height: 110, background: C.jeon.light, border: `3px solid ${C.jeon.main}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 13, color: C.jeon.main, fontWeight: 700 }}>전용 26평</span>
                  </div>
                )}
                <div style={{ width: 38, height: 110, background: C.service.bg, border: `2px dashed ${C.service.border}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 11, color: C.service.main, writingMode: 'vertical-rl', transform: i===0?'rotate(180deg)':undefined }}>발코니</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.jeon.main, marginTop: 12 }}>26평</div>
        </div>
      </div>
      <div style={{ fontSize: 36, color: C.service.main, opacity: progress }}>→</div>
      <div style={{ flex: 1, textAlign: 'center', opacity: progress, transform: `scale(${0.92 + 0.08 * progress})` }}>
        <div style={{ background: C.service.bg, border: `3px solid ${C.service.main}`, borderRadius: 16, padding: '24px 20px' }}>
          <div style={{ fontSize: 14, color: C.muted, marginBottom: 8 }}>확장 후 체감</div>
          <div style={{ width: '100%', height: 110, background: C.service.light, border: `3px solid ${C.service.main}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 15, color: C.service.main, fontWeight: 700 }}>전용 26평 + 발코니 5~6평</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.service.main, marginTop: 12 }}>31~32평 체감</div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────
// 평 계산기 시각화
// ─────────────────────────────────────
const CalcVisualizer: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const { fps } = useVideoConfig();
  const s1 = spr(localFrame, fps, 0);
  const s2 = spr(localFrame, fps, 20);
  const s3 = spr(localFrame, fps, 40);

  return (
    <div style={{ background: '#fff', border: `3px solid ${C.gong.border}`, borderRadius: 20, padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: 22, color: C.gong.main, fontWeight: 700, textAlign: 'center' }}>㎡ → 평 암산법</div>
      <div style={{ opacity: s1, textAlign: 'center' }}>
        <div style={{ background: C.gong.bg, border: `2px solid ${C.gong.border}`, borderRadius: 12, padding: '12px 28px', fontSize: 22, fontWeight: 800, color: C.gong.main, display: 'inline-block' }}>
          숫자 × 3  →  뒤 자리 하나 버리기
        </div>
      </div>
      <div style={{ display: 'flex', gap: 48, justifyContent: 'center', opacity: s2 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, color: C.muted }}>84 × 3 = 252</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.jeon.main }}>→ 약 26평</div>
          <div style={{ fontSize: 13, color: C.muted }}>84타입 전용</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, color: C.muted }}>59 × 3 ≈ 180</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.service.main }}>→ 약 18평</div>
          <div style={{ fontSize: 13, color: C.muted }}>59타입 전용</div>
        </div>
      </div>
      <div style={{ opacity: s3, background: C.jeon.light, borderRadius: 12, padding: '14px 24px', textAlign: 'center', fontSize: 18, color: C.jeon.main, fontWeight: 700 }}>
        국민평형 84타입 = 전용 84㎡ ≈ 26평 (법적 상한 85㎡ 이하)
      </div>
    </div>
  );
};

// ─────────────────────────────────────
// 33평형 유래 타임라인
// ─────────────────────────────────────
const HistoryTimeline: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const { fps } = useVideoConfig();
  const s1 = spr(localFrame, fps, 0);
  const s2 = spr(localFrame, fps, 20);
  const s3 = spr(localFrame, fps, 40);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      <div style={{ fontSize: 22, color: C.dark, fontWeight: 700, textAlign: 'center' }}>"33평형" 이름의 유래</div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
        <div style={{ flex: 1, opacity: s1, background: C.gyeyak.light, border: `2px solid ${C.gyeyak.border}`, borderRadius: 16, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 15, color: C.muted, fontWeight: 600 }}>2007년 이전 단지</div>
          <div style={{ fontSize: 13, color: C.mid }}>주거공용 설계 ≈ 25㎡</div>
          <div style={{ background: '#fff', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: C.muted }}>전용 84 + 주거공용 25</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.gyeyak.main }}>= 공급 109㎡</div>
            <div style={{ fontSize: 16, color: C.gyeyak.main }}>109 ÷ 3.3 = <strong>33평</strong></div>
          </div>
          <div style={{ fontSize: 14, color: C.service.main, fontWeight: 700 }}>→ "33평형" 명칭 고착화</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', opacity: s2 }}>
          <div style={{ fontSize: 32, color: C.gong.main }}>→</div>
        </div>
        <div style={{ flex: 1, opacity: s3, background: C.gong.bg, border: `2px solid ${C.gong.border}`, borderRadius: 16, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 15, color: C.gong.main, fontWeight: 600 }}>현재 신규 단지</div>
          <div style={{ fontSize: 13, color: C.mid }}>주거공용 설계 ≈ 30㎡</div>
          <div style={{ background: '#fff', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: C.muted }}>전용 84 + 주거공용 30</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.gong.main }}>= 공급 115㎡</div>
            <div style={{ fontSize: 16, color: C.gong.main }}>115 ÷ 3.3 ≈ <strong>35평</strong></div>
          </div>
          <div style={{ fontSize: 14, color: C.muted }}>관행적으로 여전히 "33평형"이라 부름</div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────
// 정리 카드
// ─────────────────────────────────────
const SummaryCards: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const { fps } = useVideoConfig();
  const rows = [
    { label: '전용면적',       sqm: '84㎡',   py: '약 26평',    desc: '내 등기 공간 — 방·거실·주방·화장실',      color: C.jeon },
    { label: '서비스(발코니)', sqm: '~18㎡',  py: '약 5~6평',   desc: '확장 가능 — 모집공고 미표기',             color: C.service },
    { label: '확장 후 체감',   sqm: '~103㎡', py: '약 31~32평', desc: '전용+발코니 합산 실사용 공간',            color: C.service },
    { label: '공급면적',       sqm: '115㎡',  py: '약 35평',    desc: '분양 광고 기준 — 전용+주거공용',          color: C.gong },
    { label: '계약면적',       sqm: '169㎡',  py: '약 51평',    desc: '계약서 기준 — 공급+기타공용',             color: C.gyeyak },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      {rows.map((row, i) => {
        const op = spr(localFrame, fps, i * 12);
        const tx = interpolate(localFrame - i * 12, [0, 20], [-28, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <div key={row.label} style={{ opacity: op, transform: `translateX(${tx}px)`, background: row.color.bg, border: `2px solid ${row.color.border}`, borderRadius: 14, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: row.color.main, minWidth: 110 }}>{row.label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: row.color.main, minWidth: 80, textAlign: 'right' }}>{row.sqm}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: row.color.main, minWidth: 100, background: '#fff', padding: '4px 12px', borderRadius: 8 }}>{row.py}</div>
            <div style={{ flex: 1, fontSize: 15, color: C.mid }}>{row.desc}</div>
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────
// 씬 레이아웃: 좌우 분할
// ─────────────────────────────────────
const SplitScene: React.FC<{
  badge: string; badgeColor: string;
  title: string; titleSub?: string;
  bullets: string[]; right: React.ReactNode;
  localFrame: number; bgColor?: string;
}> = ({ badge, badgeColor, title, titleSub, bullets, right, localFrame, bgColor = '#fff' }) => {
  const { fps } = useVideoConfig();
  const op = spr(localFrame, fps, 0);
  const tx = interpolate(localFrame, [0, 20], [-28, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: bgColor, flexDirection: 'row' }}>
      <div style={{ width: '42%', padding: '72px 52px 72px 72px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18, opacity: op, transform: `translateX(${tx}px)` }}>
        <div style={{ background: badgeColor, color: '#fff', fontSize: 17, fontWeight: 800, padding: '8px 20px', borderRadius: 50, display: 'inline-flex', alignSelf: 'flex-start' }}>{badge}</div>
        <div>
          <div style={{ fontSize: 44, fontWeight: 900, color: C.dark, lineHeight: 1.15 }}>{title}</div>
          {titleSub && <div style={{ fontSize: 24, fontWeight: 700, color: badgeColor, marginTop: 4 }}>{titleSub}</div>}
        </div>
        <div style={{ height: 2, background: '#F3F4F6', borderRadius: 2 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: 2, background: badgeColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>{i + 1}</div>
              <div style={{ fontSize: 19, color: C.mid, lineHeight: 1.45 }}>{b}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: '58%', padding: '52px 60px 52px 28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{right}</div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────
// SRT 원문 (빌드 내장)
// ─────────────────────────────────────
const SRT_CONTENT = `1
00:00:00,118 --> 00:00:02,401
아직도 평형으로 집 얘기하고 계시죠

2
00:00:02,958 --> 00:00:06,161
33평이라고 해서 갔는데 왜 이렇게 좁아 보이지

3
00:00:07,758 --> 00:00:11,841
방문하면서 이런 생각 한번쯤 했을 것 같은데요

4
00:00:12,398 --> 00:00:15,601
84타입이라는데 어디서는 26평이라고 하고

5
00:00:15,918 --> 00:00:17,841
또 어디서는 33평이라고 하고

6
00:00:18,432 --> 00:00:21,607
계약서엔 51평이라고 적혀있고

7
00:00:21,912 --> 00:00:23,687
뭐가 맞는건지 헷갈리셨죠

8
00:00:23,872 --> 00:00:28,767
안녕하세요 부동산 기획 전문가이자 현직 공인중개사 조소장입니다

9
00:00:29,872 --> 00:00:33,847
모르면 손해보지만 알면 부자되는 부동산 공식

10
00:00:34,280 --> 00:00:37,163
오늘 아주 쉽게 설명해 드리겠습니다

11
00:00:37,516 --> 00:00:40,163
평 계산법부터 정리해 드릴게요

12
00:00:40,596 --> 00:00:46,203
제곱미터를 평으로 바꾸려면 0.3025를 곱하면 되는데

13
00:00:46,716 --> 00:00:53,443
소수점 나오면 멈추는 분들이 있습니다 저도 그래요

14
00:00:54,346 --> 00:00:57,653
그냥 이렇게 하시면 됩니다 숫자에 3 곱하고

15
00:00:57,946 --> 00:01:00,093
뒤에 숫자 하나만 버리면 됩니다

16
00:01:00,746 --> 00:01:06,346
84 곱하기 3은 252 뒤에 하나 버리면 약 26평

17
00:01:09,680 --> 00:01:14,851
59 곱하기 3은 약 180 뒤에 하나 버리면 약 18평

18
00:01:17,508 --> 00:01:24,131
그러니까 국민평형 84타입 전용면적 기준으로 보면 약 26평짜리 집입니다

19
00:01:36,286 --> 00:01:40,753
33평형이라고 하냐고요 그게 오늘의 핵심입니다

20
00:01:41,446 --> 00:01:43,033
첫 번째 전용면적입니다

21
00:01:43,246 --> 00:01:49,673
전용면적이 진짜 내가 쓰는 공간이에요 방 거실 주방 화장실 벽 안쪽

22
00:01:50,406 --> 00:01:53,313
등기부에 내 이름으로 잡히는 면적입니다

23
00:01:53,918 --> 00:02:02,681
84타입 전용면적을 보면 보통 84.6에서 84.9에 맞춥니다

24
00:02:03,158 --> 00:02:11,041
건설사에서 법적 허용 기준인 85제곱미터 안쪽에서 설계를 맞춰야 되기 때문에

25
00:02:11,358 --> 00:02:14,201
약 26평 이게 실제 내 공간입니다

26
00:02:14,600 --> 00:02:18,766
분양 광고에서는 꼭 이렇게 써놓죠 33평형

27
00:02:19,194 --> 00:02:23,966
정작 내 등기공간은 26평인데 말이에요

28
00:02:24,354 --> 00:02:29,731
어떻게 26평짜리가 33평형이 되냐구요

29
00:02:30,388 --> 00:02:34,891
두번째 서비스면적입니다 흔히 베란다 발코니라고 부르는 공간이에요

30
00:02:35,228 --> 00:02:38,413
전용면적에 포함되어 있지 않습니다

31
00:02:39,746 --> 00:02:47,653
입주자모집공고에도 표기 의무가 없어서 같은 84타입이라도 건설사마다 발코니 크기가 달라요

32
00:02:52,146 --> 00:02:56,466
예전엔 이 공간을 진짜 반야외처럼 썼어요 화초키우고 빨래놀고

33
00:03:00,519 --> 00:03:05,800
아파트는 이걸 확장할 수 있어요 샷시 걷어내고 난방 놓고 마루 깔면 실내로 편입

34
00:03:06,240 --> 00:03:08,877
이게 2006년부터 합법화 됐거든요

35
00:03:09,322 --> 00:03:16,997
84타입 전용 26평짜리 집도 발코니 5~6평 확장하면 31~32평처럼 느껴지는 거에요

36
00:03:19,722 --> 00:03:21,397
체감이 달라지는 이유가 여기 있어요

37
00:03:21,482 --> 00:03:27,077
오피스텔이나 아파텔은 이거 안 됩니다 발코니 구조 자체가 없거든요

38
00:03:28,841 --> 00:03:33,638
아파트는 되고 오피스텔은 안되는 거에요 실사용 면적 차이가 크게 납니다

39
00:03:36,361 --> 00:03:40,638
발코니 확장 비용 요즘은 발코니 확장 옵션으로 따로 청구합니다

40
00:03:41,201 --> 00:03:45,398
84타입 기준으로 1000만원에서 2000만원이 넘는 경우도 있어요

41
00:03:46,280 --> 00:03:53,696
어느 정도는 분양가에 반영돼 있기도 하고 지역이랑 건설사마다 편차가 크고요

42
00:03:54,223 --> 00:03:56,576
세 번째 공급면적과 계약면적입니다

43
00:03:56,983 --> 00:04:00,816
공급면적은 전용에 주거 공용 공간을 더한 거예요

44
00:04:01,143 --> 00:04:03,296
계단 복도 엘리베이터 홀

45
00:04:04,080 --> 00:04:07,201
같은 층 이웃들이랑 같이 쓰는 공간들이죠

46
00:04:07,798 --> 00:04:11,601
84타입 기준으로 이걸 더하면 약 115제곱미터 35평 수준이에요

47
00:04:15,718 --> 00:04:20,081
분양광고에 나오는 84타입이라는 숫자가 사실은 이 공급면적입니다

48
00:04:20,600 --> 00:04:23,161
계약면적은 여기서 한 단계 더 나갑니다

49
00:04:23,518 --> 00:04:26,081
지하주차장 관리사무소 커뮤니티 시설

50
00:04:26,198 --> 00:04:35,361
단지 전체 공용 공간까지 다 더하면 169제곱미터 51평이 됩니다

51
00:04:35,918 --> 00:04:38,881
그럼 33평형은 도대체 어디서 나온 말이냐구요

52
00:04:39,701 --> 00:04:45,258
2007년 이전 분양시장의 명칭이에요 당시엔 주거공용 설계가 작았어요

53
00:04:45,501 --> 00:04:54,857
전용 84에 주거공용 25를 더하면 공급이 109 109 나누기 3.3 하면 33평

54
00:04:55,262 --> 00:05:01,177
그게 33평형이라는 이름의 출발점입니다

55
00:05:01,422 --> 00:05:08,217
요즘 신규 단지들은 주거공용이 30제곱미터 수준으로 늘어났어요 공급면적이 115 약 35평이

56
00:05:08,819 --> 00:05:15,660
정확한 거에요 근데 관행적으로 여전히 33평이라고 부르는 거구요

57
00:05:16,099 --> 00:05:22,580
자 정리해 드릴게요 전용 84제곱미터 약 26평 이게 실제 내방 거실 주방 화장실

58
00:05:23,099 --> 00:05:26,820
서비스면적 약 5~6평 발코니 확장하면 내 공간이 되는 곳

59
00:05:27,259 --> 00:05:36,568
확장 후 체감이 약 31~32평 공급이 115제곱미터 약 35평 분양 광고 숫자

60
00:05:37,071 --> 00:05:41,408
계약면적 169제곱미터 약 51평 계약서 기준

61
00:05:42,364 --> 00:05:49,115
같은 집인데 광고엔 84타입 확장 후 체감은 31~32평 관행적 명칭은 구33평형 계약서엔 51평

62
00:06:00,476 --> 00:06:06,283
이 차이를 모르면 모델하우스 가면 항상 좁다고 느끼고 헷갈리게 됩니다

63
00:06:06,556 --> 00:06:10,803
모델하우스 방문 전에 전용면적 확인하고 가시면 좋을 것 같아요

64
00:06:11,156 --> 00:06:15,723
서비스면적도 꼭 물어보세요 모집공고에 안 나오는 숫자지만

65
00:06:16,036 --> 00:06:21,043
분양 담당자한테 물어보면 알려줍니다 보통 분양상담사도 잘 모릅니다

66
00:06:31,076 --> 00:06:34,843
발코니가 클수록 확장 후 체감이 훨씬 좋아진다는 점 알고 계시면 됩니다

67
00:06:37,716 --> 00:06:43,563
다음에 더 유용한 정보로 찾아오겠습니다 구독하고 알람 설정해두시면

68
00:06:43,916 --> 00:06:50,803
이런 유용한 정보 올라온 대로 바로 받아 볼 수 있습니다 감사합니다

69
00:06:51,468 --> 00:06:59,131
제가 운영하는 웹사이트 천안아산 청약분양센터에 오셔서 고객등록 한번씩 해주시고

70
00:06:59,588 --> 00:07:12,300
곧 멤버십으로 전환될 예정입니다 간단하게 등록해주시면 내집마련 청약에 큰 도움이 됩니다 감사합니다`;

// ─────────────────────────────────────
// 메인 컴포지션
// ─────────────────────────────────────
export const AreaExplainer: React.FC<{ audioSrc?: string }> = ({
  audioSrc = 'audio/area-explainer.mp3',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cues: SubtitleCue[] = parseSrt(SRT_CONTENT, fps);
  const lf = (from: number) => Math.max(0, frame - from);

  return (
    <AbsoluteFill style={{ background: '#fff', fontFamily: 'Pretendard, Apple SD Gothic Neo, sans-serif' }}>

      <Audio src={staticFile(audioSrc)} />

      {/* ── 씬 1: 훅 ── */}
      <Sequence from={T.hook.from} durationInFrames={T.hook.dur}>
        <AbsoluteFill style={{ opacity: fadeSeq(frame, T.hook.from, T.hook.dur) }}>
          <AbsoluteFill style={{
            background: 'linear-gradient(135deg, #111827 0%, #1E3A8A 100%)',
            justifyContent: 'center', alignItems: 'center',
            flexDirection: 'column', gap: 32, padding: '80px 160px',
          }}>
            <div style={{ fontSize: 22, color: '#93C5FD', fontWeight: 600 }}>부동산 용어 완전 정복 #1</div>
            <div style={{ fontSize: 56, color: '#FFFFFF', fontWeight: 900, textAlign: 'center', lineHeight: 1.2 }}>
              국민평형 84타입인데{'\n'}왜 이렇게 좁아 보이나요?
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
              {[
                { label: '광고에서는', value: '26평', sub: '전용 84㎡', color: C.jeon },
                { label: '또 어디서는', value: '33평형', sub: '관행적 명칭', color: C.gyeyak },
                { label: '계약서엔', value: '51평', sub: '계약 169㎡', color: { main: '#9CA3AF', bg: '#F3F4F6', border: '#E5E7EB' } },
              ].map((item) => (
                <div key={item.label} style={{ background: item.color.bg, padding: '18px 24px', borderRadius: 14, border: `2px solid ${item.color.border}`, textAlign: 'center', minWidth: 140 }}>
                  <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: item.color.main }}>{item.value}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      {/* ── 씬 2: 인트로 + 평 계산법 ── */}
      <Sequence from={T.intro.from} durationInFrames={T.intro.dur}>
        <AbsoluteFill style={{ opacity: fadeSeq(frame, T.intro.from, T.intro.dur), background: '#FFFBEB' }}>
          {frame < s(50) ? (
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 20, padding: '80px 200px' }}>
              <div style={{ fontSize: 22, color: C.muted }}>부동산 기획 전문가 · 공인중개사</div>
              <div style={{ fontSize: 60, fontWeight: 900, color: C.dark }}>조소장</div>
              <div style={{ fontSize: 22, color: C.mid, textAlign: 'center', lineHeight: 1.7 }}>
                모르면 손해보지만 알면 부자 되는 부동산 지식{'\n'}아주 쉽게 설명해 드릴게요
              </div>
            </AbsoluteFill>
          ) : (
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 28, padding: '60px 200px' }}>
              <div style={{ fontSize: 28, color: '#92400E', fontWeight: 700 }}>㎡ → 평 빠른 암산법</div>
              <CalcVisualizer localFrame={lf(s(52))} />
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* ── 씬 3: 전용면적 ── */}
      <Sequence from={T.jeon.from} durationInFrames={T.jeon.dur}>
        <AbsoluteFill style={{ opacity: fadeSeq(frame, T.jeon.from, T.jeon.dur) }}>
          <SplitScene
            badge="① 전용면적"
            badgeColor={C.jeon.main}
            title="진짜 내 공간"
            titleSub="84㎡ · 약 26평"
            bullets={[
              '방·거실·주방·화장실 — 벽 안쪽만',
              '등기부에 내 이름으로 잡히는 면적',
              '법적 국민주택 기준 85㎡ 이하 → 84.6~84.9㎡로 설계',
              '분양 광고에서 잘 안 보여주는 숫자',
            ]}
            right={<FloorPlanSVG phase={1} localFrame={lf(T.jeon.from)} />}
            localFrame={lf(T.jeon.from)}
          />
        </AbsoluteFill>
      </Sequence>

      {/* ── 씬 4: 서비스면적 ── */}
      <Sequence from={T.service.from} durationInFrames={T.service.dur}>
        <AbsoluteFill style={{ opacity: fadeSeq(frame, T.service.from, T.service.dur) }}>
          {frame < s(295) ? (
            <SplitScene
              badge="② 서비스면적 (발코니)"
              badgeColor={C.service.main}
              title="확장 가능한 보너스"
              titleSub="약 5~6평 · 모집공고 미표기"
              bullets={[
                '전용면적에 포함 안 됨 — 평수 계산 별도',
                '2006년 발코니 확장 합법화',
                '확장 후 체감 26평 → 31~32평',
                '오피스텔·아파텔은 발코니 없음 (확장 불가)',
              ]}
              right={<FloorPlanSVG phase={2} localFrame={lf(T.service.from)} />}
              localFrame={lf(T.service.from)}
              bgColor={C.service.bg}
            />
          ) : (
            <AbsoluteFill style={{ background: C.service.bg, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 28, padding: '60px 120px' }}>
              <BalconyExpansion localFrame={lf(s(295))} />
              <div style={{ background: '#fff', border: `2px solid ${C.service.border}`, borderRadius: 16, padding: '16px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: 17, color: C.muted }}>발코니 확장 옵션 비용 (84타입 기준)</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: C.service.main }}>1,000 ~ 2,000만원+</div>
                <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>지역·건설사마다 편차 큼. 분양가에 일부 반영되기도 함</div>
              </div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* ── 씬 5: 공급+계약+33평형 유래 ── */}
      <Sequence from={T.gong.from} durationInFrames={T.gong.dur}>
        <AbsoluteFill style={{ opacity: fadeSeq(frame, T.gong.from, T.gong.dur) }}>
          {frame < s(430) ? (
            <SplitScene
              badge="③ 공급 · 계약면적"
              badgeColor={C.gong.main}
              title="광고 숫자의 정체"
              titleSub="공급 115㎡ = 35평 · 계약 169㎡ = 51평"
              bullets={[
                '공급 = 전용 84 + 주거공용 30 = 115㎡ (35평)',
                '"84타입" 광고 숫자 = 이 공급면적',
                '계약 = 공급 + 기타공용 54 = 169㎡ (51평)',
                '계약서에 기재되는 최종 숫자',
              ]}
              right={<FloorPlanSVG phase={4} localFrame={lf(T.gong.from)} />}
              localFrame={lf(T.gong.from)}
            />
          ) : (
            <AbsoluteFill style={{ background: '#fff', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 28, padding: '60px 140px' }}>
              <HistoryTimeline localFrame={lf(s(430))} />
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* ── 씬 6: 정리 ── */}
      <Sequence from={T.summary.from} durationInFrames={T.summary.dur}>
        <AbsoluteFill style={{ opacity: fadeSeq(frame, T.summary.from, T.summary.dur) }}>
          <AbsoluteFill style={{ background: '#fff', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24, padding: '56px 120px' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: C.dark }}>3가지 면적 한눈에 정리</div>
            <SummaryCards localFrame={lf(T.summary.from)} />
            <div style={{ background: C.jeon.light, borderRadius: 14, padding: '14px 32px', textAlign: 'center', fontSize: 18, color: C.jeon.main, fontWeight: 700 }}>
              같은 집 — 광고 84타입 / 체감 31~32평 / 관행명 33평형 / 계약서 51평
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      {/* ── 씬 7: 실전팁 ── */}
      <Sequence from={T.tip.from} durationInFrames={T.tip.dur}>
        <AbsoluteFill style={{ opacity: fadeSeq(frame, T.tip.from, T.tip.dur) }}>
          <AbsoluteFill style={{ background: C.service.bg, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24, padding: '72px 120px' }}>
            <div style={{ fontSize: 24, color: C.service.main, fontWeight: 700 }}>✅ 실전 팁</div>
            <div style={{ fontSize: 38, fontWeight: 900, color: C.dark, textAlign: 'center', lineHeight: 1.3 }}>모델하우스 방문 전 꼭 확인하세요</div>
            <div style={{ display: 'flex', gap: 20, width: '100%' }}>
              {[
                { icon: '📐', title: '전용면적 확인', desc: '같은 84타입도 84.6㎡ vs 84.9㎡ 차이남\n작은 차이가 체감엔 크게 작용' },
                { icon: '🏗️', title: '서비스면적 문의', desc: '모집공고엔 없어도 담당자에게 물어보면 알 수 있음\n발코니 클수록 확장 후 체감 ↑' },
                { icon: '⚠️', title: '오피스텔 주의', desc: '오피스텔·아파텔은 발코니 없음\n전용률 30~50%로 체감 차이 큼' },
              ].map((tip) => (
                <div key={tip.title} style={{ flex: 1, background: '#fff', borderRadius: 16, border: `2px solid ${C.service.border}`, padding: '22px 18px' }}>
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{tip.icon}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: C.dark, marginBottom: 8 }}>{tip.title}</div>
                  <div style={{ fontSize: 14, color: C.mid, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{tip.desc}</div>
                </div>
              ))}
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      {/* ── 씬 8: CTA + 웹사이트 ── */}
      <Sequence from={T.cta.from} durationInFrames={T.cta.dur}>
        <AbsoluteFill style={{ opacity: fadeSeq(frame, T.cta.from, T.cta.dur) }}>
          <AbsoluteFill style={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
            justifyContent: 'center', alignItems: 'center',
            flexDirection: 'column', gap: 24, padding: '80px 200px',
          }}>
            <div style={{ fontSize: 22, color: '#BFDBFE' }}>🔔 구독 + 알림 설정</div>
            <div style={{ fontSize: 42, color: '#FFFFFF', fontWeight: 900, textAlign: 'center' }}>다음 영상: 청약 가점 계산법</div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '18px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: 17, color: '#93C5FD' }}>무료 고객 등록</div>
              <div style={{ fontSize: 26, color: '#FFFFFF', fontWeight: 800 }}>천안아산 청약분양센터</div>
              <div style={{ fontSize: 14, color: '#BFDBFE', marginTop: 4 }}>멤버십 전환 예정 — 지금 등록하면 우선 혜택</div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      {/* 자막 (항상 최상단) */}
      <SubtitleOverlay cues={cues} />

    </AbsoluteFill>
  );
};
