#!/bin/bash
# 휴먼빌 오버레이 개별 클립 일괄 렌더링 (크로마키 MP4)
# 원본: 구 re-overlay/render-all.sh
OUT="/Users/mumu/Movies/천안 휴먼빌 퍼스트시티/오버레이/clips"
mkdir -p "$OUT"

echo "🎬 개별 클립 렌더링 시작"

# 사이드 패널 6개
for id in title overview price 84d balcony cta; do
  echo "📦 Panel-${id}..."
  npx remotion render "Panel-${id}" "${OUT}/panel-${id}.mp4" \
    --codec=h264 --image-format=jpeg 2>&1 | tail -1
done

# 포인트 자막 15개
for i in $(seq 0 14); do
  echo "📝 Sub-${i}..."
  npx remotion render "Sub-${i}" "${OUT}/sub-${i}.mp4" \
    --codec=h264 --image-format=jpeg 2>&1 | tail -1
done

echo ""
echo "✅ 렌더링 완료!"
ls -lh "$OUT/"
