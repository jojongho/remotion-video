import os
import sys
import json
import whisper
import argparse

def main():
    parser = argparse.ArgumentParser(description="Extract Audio to Remotion Scene Config (JSON) using Whisper")
    parser.add_argument("audio_path", help="Path to the audio file (e.g. mp3, wav)")
    parser.add_argument("--fps", type=int, default=30, help="Frames per second for Remotion (default: 30)")
    parser.add_argument("--model", type=str, default="small", help="Whisper model size (default: small)")
    args = parser.parse_args()

    audio_path = args.audio_path
    if not os.path.exists(audio_path):
        print(f"Error: Audio file not found at {audio_path}")
        sys.exit(1)

    print(f"Loading Whisper model '{args.model}'...")
    try:
        # Set download root to local project directory to avoid permission issues
        download_root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "whisper_models")
        os.makedirs(download_root, exist_ok=True)
        model = whisper.load_model(args.model, download_root=download_root)
    except Exception as e:
         print(f"Failed to load Whisper model: {e}")
         print("Make sure ffmpeg is installed system-wide (`brew install ffmpeg`).")
         sys.exit(1)

    print(f"Transcribing audio: {audio_path}")
    # Using FP16=False for compatibility on Macs without dedicated Nvidia GPUs
    result = model.transcribe(audio_path, fp16=False, language="ko")

    scenes = []
    fps = args.fps

    print("\nTranscription complete. Processing segments...")
    for idx, segment in enumerate(result.get("segments", [])):
        start_time = segment["start"]
        end_time = segment["end"]
        text = segment["text"].strip()
        
        # Calculate duration in seconds and frames
        duration_sec = end_time - start_time
        duration_frames = int(round(duration_sec * fps))

        # Ensure at least 1 frame to avoid Remotion crashes
        duration_frames = max(1, duration_frames)

        scene = {
            "id": f"scene_{idx + 1:03d}",
            "durationInFrames": duration_frames,
            "type": "info",
            "text": {
                "main": text
            }
        }
        scenes.append(scene)

    output_data = {
        "meta": {
             "title": "Generated from Audio",
             "fps": fps,
             "width": 1080,
             "height": 1920
        },
        "theme": {
            "primaryColor": "#0055FF",
            "secondaryColor": "#FFFFFF",
            "backgroundColor": "#111111",
            "fontFamily": "system-ui, sans-serif"
        },
        "scenes": scenes
    }

    output_file = "scenes_config.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"\nSuccessfully created {output_file} with {len(scenes)} scenes.")
    print("Example scene output:")
    if scenes:
         print(json.dumps(scenes[0], ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
