<template>
  <div class="then-page">
    <div class="page-header">
      <h1 class="section-title">Then vs Now</h1>
      <p class="section-subtitle">How sun-safety attitudes changed from the 1990s to 2026 — and why it matters.</p>
    </div>

    <!-- Comparison Slider -->
    <div class="comparison-card card">
      <div class="scene-container"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        @touchstart.prevent="startDrag"
        @touchmove.prevent="onDrag"
        @touchend="stopDrag">

        <!-- 1990s scene (left, always visible) -->
        <div class="scene-side scene-then">
          <div class="scene-bg scene-then-bg"></div>
          <div class="scene-content">
            <div class="era-label era-then">📺 1990s Australia</div>
            <div class="scene-figure">
              <div class="figure-body then-body">
                <div class="figure-head then-head">😎</div>
                <div class="figure-torso then-torso"></div>
              </div>
              <div class="figure-caption then-caption">Tan = healthy<br><small>No worries, no SPF</small></div>
            </div>
            <div class="old-items">
              <span class="item-bubble">📺</span>
              <span class="item-bubble">🏖</span>
            </div>
          </div>
          <div class="scene-stats">
            <div class="stat-bubble">
              <strong>87%</strong>
              <small>Teens used sunscreen regularly</small>
            </div>
            <div class="stat-bubble">
              <strong>HIGH</strong>
              <small>SunSmart campaign compliance</small>
            </div>
            <div class="stat-bubble">
              <strong>↓ Low</strong>
              <small>Melanoma rate growth (90s)</small>
            </div>
          </div>
          <div class="scene-quote">"No worries, I never burn."</div>
        </div>

        <!-- 2026 scene (right, revealed by slider) -->
        <div class="scene-side scene-now" :style="{ clipPath: `inset(0 0 0 ${sliderPos}%)` }">
          <div class="scene-bg scene-now-bg"></div>
          <div class="scene-content">
            <div class="era-label era-now">📱 2026 Gen Z</div>
            <div class="scene-figure">
              <div class="figure-body now-body">
                <div class="figure-head now-head">🤳</div>
                <div class="figure-torso now-torso"></div>
              </div>
              <div class="figure-caption now-caption">Tan aesthetic<br><small>TikTok made me do it</small></div>
            </div>
            <div class="new-items">
              <span class="item-bubble">📱</span>
              <span class="item-bubble">☀️</span>
            </div>
          </div>
          <div class="scene-stats">
            <div class="stat-bubble danger">
              <strong>41%</strong>
              <small>Gen Z regularly use SPF</small>
            </div>
            <div class="stat-bubble danger">
              <strong>↑ 2×</strong>
              <small>Melanoma rate vs 1990s</small>
            </div>
            <div class="stat-bubble danger">
              <strong>74%</strong>
              <small>Have UV misconceptions</small>
            </div>
          </div>
          <div class="scene-quote now-quote">"A tan makes my skin look so much better."</div>
        </div>

        <!-- Slider handle -->
        <div class="slider-handle" :style="{ left: sliderPos + '%' }">
          <div class="handle-line"></div>
          <div class="handle-btn">◀ ▶</div>
        </div>
      </div>
    </div>

    <!-- Story Cards -->
    <div class="story-grid">
      <div v-for="card in storyCards" :key="card.id" class="story-card card"
        :class="card.era === '1990s' ? 'card-then' : 'card-now'">
        <div class="story-card-header">
          <span class="era-badge" :class="card.era === '1990s' ? 'badge-then' : 'badge-now'">{{ card.era }}</span>
          <span class="story-icon">{{ card.icon }}</span>
        </div>
        <h3 class="story-title">{{ card.title }}</h3>
        <p class="story-desc">{{ card.desc }}</p>
        <div v-if="card.expanded" class="story-impact">
          <p>{{ card.impact }}</p>
        </div>
        <button class="story-toggle" @click="card.expanded = !card.expanded">
          {{ card.expanded ? '▲ Less' : '▼ See impact' }}
        </button>
      </div>
    </div>

    <!-- Bottom CTA -->
    <div class="cta-banner card">
      <div class="cta-stat">
        <span class="cta-number uv-very-high">2×</span>
        <span class="cta-label">higher melanoma rates since the 90s</span>
      </div>
      <div class="cta-stat">
        <span class="cta-number uv-extreme">UV 14</span>
        <span class="cta-label">peak Melbourne summer UV (up from UV 10)</span>
      </div>
      <router-link to="/learn" class="btn btn-primary">Learn the science →</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const sliderPos = ref(50)
let dragging = false

function startDrag(e) {
  dragging = true
  updateSlider(e)
}
function onDrag(e) {
  if (!dragging) return
  updateSlider(e)
}
function stopDrag() { dragging = false }

function updateSlider(e) {
  const container = e.currentTarget
  const rect = container.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const pct = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 2), 98)
  sliderPos.value = pct
}

const storyCards = reactive([
  {
    id: 1, era: '1990s', icon: '📺',
    title: 'Slip Slop Slap dominated culture',
    desc: 'The 90s SunSmart campaign made sun safety a national identity. 87% of teens used sunscreen regularly.',
    impact: 'Melanoma rates were stabilising. The campaign is credited with saving thousands of lives.',
    expanded: false
  },
  {
    id: 2, era: '2026', icon: '📱',
    title: '"Tanning aesthetic" went viral',
    desc: 'TikTok and Instagram normalised sun-baked looks. "Glass skin tan" trends encouraged intentional burning.',
    impact: 'Each sunburn before 18 doubles lifetime melanoma risk. Gen Z are on track for record diagnoses by 2040.',
    expanded: false
  },
  {
    id: 3, era: '1990s', icon: '🧴',
    title: 'SPF was mainstream',
    desc: 'Chemist warehouses ran out of SPF 15+ every summer. Sunscreen was a cultural norm, not optional.',
    impact: 'Australia led the world in sun-safety compliance throughout the 90s and early 2000s.',
    expanded: false
  },
  {
    id: 4, era: '2026', icon: '🌡',
    title: 'UV levels hit record highs',
    desc: 'Ozone thinning means Melbourne\'s peak UV has climbed from UV 10 to UV 14+ on summer days.',
    impact: 'The same beach session that was "safe" in 1995 now burns unprotected fair skin in under 8 minutes.',
    expanded: false
  },
  {
    id: 5, era: '1990s', icon: '👨‍👩‍👧',
    title: 'Parents enforced sun safety',
    desc: 'Hat rules at school, sunscreen before leaving the house — sun protection was enforced by adults.',
    impact: 'Children who grew up with sun-safe habits carried them into adulthood, reducing cumulative UV damage.',
    expanded: false
  },
  {
    id: 6, era: '2026', icon: '😟',
    title: 'Young adults abandoning protection',
    desc: 'Only 41% of Gen Z regularly use SPF. 74% hold at least one dangerous misconception about UV.',
    impact: 'This generational gap in sun-safety attitudes will drive a melanoma epidemic within 15–20 years.',
    expanded: false
  },
])
</script>

<style scoped>
.then-page { display: flex; flex-direction: column; gap: 2rem; }
.page-header { text-align: center; padding: 1rem 0; }

/* Comparison slider */
.comparison-card { padding: 0; overflow: hidden; }
.scene-container {
  position: relative;
  height: 420px;
  cursor: col-resize;
  user-select: none;
  overflow: hidden;
  border-radius: var(--radius);
}

.scene-side {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
}

.scene-then { z-index: 1; }
.scene-now  { z-index: 2; }

.scene-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.scene-then-bg {
  background: linear-gradient(160deg, #87ceeb 0%, #98d8c8 40%, #f4d03f 70%, #e8c49a 100%);
}
.scene-now-bg {
  background: linear-gradient(160deg, #2c3e50 0%, #c0853a 40%, #e8956d 70%, #f39c12 100%);
}

.scene-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.era-label {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  backdrop-filter: blur(8px);
  width: fit-content;
}
.era-then { background: rgba(255,255,255,0.7); color: #1a365d; }
.era-now  { background: rgba(0,0,0,0.5); color: #fbbf24; }

.scene-figure { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.figure-body { display: flex; flex-direction: column; align-items: center; }
.figure-head { font-size: 1.8rem; }
.then-torso { width: 28px; height: 44px; background: #c9a96e; border-radius: 6px; }
.now-torso  { width: 28px; height: 44px; background: #8B4513; border-radius: 6px; }
.figure-caption { font-size: 0.68rem; text-align: center; line-height: 1.4; }
.then-caption { color: #1a365d; font-weight: 600; }
.now-caption  { color: #fff; font-weight: 600; text-shadow: 0 1px 4px rgba(0,0,0,0.5); }

.old-items, .new-items { display: flex; flex-direction: column; gap: 6px; margin-left: auto; }
.item-bubble { font-size: 1.5rem; background: rgba(255,255,255,0.3); backdrop-filter: blur(4px); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }

.scene-stats {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.stat-bubble {
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 80px;
}
.stat-bubble.danger { background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.4); color: #fff; }
.stat-bubble strong { font-family: var(--font-display); font-size: 1rem; font-weight: 800; color: #1a1a2e; }
.stat-bubble.danger strong { color: #fca5a5; }
.stat-bubble small { font-size: 0.6rem; color: #444; line-height: 1.3; }
.stat-bubble.danger small { color: #fecaca; }

.scene-quote {
  position: relative;
  z-index: 1;
  font-style: italic;
  font-size: 0.8rem;
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(8px);
  padding: 6px 12px;
  border-radius: 8px;
  color: #1a1a2e;
  width: fit-content;
}
.now-quote { background: rgba(0,0,0,0.5); color: #fef3c7; }

/* Slider handle */
.slider-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 10;
  transform: translateX(-50%);
  pointer-events: none;
}
.handle-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: #fff;
  box-shadow: 0 0 8px rgba(0,0,0,0.5);
}
.handle-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  color: #333;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.7rem;
  font-weight: 700;
  box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  white-space: nowrap;
  pointer-events: none;
}

/* Story grid */
.story-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
.story-card { display: flex; flex-direction: column; gap: 0.75rem; }
.card-then { border-left: 3px solid #60a5fa; }
.card-now  { border-left: 3px solid #f97316; }

.story-card-header { display: flex; justify-content: space-between; align-items: center; }
.era-badge { padding: 3px 10px; border-radius: 999px; font-size: 0.65rem; font-weight: 700; }
.badge-then { background: rgba(96,165,250,0.15); color: #60a5fa; border: 1px solid rgba(96,165,250,0.3); }
.badge-now  { background: rgba(249,115,22,0.15); color: #f97316; border: 1px solid rgba(249,115,22,0.3); }
.story-icon { font-size: 1.5rem; }

.story-title { font-family: var(--font-display); font-size: 1rem; font-weight: 700; }
.story-desc  { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; }
.story-impact { background: var(--surface-2); border-radius: 8px; padding: 10px 12px; font-size: 0.82rem; line-height: 1.6; color: var(--text); border-left: 2px solid var(--accent); }
.story-toggle { background: none; border: none; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; padding: 0; text-align: left; }
.story-toggle:hover { color: var(--accent); }

/* CTA */
.cta-banner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem; background: var(--surface-2); }
.cta-stat { display: flex; flex-direction: column; gap: 4px; }
.cta-number { font-family: var(--font-display); font-size: 2rem; font-weight: 800; }
.cta-label { font-size: 0.8rem; color: var(--text-muted); max-width: 200px; line-height: 1.4; }
</style>
