import "./index.css";
import { Composition } from "remotion";
import "./global.css";

// ── 유튜브 장편 / Shorts ─────────────────────
import { YouTubeLongform } from "./compositions/longform/YouTubeLongform";
import { YouTubeShorts } from "./compositions/shorts/YouTubeShorts";

// ── 부동산 현장 영상 (기존) ───────────────────
import { HilstateVideo } from "./compositions/HilstateVideo";
import { PropertyVideo } from "./compositions/PropertyVideo";
import { Heumanville } from "./Heumanville";

// ── 오버레이 템플릿 (구 re-overlay) ──────────
import { HumanvilleOverlay } from "./compositions/overlay/HumanvilleOverlay";
import { HumanvilleChromakey } from "./compositions/overlay/HumanvilleChromakey";
import { humanvilleData } from "./compositions/overlay/data/humanville";

// ── 부동산 현장 영상 (구 remotion-real-estate) ─
import { AreaExplainer } from "./compositions/real-estate/AreaExplainer";
import { AreaExplainerFace } from "./compositions/real-estate/AreaExplainerFace";
import { CheongakGajum } from "./compositions/real-estate/CheongakGajum";
import { HumanvilFirstCity } from "./compositions/real-estate/HumanvilFirstCity";
import { TangjeongVideo } from "./compositions/real-estate/TangjeongVideo";
import { RealEstateTemplate } from "./compositions/real-estate/compositions/RealEstateTemplate";
import { PropertyInfoImageVersion } from "./compositions/real-estate/templates/PropertyInfoImageVersion";
import { PropertyInfoOverlayVersion } from "./compositions/real-estate/templates/PropertyInfoOverlayVersion";
import sampleConfig from "./compositions/real-estate/content/001_sample_project/config.json";
import raonConfig from "./compositions/real-estate/content/002_raon_private/config.json";

const FPS = 30;
const OVERLAY_FPS = 30;
const TANGJEONG_DURATION_SECONDS = 544;
const HUMANVIL_DURATION = 379;

// 실제 사용 시 staticFile("이미지경로")로 교체할 placeholder
const SAMPLE_PROPERTY_INFO = {
  title: "탕정 동일하이빌 파크레인",
  brandName: "더원 삼성 빌딩",
  items: [
    { label: "대지위치", value: "충남 아산시 탕정면 갈산리 850, 851" },
    { label: "건물용도", value: "근린생활시설" },
    { label: "대지면적", value: "1,131.00㎡" },
    { label: "건폐/용적률", value: "69.18% / 294.44%" },
  ],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ───────── 기존 유튜브 장편/Shorts ───────── */}
      <Composition
        id="YouTubeLongform"
        component={YouTubeLongform}
        durationInFrames={30 * 60 * 10}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="YouTubeShorts"
        component={YouTubeShorts}
        durationInFrames={30 * 60}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ───────── 기존 부동산 컴포지션 ───────── */}
      <Composition
        id="PropertyVideo"
        component={PropertyVideo}
        durationInFrames={30 * 60 * 15}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="HeumanvilleFirstCity"
        component={Heumanville}
        durationInFrames={374 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* 힐스테이트 모종 블랑루체 — 시퀀스 13 (약 10분 58초) */}
      <Composition
        id="HilstateBlancLuche"
        component={HilstateVideo}
        durationInFrames={19742}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ───────── 오버레이 (HumanvilleOverlay 사이드패널 / 포인트자막) ───────── */}
      {humanvilleData.사이드패널.map((panel) => (
        <Composition
          key={`panel-${panel.id}`}
          id={`Panel-${panel.id}`}
          component={HumanvilleOverlay}
          durationInFrames={panel.dur * OVERLAY_FPS}
          fps={OVERLAY_FPS}
          width={1920}
          height={1080}
          defaultProps={{ clipMode: "panel", clipId: panel.id } as any}
        />
      ))}
      {humanvilleData.포인트자막.map((sub, i) => (
        <Composition
          key={`sub-${i}`}
          id={`Sub-${i}`}
          component={HumanvilleOverlay}
          durationInFrames={sub.dur * OVERLAY_FPS}
          fps={OVERLAY_FPS}
          width={1920}
          height={1080}
          defaultProps={{ clipMode: "subtitle", clipIndex: i } as any}
        />
      ))}
      <Composition
        id="HumanvilleOverlay"
        component={HumanvilleOverlay}
        durationInFrames={820 * OVERLAY_FPS}
        fps={OVERLAY_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="HumanvilleChromakey"
        component={HumanvilleChromakey}
        durationInFrames={820 * OVERLAY_FPS}
        fps={OVERLAY_FPS}
        width={1920}
        height={1080}
      />

      {/* ───────── 부동산 현장 (구 remotion-real-estate) ───────── */}
      {/* 풀링 시리즈 #1 — "84㎡인데 왜 좁아 보이나요?" */}
      <Composition
        id="AreaExplainer-Auto"
        component={AreaExplainer}
        durationInFrames={432 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ audioSrc: "audio/area-explainer.mp3" }}
      />
      <Composition
        id="AreaExplainer-Face"
        component={AreaExplainerFace as any}
        durationInFrames={432 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          faceSrc: "footage/area-face.mp4",
          audioSrc: "audio/area-explainer.mp3",
        }}
      />
      {/* 청약 가점 계산 완벽 가이드 */}
      <Composition
        id="CheongakGajum"
        component={CheongakGajum}
        durationInFrames={232 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TangjeongVideo"
        component={TangjeongVideo}
        durationInFrames={TANGJEONG_DURATION_SECONDS * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
      {/* 천안 휴먼빌 퍼스트시티 (remotion-real-estate 버전) */}
      <Composition
        id="HumanvilFirstCity"
        component={HumanvilFirstCity}
        durationInFrames={HUMANVIL_DURATION * FPS}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ subtitleCues: [] }}
      />

      {/* 템플릿 미리보기 */}
      <Composition
        id="Template-PropertyInfo-A"
        component={PropertyInfoImageVersion as any}
        durationInFrames={FPS * 10}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ imageSrc: "", ...SAMPLE_PROPERTY_INFO }}
      />
      <Composition
        id="Template-PropertyInfo-B"
        component={PropertyInfoOverlayVersion as any}
        durationInFrames={FPS * 10}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          title: SAMPLE_PROPERTY_INFO.title,
          overlayOpacity: 0.8,
          items: [
            { label: "대지위치", value: "충남 아산시 탕정면" },
            { label: "규모", value: "지하 2층 ~ 지상 29층" },
            { label: "세대수", value: "총 1,011세대" },
          ],
        }}
      />

      {/* 데이터 기반 템플릿 */}
      <Composition
        id="RealEstate-SampleProject"
        component={RealEstateTemplate as any}
        durationInFrames={
          (sampleConfig as any).scenes.reduce(
            (acc: number, scene: any) => acc + scene.durationInFrames,
            0,
          ) || ((sampleConfig as any).meta.fps || 30) * 10
        }
        fps={(sampleConfig as any).meta.fps || 30}
        width={(sampleConfig as any).meta.width || 1080}
        height={(sampleConfig as any).meta.height || 1920}
        defaultProps={sampleConfig as any}
      />
      <Composition
        id="RealEstate-RaonPrivate"
        component={RealEstateTemplate as any}
        durationInFrames={
          (raonConfig as any).scenes.reduce(
            (acc: number, scene: any) => acc + scene.durationInFrames,
            0,
          ) || ((raonConfig as any).meta.fps || 30) * 10
        }
        fps={(raonConfig as any).meta.fps || 30}
        width={(raonConfig as any).meta.width || 1080}
        height={(raonConfig as any).meta.height || 1920}
        defaultProps={raonConfig as any}
      />
    </>
  );
};
