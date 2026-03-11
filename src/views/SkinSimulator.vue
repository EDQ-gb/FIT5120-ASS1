<template>
  <div class="sim-wrap card">
    <div class="sim-header">
      <h3 class="sim-title">🔬 Skin Burn Simulator</h3>
      <p class="sim-sub">What happens to unprotected skin at UV {{ uvIndex ?? '—' }}</p>
    </div>

    <div class="sim-body">
      <!-- SVG person -->
      <div class="sim-figure-wrap">
        <svg class="sim-figure" viewBox="0 0 120 280" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="30" rx="22" ry="26" :fill="skinColor" :stroke="burnStroke" stroke-width="1.5"
            class="body-part" :style="{ filter: burnFilter }" />
          <rect x="52" y="54" width="16" height="14" rx="4" :fill="skinColor" :stroke="burnStroke" stroke-width="1"
            class="body-part" />
          <rect x="32" y="66" width="56" height="80" rx="10" :fill="skinColor" :stroke="burnStroke" stroke-width="1.5"
            class="body-part" :style="{ filter: burnFilter }" />
          <rect x="14" y="68" width="20" height="68" rx="10" :fill="skinColor" :stroke="burnStroke" stroke-width="1"
            class="body-part" :style="{ filter: armFilter }" />
          <rect x="86" y="68" width="20" height="68" rx="10" :fill="skinColor" :stroke="burnStroke" stroke-width="1"
            class="body-part" :style="{ filter: armFilter }" />
          <rect x="34" y="144" width="24" height="90" rx="10" :fill="skinColor" :stroke="burnStroke" stroke-width="1"
            class="body-part" :style="{ filter: burnFilter }" />
          <rect x="62" y="144" width="24" height="90" rx="10" :fill="skinColor" :stroke="burnStroke" stroke-width="1"
            class="body-part" :style="{ filter: burnFilter }" />
          <circle cx="52" cy="27" r="3" fill="rgba(0,0,0,0.25)" />
          <circle cx="68" cy="27" r="3" fill="rgba(0,0,0,0.25)" />
          <path d="M 52 38 Q 60 44 68 38" stroke="rgba(0,0,0,0.25)" stroke-width="1.5" fill="none" stroke-linecap="round" />

          <ellipse v-if="uvIndex >= 6" cx="60" cy="30" rx="22" ry="26" :fill="burnOverlayColor"
            :opacity="burnOverlayOpacity" class="burn-overlay" />
          <rect v-if="uvIndex >= 6" x="32" y="66" width="56" height="80" rx="10" :fill="burnOverlayColor"
            :opacity="burnOverlayOpacity" class="burn-overlay" />
          <rect v-if="uvIndex >= 8" x="34" y="144" width="24" height="90" rx="10" :fill="burnOverlayColor"
            :opacity="burnOverlayOpacity * 0.7" class="burn-overlay" />
          <rect v-if="uvIndex >= 8" x="62" y="144" width="24" height="90" rx="10" :fill="burnOverlayColor"
            :opacity="burnOverlayOpacity * 0.7" class="burn-overlay" />

          <g v-if="uvIndex >= 9" class="sun-rays">
            <line x1="60" y1="-10" x2="60" y2="5" stroke="#f59e0b" stroke-width="2" opacity="0.6" />
            <line x1="95" y1="5" x2="83" y2="14" stroke="#f59e0b" stroke-width="2" opacity="0.6" />
            <line x1="25" y1="5" x2="37" y2="14" stroke="#f59e0b" stroke-width="2" opacity="0.6" />
          </g>
        </svg>

        <div class="time-badges">
          <div class="time-badge" v-for="skin in displaySkins" :key="skin.type" :style="{ borderColor: timeColor }">
            <span class="tb-emoji">{{ skin.emoji }}</span>
            <span class="tb-time" :style="{ color: timeColor }">{{ calcBurn(skin.factor) }}</span>
            <span class="tb-label">{{ skin.type }}</span>
          </div>
        </div>
      </div>

      <!-- Burn timeline -->
      <div class="burn-timeline">
        <p class="timeline-heading">⏱ Minute-by-minute exposure</p>
        <div class="timeline-steps">
          <div v-for="step in burnSteps" :key="step.min" class="timeline-step"
            :class="{ active: step.min <= elapsedMin }" @click="elapsedMin = step.min">
            <div class="step-dot" :style="{ background: step.color }"></div>
            <div class="step-info">
              <span class="step-min">{{ step.min }} min</span>
              <span class="step-desc">{{ step.desc }}</span>
            </div>
          </div>
        </div>

        <div class="exposure-slider">
          <label>Simulate exposure time</label>
          <input type="range" min="0" :max="maxSlider" v-model.number="elapsedMin" class="slider"
            style="appearance: auto" />
          <div class="slider-labels">
            <span>0</span>
            <span>{{ Math.round(maxSlider / 2) }} min</span>
            <span>{{ maxSlider }} min</span>
          </div>
        </div>

        <div class="burn-status"
          :style="{ background: currentStep?.color + '22', borderColor: currentStep?.color + '66' }">
          <span class="status-icon">{{ currentStep?.icon }}</span>
          <span class="status-msg">{{ currentStep?.msg }}</span>
        </div>
      </div>
    </div>

    <!-- SPF toggle -->
    <div class="spf-row">
      <button class="spf-btn" :class="{ active: spfOn }" @click="spfOn = !spfOn">
        {{ spfOn ? '🧴 SPF 50+ ON — Protection active' : '🚫 No sunscreen — Tap to apply SPF 50+' }}
      </button>
      <p class="spf-note" v-if="spfOn">With SPF 50+, burn times multiply by ~50×. Your skin is protected! 🌟</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  uvIndex: { type: Number, default: null }
})

const elapsedMin = ref(0)
const spfOn = ref(false)

const uv = computed(() => props.uvIndex ?? 0)

const skinColor = computed(() => {
  if (!props.uvIndex) return '#e8c4a0'
  const intensity = Math.min(uv.value / 12, 1)
  const elapsed = elapsedMin.value / maxSlider.value
  const burnLevel = Math.min(intensity * elapsed * 2, 1)
  if (spfOn.value) return '#e8c4a0'
  if (burnLevel > 0.7) return '#c0392b'
  if (burnLevel > 0.4) return '#e74c3c'
  if (burnLevel > 0.2) return '#e8956d'
  return '#e8c4a0'
})

const burnStroke = computed(() => spfOn.value ? '#c9a07a' : '#b5651d')
const burnOverlayColor = computed(() => '#ef4444')
const burnOverlayOpacity = computed(() => {
  if (spfOn.value) return 0
  const base = Math.min((uv.value - 5) / 6, 1) * 0.35
  const elapsed = elapsedMin.value / maxSlider.value
  return base * elapsed
})

const burnFilter = computed(() => {
  if (spfOn.value || !props.uvIndex) return 'none'
  const intensity = Math.min(uv.value / 12, 1)
  const elapsed = elapsedMin.value / maxSlider.value
  const sat = 1 + intensity * elapsed * 1.5
  const bright = 1 - elapsed * intensity * 0.2
  return `saturate(${sat}) brightness(${bright})`
})
const armFilter = computed(() => burnFilter.value)

const timeColor = computed(() => {
  if (spfOn.value) return '#22c55e'
  if (uv.value >= 11) return '#9333ea'
  if (uv.value >= 8) return '#ef4444'
  if (uv.value >= 6) return '#f97316'
  if (uv.value >= 3) return '#eab308'
  return '#22c55e'
})

const maxSlider = computed(() => {
  if (!props.uvIndex || uv.value === 0) return 120
  return Math.max(Math.round(300 / uv.value), 10)
})

const displaySkins = [
  { type: 'Very Fair', emoji: '👱', factor: 1.5 },
  { type: 'Medium', emoji: '🧑🏽', factor: 3 },
  { type: 'Dark', emoji: '🧑🏿', factor: 8 },
]

function calcBurn(factor) {
  if (!props.uvIndex || uv.value === 0) return '∞'
  if (spfOn.value) return '50×+'
  const mins = Math.round((factor * 10) / uv.value * 6)
  if (mins >= 60) return `${Math.round(mins / 60)}h`
  return `${mins}m`
}

const burnSteps = computed(() => {
  const u = uv.value
  if (!u) return []
  const fairBurn = Math.round((1.5 * 10) / u * 6)
  return [
    { min: 0, color: '#22c55e', icon: '😊', desc: 'Skin looks fine', msg: 'No UV exposure yet. Your skin is healthy and unaffected.' },
    { min: Math.round(fairBurn * 0.3), color: '#eab308', icon: '🌤', desc: 'UV hitting skin', msg: 'UV radiation is penetrating the epidermis. DNA repair mechanisms activating.' },
    { min: Math.round(fairBurn * 0.6), color: '#f97316', icon: '😬', desc: 'Skin reddening', msg: 'Erythema begins — blood vessels dilating. Very fair skin already burning.' },
    { min: fairBurn, color: '#ef4444', icon: '🔥', desc: 'Sunburn for fair skin', msg: `At UV ${u}, fair skin has now burned. Pain and inflammation incoming.` },
    { min: Math.round(fairBurn * 2), color: '#9333ea', icon: '☠️', desc: 'Severe damage', msg: 'Significant DNA damage accumulated. Risk of blistering and long-term damage.' },
  ].filter(s => s.min <= maxSlider.value)
})

const currentStep = computed(() => {
  const steps = [...burnSteps.value].reverse()
  return steps.find(s => elapsedMin.value >= s.min) ?? burnSteps.value[0]
})
</script>

<style scoped>
.sim-wrap { padding: 1.5rem; }
.sim-header { margin-bottom: 1.5rem; }
.sim-title { font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; margin-bottom: 4px; }
.sim-sub { color: var(--text-muted); font-size: 0.85rem; }

.sim-body {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  align-items: start;
}

.sim-figure-wrap { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.sim-figure { width: 120px; height: 280px; filter: drop-shadow(0 4px 16px rgba(0,0,0,0.4)); }
.body-part { transition: fill 0.6s ease, filter 0.6s ease; }
.burn-overlay { transition: opacity 0.6s ease; pointer-events: none; }
.sun-rays line { animation: rayPulse 1.5s ease-in-out infinite alternate; }
@keyframes rayPulse { from { opacity: 0.3; } to { opacity: 0.8; } }

.time-badges { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.time-badge { display: flex; align-items: center; gap: 6px; background: var(--surface-2); border: 1px solid; border-radius: 8px; padding: 6px 10px; transition: border-color 0.5s; }
.tb-emoji { font-size: 1.1rem; }
.tb-time { font-family: var(--font-display); font-weight: 800; font-size: 1rem; transition: color 0.5s; }
.tb-label { font-size: 0.7rem; color: var(--text-muted); margin-left: auto; }

.burn-timeline { display: flex; flex-direction: column; gap: 1rem; }
.timeline-heading { font-weight: 600; font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.timeline-steps { display: flex; flex-direction: column; gap: 6px; }
.timeline-step { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; cursor: pointer; border: 1px solid transparent; transition: all 0.2s; opacity: 0.4; }
.timeline-step.active { opacity: 1; background: var(--surface-2); border-color: var(--border); }
.step-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.step-info { display: flex; flex-direction: column; gap: 1px; }
.step-min { font-weight: 700; font-size: 0.8rem; }
.step-desc { font-size: 0.72rem; color: var(--text-muted); }

.exposure-slider { display: flex; flex-direction: column; gap: 6px; }
.exposure-slider label { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
.slider { width: 100%; height: 6px; border-radius: 999px; cursor: pointer; }
.slider-labels { display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted); }

.burn-status { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 10px; border: 1px solid; transition: all 0.4s; }
.status-icon { font-size: 1.4rem; flex-shrink: 0; }
.status-msg { font-size: 0.82rem; line-height: 1.5; color: var(--text); }

.spf-row { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 8px; }
.spf-btn { padding: 12px 20px; border-radius: 12px; border: 2px solid var(--border); background: var(--surface-2); color: var(--text-muted); font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.3s; text-align: left; }
.spf-btn.active { border-color: #22c55e; color: #22c55e; background: rgba(34,197,94,0.08); }
.spf-note { font-size: 0.8rem; color: #22c55e; padding-left: 4px; }

@media (max-width: 600px) {
  .sim-body { grid-template-columns: 1fr; }
  .sim-figure-wrap { flex-direction: row; align-items: flex-start; }
}
</style>
