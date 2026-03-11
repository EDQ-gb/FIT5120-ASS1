<template>
  <div class="action-page">
    <h1 class="section-title">Today's Protection Plan</h1>
    <p class="section-subtitle">Based on UV {{ uvLevel }} — personalised for you right now</p>

    <!-- Skin Type Selector -->
    <div class="card skin-selector">
      <h3>Your Skin Type</h3>
      <div class="skin-options">
        <button
          v-for="s in skinTypes"
          :key="s.id"
          class="skin-btn"
          :class="{ active: selectedSkin === s.id }"
          @click="selectedSkin = s.id"
        >
          <span class="skin-emoji">{{ s.emoji }}</span>
          <span>{{ s.label }}</span>
        </button>
      </div>
    </div>

    <!-- Sunscreen Recommendation -->
    <div class="card rec-card sunscreen-card">
      <div class="rec-header">
        <span class="rec-icon">🧴</span>
        <h2>Sunscreen</h2>
        <span class="rec-badge" :class="spfBadgeClass">{{ sunscreenRec.spf }}</span>
      </div>
      <p class="rec-desc">{{ sunscreenRec.desc }}</p>
      <div class="dosage-display">
        <span class="dosage-label">Face & Neck</span>
        <span class="dosage-value">{{ sunscreenRec.faceTeaspoons }} tsp</span>
        <span class="dosage-label">Full Body</span>
        <span class="dosage-value">{{ sunscreenRec.bodyTeaspoons }} tsp (≈ {{ sunscreenRec.bodyPumps }} pumps)</span>
        <span class="dosage-label">Reapply Every</span>
        <span class="dosage-value">{{ sunscreenRec.reapplyMins }} minutes</span>
      </div>
      <button class="btn btn-primary" @click="completeTask('sunscreen')" :disabled="done.sunscreen">
        {{ done.sunscreen ? '✅ Done! +10 coins' : '✔ Mark as Applied' }}
      </button>
    </div>

    <!-- Clothing Recommendation -->
    <div class="card rec-card clothing-card">
      <div class="rec-header">
        <span class="rec-icon">👕</span>
        <h2>What to Wear</h2>
      </div>
      <div class="clothing-grid">
        <div
          v-for="item in clothingRec"
          :key="item.type"
          class="clothing-item"
          :class="{ recommended: item.recommended }"
        >
          <span class="clothing-emoji">{{ item.emoji }}</span>
          <span class="clothing-type">{{ item.type }}</span>
          <span class="clothing-detail">{{ item.detail }}</span>
          <span v-if="item.recommended" class="clothing-tag">Recommended</span>
        </div>
      </div>
      <button class="btn btn-primary" @click="completeTask('clothing')" :disabled="done.clothing" style="margin-top:1rem">
        {{ done.clothing ? '✅ Done! +10 coins' : '✔ I\'m Dressed for Sun' }}
      </button>
    </div>

    <!-- UV Timing Guide -->
    <div class="card timing-card">
      <div class="rec-header">
        <span class="rec-icon">🕐</span>
        <h2>Safe Time Windows</h2>
      </div>
      <div class="timing-blocks">
        <div
          v-for="block in timeBlocks"
          :key="block.time"
          class="timing-block"
          :class="block.safe ? 'safe' : 'danger'"
        >
          <span class="timing-time">{{ block.time }}</span>
          <span class="timing-status">{{ block.safe ? '✅ Safe' : '⚠️ Risky' }}</span>
          <span class="timing-note">{{ block.note }}</span>
        </div>
      </div>
    </div>

    <!-- Coin reward toast -->
    <transition name="toast">
      <div v-if="toastMsg" class="toast">🪙 {{ toastMsg }}</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, inject, reactive } from 'vue'

const uvLevel  = inject('uvLevel')
const addCoins = inject('addCoins')

const done     = reactive({ sunscreen: false, clothing: false })
const toastMsg = ref('')

function completeTask(type) {
  if (done[type]) return
  done[type] = true
  addCoins(10)
  showToast('+10 coins earned! Keep it up 🌟')
}

function showToast(msg) {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 2500)
}

// Skin types
const skinTypes = [
  { id: 1, emoji: '👱', label: 'Very Fair' },
  { id: 2, emoji: '🧑', label: 'Fair' },
  { id: 3, emoji: '🧑🏽', label: 'Medium' },
  { id: 4, emoji: '🧑🏾', label: 'Olive' },
  { id: 5, emoji: '🧑🏿', label: 'Dark' },
]
const selectedSkin = ref(2)

// Sunscreen recs based on UV
const sunscreenRec = computed(() => {
  const uv = uvLevel.value
  if (uv >= 8) return {
    spf: 'SPF 50+', desc: 'Broad spectrum SPF 50+ is essential. Apply 20 mins before going out.',
    faceTeaspoons: 0.5, bodyTeaspoons: 3, bodyPumps: 6, reapplyMins: 90,
  }
  if (uv >= 6) return {
    spf: 'SPF 50', desc: 'Apply SPF 50 generously. Don\'t forget ears, back of neck and lips.',
    faceTeaspoons: 0.5, bodyTeaspoons: 2.5, bodyPumps: 5, reapplyMins: 120,
  }
  if (uv >= 3) return {
    spf: 'SPF 30+', desc: 'SPF 30+ sufficient for moderate UV. Reapply after swimming or sweating.',
    faceTeaspoons: 0.5, bodyTeaspoons: 2, bodyPumps: 4, reapplyMins: 150,
  }
  return {
    spf: 'SPF 15+', desc: 'Low UV today. A daily SPF moisturiser is enough for most activities.',
    faceTeaspoons: 0.25, bodyTeaspoons: 1.5, bodyPumps: 3, reapplyMins: 180,
  }
})

const spfBadgeClass = computed(() => {
  const uv = uvLevel.value
  if (uv >= 8) return 'badge-extreme'
  if (uv >= 6) return 'badge-high'
  if (uv >= 3) return 'badge-moderate'
  return 'badge-low'
})

// Clothing recs
const clothingRec = computed(() => {
  const uv = uvLevel.value
  return [
    {
      emoji: '🧢', type: 'Hat',
      recommended: uv >= 3,
      detail: uv >= 6 ? 'Wide brim (8cm+) covering face & neck' : 'Cap or wide-brim hat',
    },
    {
      emoji: '🕶', type: 'Sunglasses',
      recommended: uv >= 3,
      detail: uv >= 8 ? 'Wrap-around, UV400 rated' : 'UV-blocking lenses',
    },
    {
      emoji: '👕', type: 'Top',
      recommended: uv >= 6,
      detail: uv >= 8 ? 'UPF 50+ long sleeve (dark or tightly woven)' : 'Light long sleeve or UPF top',
    },
    {
      emoji: '🩱', type: 'Coverage',
      recommended: uv >= 8,
      detail: uv >= 11 ? 'Full cover recommended — avoid exposed skin' : 'Cover shoulders and back',
    },
    {
      emoji: '🌂', type: 'Shade',
      recommended: uv >= 8,
      detail: uv >= 11 ? 'Seek shade at all times outdoors' : 'Use umbrella or seek shade during 10am–3pm',
    },
  ]
})

// Time blocks
const timeBlocks = computed(() => [
  { time: '6–9am',  safe: true,  note: 'UV typically low — ideal morning walk time' },
  { time: '9–11am', safe: uvLevel.value < 6, note: uvLevel.value < 6 ? 'Moderate UV, sunscreen recommended' : 'UV rising — limit exposure' },
  { time: '11am–3pm', safe: false, note: 'Peak UV hours — seek shade, SPF 50+ mandatory' },
  { time: '3–5pm',  safe: uvLevel.value < 8, note: uvLevel.value < 8 ? 'UV decreasing — outdoor activity ok' : 'Still high UV — protect up' },
  { time: '5pm+',   safe: true,  note: 'UV generally low after 5pm in VIC' },
])
</script>

<style scoped>
.action-page { display: flex; flex-direction: column; gap: 1.5rem; }

/* Skin selector */
.skin-selector h3 { font-family: var(--font-display); font-weight: 700; margin-bottom: 1rem; }
.skin-options { display: flex; gap: 8px; flex-wrap: wrap; }
.skin-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--border);
  background: var(--surface-2);
  color: var(--text-muted);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}
.skin-btn .skin-emoji { font-size: 1.5rem; }
.skin-btn:hover, .skin-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(249,115,22,0.08);
}

/* Rec cards */
.rec-card { display: flex; flex-direction: column; gap: 1rem; }
.rec-header { display: flex; align-items: center; gap: 12px; }
.rec-icon { font-size: 1.8rem; }
.rec-header h2 { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; }
.rec-badge {
  margin-left: auto;
  padding: 4px 14px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.8rem;
}
.badge-extreme { background: #9333ea22; color: #a855f7; border: 1px solid #9333ea55; }
.badge-high    { background: #f9731622; color: #f97316; border: 1px solid #f9731655; }
.badge-moderate{ background: #eab30822; color: #eab308; border: 1px solid #eab30855; }
.badge-low     { background: #22c55e22; color: #22c55e; border: 1px solid #22c55e55; }

.rec-desc { color: var(--text-muted); line-height: 1.6; }

.dosage-display {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
  background: var(--surface-2);
  border-radius: var(--radius-sm);
  padding: 1rem;
}
.dosage-label { font-size: 0.75rem; color: var(--text-muted); }
.dosage-value { font-weight: 600; font-size: 0.95rem; }

/* Clothing grid */
.clothing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
}
.clothing-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 1rem;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--border);
  background: var(--surface-2);
  text-align: center;
  transition: all 0.2s;
  opacity: 0.5;
}
.clothing-item.recommended { opacity: 1; border-color: var(--accent); }
.clothing-emoji  { font-size: 2rem; }
.clothing-type   { font-weight: 600; font-size: 0.85rem; }
.clothing-detail { font-size: 0.7rem; color: var(--text-muted); line-height: 1.4; }
.clothing-tag    { font-size: 0.65rem; background: var(--accent); color: #fff; padding: 2px 8px; border-radius: 999px; font-weight: 700; }

/* Timing */
.timing-blocks { display: flex; flex-direction: column; gap: 8px; }
.timing-block {
  display: grid;
  grid-template-columns: 100px 80px 1fr;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}
.timing-block.safe   { background: rgba(34,197,94,0.06); border-color: rgba(34,197,94,0.2); }
.timing-block.danger { background: rgba(249,115,22,0.06); border-color: rgba(249,115,22,0.2); }
.timing-time   { font-weight: 700; font-size: 0.85rem; }
.timing-status { font-size: 0.8rem; }
.timing-note   { font-size: 0.8rem; color: var(--text-muted); }

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--surface-2);
  border: 1px solid var(--coin-gold);
  color: var(--coin-gold);
  padding: 10px 24px;
  border-radius: 999px;
  font-weight: 600;
  z-index: 999;
  pointer-events: none;
}
.toast-enter-active, .toast-leave-active { transition: all 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }
</style>
