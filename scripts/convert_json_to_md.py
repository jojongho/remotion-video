import json
import os

def frames_to_tc(frames, fps=30):
    total_seconds = int(frames / fps)
    h = total_seconds // 3600
    m = (total_seconds % 3600) // 60
    s = total_seconds % 60
    return f"[{h:02d}:{m:02d}:{s:02d}]"

def guess_speaker(text, prev_speaker):
    # Heuristic rules to guess the speaker (Interviewer vs. Real Estate Director)
    interviewer_cues = [
        "소장님", "얼마에요", "살 수 있는 거", "어떻게 될까요", "아쉽네요", "뷰 네요", 
        "소개 한번", "몇 동이죠", "평형인 건가요", "나쁘지 않아 보여요", "넓어 보여요", 
        "못했습니다", "그렇죠 강아유", "드레스룸 만 해요", "그러네요", "펜틀이다", 
        "큰 틀이라고", "자녀들 방", "제가 여자잖아요", "조막도", "뻥듭니다", 
        "배광산인가요", "그렇죠?"
    ]
    
    for cue in interviewer_cues:
        if cue in text and "저는" not in text and "대표" not in text:
            return "🎤 진행자"
            
    if text.endswith("?"):
        return "🎤 진행자"
        
    # Short agreements
    short_agreements = ["그렇죠", "맞아요", "그러네요", "네", "아니요 아쉽습니다"]
    if prev_speaker == "👔 조종호 소장" and text in short_agreements:
        return "🎤 진행자"
        
    # Default is the Director
    return "👔 조종호 소장"

def main():
    json_path = "content/002_raon_private/config.json"
    output_path = "content/002_raon_private/script_timecodes.md"
    
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    fps = data.get("meta", {}).get("fps", 30)
    scenes = data.get("scenes", [])

    md_lines = ["# 아산 배방 라온프라이빗 스크립트 (화자 분리 적용)\n"]
    md_lines.append("> 💡 **참고:** 현재 세팅하신 로컬 Whisper 단일 모델은 목소리를 구별하는 별도의 AI 분리(Diarization) 기능이 포함되어 있지 않습니다. 따라서 이 마크다운은 '물음표(?)'와 '소장님' 같은 대화 패턴을 파이썬 스크립트가 분석하여 **가상으로 화자를 매핑**한 결과입니다.\n")
    
    current_frames = 0
    prev_speaker = "🎤 진행자"

    for scene in scenes:
        tc = frames_to_tc(current_frames, fps)
        text = scene.get("text", {}).get("main", "")
        if text:
            speaker = guess_speaker(text, prev_speaker)
            # 빈 줄을 넣어 화자교체 시 가독성 높임
            if speaker != prev_speaker:
                md_lines.append("")
                
            md_lines.append(f"**{tc} {speaker}:** {text}")
            prev_speaker = speaker
            
        current_frames += scene.get("durationInFrames", 0)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(md_lines))
        
    print(f"Extraction complete! Saved to {output_path}")

if __name__ == "__main__":
    main()
