import "./index.css";
import { Composition } from "remotion";
import "./global.css";

import { YouTubeLongform } from "./compositions/longform/YouTubeLongform";
import { YouTubeShorts } from "./compositions/shorts/YouTubeShorts";
import { PropertyVideo } from "./compositions/PropertyVideo";

// Each <Composition> is an entry in the sidebar!
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PropertyVideo"
        component={PropertyVideo}
        durationInFrames={30 * 60 * 15} // 15 minutes max
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="YouTubeLongform"
        component={YouTubeLongform}
        durationInFrames={30 * 60 * 10} // 10 minutes default
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="YouTubeShorts"
        component={YouTubeShorts}
        durationInFrames={30 * 60} // 60 seconds default
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
