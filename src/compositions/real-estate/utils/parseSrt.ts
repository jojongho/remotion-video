import { SubtitleCue } from "../components/SubtitleOverlay";

function timeToSeconds(time: string): number {
  const [h, m, rest] = time.split(":");
  const [s, ms] = rest.replace(",", ".").split(".");
  return (
    parseInt(h, 10) * 3600 +
    parseInt(m, 10) * 60 +
    parseInt(s, 10) +
    parseInt(ms || "0", 10) / 1000
  );
}

export function parseSrt(srtContent: string, fps: number): SubtitleCue[] {
  const blocks = srtContent.trim().split(/\n\n+/);
  const cues: SubtitleCue[] = [];

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 3) continue;

    const timeMatch = lines[1].match(
      /(\d{2}:\d{2}:\d{2}[,.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{3})/
    );
    if (!timeMatch) continue;

    const startSec = timeToSeconds(timeMatch[1]);
    const endSec = timeToSeconds(timeMatch[2]);
    const text = lines.slice(2).join(" ").trim();

    if (!text) continue;

    cues.push({
      startFrame: Math.round(startSec * fps),
      endFrame: Math.round(endSec * fps),
      text,
    });
  }

  return cues;
}
