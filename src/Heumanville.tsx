import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useVideoConfig } from "remotion";
import { YouTubeEmphasisSubtitle, SpaceEntrySubtitle, SlidingInfoPanel } from "./components/KoreanSubtitles";
import { CtaOverlay } from "./components/CtaOverlay";
import { BannerOverlay } from "./components/BannerOverlay";
import { TopLeftBadge } from "./components/TopLeftBadge";
import React from "react";

export const Heumanville: React.FC = () => {
  const { fps } = useVideoConfig();
  const totalFrames = 374 * fps; // 6m 14s

  const logoPath = staticFile("heumanville/logo_new.png");

  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile("heumanville/source.mp4")} endAt={totalFrames} />
      
      {/* 상시 노출: 좌상단 뱃지 */}
      <Sequence from={0} durationInFrames={totalFrames}>
        <TopLeftBadge text1="천안성성지구" text2="1,541세대 대단지" />
      </Sequence>

      {/* 00:10 ~ 06:14 CTA (상시 노출) */}
      <Sequence from={10 * fps} durationInFrames={totalFrames - 10 * fps}>
        <CtaOverlay phone="010-8282-8684" label="견본주택 관람 문의" />
      </Sequence>

      {/* 프로모션 후킹 (첫 번째 및 500만원 언급 구간) */}
      <Sequence from={2 * fps} durationInFrames={5 * fps}>
         <BannerOverlay text="★ 입주까지 계약금 500만원 100명 선착순 ★" />
      </Sequence>

      {/* 00:00 ~ 01:19 Hook */}
      <Sequence from={20 * fps} durationInFrames={6 * fps}>
        <YouTubeEmphasisSubtitle text="계약금 딱 500만원!!" subText="성성지구 옆 대단지를 내 집으로" theme="yellow" />
      </Sequence>
      
      <Sequence from={30 * fps} durationInFrames={4 * fps}>
        <SlidingInfoPanel 
          pointNumber={1} mainTitle="4억 7천부터!" 
          description={"성성지구 대비 최대 1억 이상 저렴한\n갓성비 분양가"} direction="right"
          logoPath={logoPath}
        />
      </Sequence>

      {/* 01:19 ~ 02:50 Point 1: 40평대 뺨치는 평면 & 무상 옵션 */}
      <Sequence from={89 * fps} durationInFrames={4 * fps}>
        <YouTubeEmphasisSubtitle text="방이 무려 4개?!" subText="알파룸 특화 84D 타입" theme="red" />
      </Sequence>
      <Sequence from={134 * fps} durationInFrames={4 * fps}>
        <SpaceEntrySubtitle title="주방 특화 설계" subtitle="사각 싱크볼 & 스톤 베이지 기본 무상!" />
      </Sequence>

      {/* 02:50 ~ 04:40 Point 2: 발코니 로망 실현 & 광폭 거실 */}
      <Sequence from={180 * fps} durationInFrames={4 * fps}>
        <SpaceEntrySubtitle title="압도적 안방 발코니" subtitle="서재, 홈카페, 힐링쉼터 완벽 구현" />
      </Sequence>
      <Sequence from={280 * fps} durationInFrames={5 * fps}>
        <SlidingInfoPanel 
          pointNumber={2} mainTitle="광폭 거실" 
          description={"인근 40평 아파트 수준의\n개방감을 자랑합니다."} direction="left"
          logoPath={logoPath}
        />
      </Sequence>

      {/* 04:40 ~ 06:14 Outro: 투자가치 & 방문 유도 */}
      <Sequence from={300 * fps} durationInFrames={4 * fps}>
        <YouTubeEmphasisSubtitle text="29년 5월 입주!" subText="성성지구 완성 시점의 최대 수혜 단지" theme="yellow" />
      </Sequence>
      <Sequence from={360 * fps} durationInFrames={14 * fps}>
        <BannerOverlay text="잔여 세대 빠르게 소진 중! 84㎡ 골든타임 놓치지 마세요" />
      </Sequence>
    </AbsoluteFill>
  );
};
