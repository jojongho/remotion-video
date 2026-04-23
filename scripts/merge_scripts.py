import re
import difflib

def normalize(t):
    return re.sub(r'\s+', '', t)

def tc_to_sec(tc):
    parts = list(map(int, tc.split(':')))
    if len(parts) == 2:
        return parts[0] * 60 + parts[1]
    elif len(parts) == 3:
        return parts[0] * 3600 + parts[1] * 60 + parts[2]
    return 0

def main():
    base_dir = "content/002_raon_private"
    target_path = f"{base_dir}/스크립트 좀 더 정확한 버전.md"
    whisper_path = f"{base_dir}/script_timecodes.md"
    output_path = f"{base_dir}/script_final_merged.md"
    
    with open(target_path, 'r', encoding='utf-8') as f:
        target_lines = f.readlines()
        
    with open(whisper_path, 'r', encoding='utf-8') as f:
        whisper_lines = f.readlines()
        
    whisper_data = []
    for line in whisper_lines:
        line = line.strip()
        m = re.match(r'^\*\*\[(.*?)\] (.*?):\*\*\s+(.*)$', line)
        if m:
            whisper_data.append({
                'tc': m.group(1),
                'sec': tc_to_sec(m.group(1)),
                'speaker': m.group(2),
                'text': m.group(3),
                'norm': normalize(m.group(3))
            })
            
    mapped_lines = []
    mapped_lines.append("# 아산 배방 라온프라이빗 스크립트 (정확한 문장 + 정확한 타임코드)\n")
    
    last_w_idx = 0
    
    for line in target_lines:
        line = line.strip()
        m_target = re.match(r'^\*\*\(\s*(\d\d:\d\d)\s*\)\*\*\s+(.*)$', line)
        if m_target:
            t_tc = m_target.group(1)
            t_sec = tc_to_sec(t_tc)
            t_text = m_target.group(2)
            t_norm = normalize(t_text)
            
            best_w = None
            best_score = -1
            
            for i in range(max(0, last_w_idx - 5), len(whisper_data)):
                w = whisper_data[i]
                if w['sec'] > t_sec + 60:
                    break
                    
                score = difflib.SequenceMatcher(None, t_norm[:20], w['norm'][:20]).ratio()
                
                if w['norm'][:10] in t_norm[:20] and len(w['norm']) >= 3:
                    score += 0.5
                    
                if score > best_score:
                    best_score = score
                    best_w = i
                    
            if best_score > 0.3 and best_w is not None:
                c = whisper_data[best_w]
                last_w_idx = best_w + 1
                # Use the speaker from the matched whisper chunk
                mapped_lines.append(f"**[{c['tc']}] {c['speaker']}:** {t_text}")
            else:
                fallback_c = whisper_data[last_w_idx] if last_w_idx < len(whisper_data) else whisper_data[-1]
                # Default to Interviewer if it's a question, else Director
                speaker = "🎤 진행자" if "?" in t_text else "👔 조종호 소장"
                mapped_lines.append(f"**[{fallback_c['tc']}] {speaker}**: {t_text}")
        else:
             if "타임코드 매핑" in line or "안내 사항" in line or "양해의 말씀" in line or "===" in line or line.startswith("---") or line.startswith("#"):
                continue
             if line:
                 mapped_lines.append(line)
                 
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n\n".join(mapped_lines))
        
    print(f"Merge complete! Saved to {output_path}")

if __name__ == "__main__":
    main()
