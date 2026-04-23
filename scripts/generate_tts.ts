/**
 * TTS 생성 스크립트
 * config.json의 script 필드를 읽어 OpenAI TTS로 음성 파일 생성
 *
 * Usage:
 *   npx tsx scripts/generate_tts.ts content/004_humanvil_firstcity
 *
 * 환경변수:
 *   OPENAI_API_KEY — .env 파일 또는 환경변수로 설정
 */
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const contentDir = process.argv[2];
if (!contentDir) {
  console.error("Usage: npx tsx scripts/generate_tts.ts <content-dir>");
  process.exit(1);
}

const configPath = path.resolve(contentDir, "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const audioDir = path.resolve(contentDir, "audio");
fs.mkdirSync(audioDir, { recursive: true });

const client = new OpenAI();

const voice = config.audio?.tts?.voice ?? "onyx";
const model = config.audio?.tts?.model ?? "tts-1-hd";
const speed = config.audio?.tts?.speed ?? 1.0;

async function generateTTS() {
  for (const scene of config.scenes) {
    if (!scene.script) continue;

    const outFile = path.join(audioDir, `${scene.id}.mp3`);

    if (fs.existsSync(outFile)) {
      console.log(`⏭  ${scene.id} — already exists, skipping`);
      continue;
    }

    console.log(`🎙  Generating TTS for ${scene.id}...`);

    const response = await client.audio.speech.create({
      model,
      voice: voice as any,
      input: scene.script,
      speed,
      response_format: "mp3",
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outFile, buffer);
    console.log(`✅  ${scene.id} → ${outFile} (${buffer.length} bytes)`);
  }

  console.log("\n🎉 TTS generation complete!");
}

generateTTS().catch((err) => {
  console.error("TTS generation failed:", err);
  process.exit(1);
});
