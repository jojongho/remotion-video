import json
import re

def tc_to_frames(tc_str, fps=30):
    parts = list(map(int, tc_str.split(':')))
    if len(parts) == 2:
        total_seconds = parts[0] * 60 + parts[1]
    elif len(parts) == 3:
        total_seconds = parts[0] * 3600 + parts[1] * 60 + parts[2]
    else:
        total_seconds = 0
    return total_seconds * fps

def main():
    md_path = "content/002_raon_private/script_final_merged.md"
    json_path = "content/002_raon_private/config.json"
    
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    scenes = []
    fps = 30
    
    parsed_items = []
    
    for line in lines:
        line = line.strip()
        # **[00:00:00] 🎤 진행자:** 소장님 혹시...
        m = re.match(r'^\*\*\[(.*?)\] (.*?):\*\*\s+(.*)$', line)
        if m:
            tc = m.group(1)
            speaker = m.group(2).strip()
            text = m.group(3).strip()
            
            frame_start = tc_to_frames(tc, fps)
            parsed_items.append({
                "start": frame_start,
                "speaker": speaker,
                "text": text
            })
            
    # Calculate durations based on the next item's start time
    # For the last item, give it a default 5 second duration
    for i in range(len(parsed_items)):
        current = parsed_items[i]
        
        if i < len(parsed_items) - 1:
            next_item = parsed_items[i+1]
            duration = next_item["start"] - current["start"]
        else:
            duration = 5 * fps # 5 seconds
            
        # Ensure minimum duration to prevent 0-frame scenes due to same-second rounding
        if duration <= 0:
            duration = int(0.5 * fps)
            
        # Style 1: Interviewer (🎤)
        # Style 2: Director (👔)
        is_interviewer = "🎤" in current["speaker"]
        
        scene = {
            "id": f"scene_{i+1:03d}",
            "durationInFrames": duration,
            "type": "info",
            "media": {
                "type": "transparent" 
            },
            "text": {
                "main": current["text"],
                "style": "highlight" if not is_interviewer else "default",
                "segments": [
                     { "text": current["text"], "color": "#00FF00" if is_interviewer else "#FFFFFF" }
                ]
            }
        }
        scenes.append(scene)
        
    config = {
      "meta": {
        "title": "Raon Private Captions Overlay",
        "fps": 30,
        "width": 1080,
        "height": 1920
      },
      "theme": {
        "primaryColor": "#0055FF",
        "secondaryColor": "#FFFFFF",
        "backgroundColor": "transparent",
        "fontFamily": "system-ui, sans-serif"
      },
      "scenes": scenes
    }
    
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
        
    print(f"Generated {len(scenes)} transparent scenes to {json_path}")

if __name__ == "__main__":
    main()
