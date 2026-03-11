<template>
  <div class="tvn-page">
    <div class="tvn-hero">
      <p class="tvn-eyebrow">The Generational Shift</p>
      <h1 class="tvn-title">Then <span class="vs">vs</span> Now</h1>
      <p class="tvn-desc">How sun-safety attitudes changed from the 1990s to 2026 — and why it matters.</p>
    </div>

    <!-- Comparison Slider -->
    <div class="compare-container card" ref="containerRef">
      <div class="compare-scene">
        <!-- THEN side -->
        <div class="scene-side scene-then">
          <div class="scene-bg then-bg"></div>
          <div class="scene-content">
            <div class="scene-era">📼 1990s Australia</div>
            <div class="beach-scene">
              <div class="sun then-sun">☀️</div>
              <div class="person-wrap">
                <div class="person"><div class="head">🧴</div><div class="body-then"></div></div>
                <div class="person-label">No hat, no SPF<br><em>"Just a tan"</em></div>
              </div>
              <div class="beach-item">📻</div>
            </div>
            <div class="scene-stats">
              <div class="stat-card" v-for="s in thenStats" :key="s.label">
                <span class="stat-num">{{ s.num }}</span>
                <span class="stat-label">{{ s.label }}</span>
              </div>
            </div>
            <div class="scene-quote">"No worries, I never burn."</div>
          </div>
        </div>

        <!-- NOW side -->
        <div class="scene-side scene-now" :style="{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }">
          <div class="scene-bg now-bg"></div>
          <div class="scene-content">
            <div class="scene-era">📱 2026 Gen Z</div>
            <div class="beach-scene">
              <div class="sun now-sun">🌤️</div>
              <div class="person-wrap">
                <div class="person"><div class="head">😎</div><div class="body-now"></div></div>
                <div class="person-label">Tanning oil, no SPF<br><em>"Golden hour aesthetic"</em></div>
              </div>
              <div class="beach-item">📱</div>
            </div>
            <div class="scene-stats">
              <div class="stat-card now-stat" v-for="s in nowStats" :key="s.label">
                <span class="stat-num">{{ s.num }}</span>
                <span class="stat-label">{{ s.label }}</span>
              </div>
            </div>
            <div class="scene-quote">"The sun gives me serotonin ✨"</div>
          </div>
        </div>

        <!-- Drag handle -->
        <div class="drag-handle" :style="{ left: sliderPos + '%' }"
          @mousedown="startDrag" @touchstart.prevent="startDrag">
          <div class="handle-line"></div>
          <div class="handle-pill"><span>◀</span><span>▶</span></div>
          <div class="handle-line"></div>
        </div>
      </div>
    </div>

    <!-- Story cards -->
    <div class="story-grid">
      <div v-for="(card, i) in storyCards" :key="i"
        class="story-card card"
        :class="card.era === 'then' ? 'story-then' : 'story-now'"
        @click="activeCard = activeCard === i ? null : i">
        <div class="sc-header">
          <span class="sc-era-tag" :class="card.era">{{ card.era === 'then' ? '1990s' : '2026' }}</span>
          <span class="sc-icon">{{ card.icon }}</span>
        </div>
        <h4 class="sc-title">{{ card.title }}</h4>
        <p class="sc-body">{{ card.body }}</p>
        <div class="sc-impact" v-if="activeCard === i">
          <div class="impact-label">Real impact</div>
          <p>{{ card.impact }}</p>
        </div>
        <button class="sc-toggle">{{ activeCard === i ? 'Less ↑' : 'See impact ↓' }}</button>
      </div>
    </div>

    <!-- Bottom banner -->
    <div class="stat-banner card">
      <div class="banner-inner">
        <div class="banner-num">2×</div>
        <div class="banner-text">
          <strong>Australia has one of the world's highest skin cancer rates</strong>
          <span>yet Gen Z sun-safety compliance has dropped significantly since the 1990s slip-slop-slap era.</span>
        </div>
        <router-link to="/learn" class="btn btn-primary">Learn Why →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const sliderPos = ref(50)
const containerRef = ref(null)
const activeCard = ref(null)
let isDragging = false

function startDrag() {
  isDragging = true
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag, { passive: false })
  window.addEventListener('touchend', stopDrag)
}
function onDrag(e) {
  if (!isDragging || !containerRef.value) return
  e.preventDefault()
  const rect = containerRef.value.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  sliderPos.value = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 5), 95)
}
function stopDrag() {
  isDragging = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
}
onUnmounted(stopDrag)

const thenStats = [
  { num: '87%', label: 'Teens used sunscreen regularly' },
  { num: 'HIGH', label: 'SunSmart campaign compliance' },
  { num: '↓ Low', label: 'Melanoma rate growth (90s)' },
]
const nowStats = [
  { num: '34%', label: 'Gen Z use sunscreen daily' },
  { num: '42M+', label: '#tan posts on TikTok' },
  { num: '↑ High', label: 'UV damage in under-25s' },
]
const storyCards = [
  { era: 'then', icon: '📺', title: 'Slip Slop Slap dominated culture', body: 'The 1980s–90s campaign made sun safety a cultural norm. Seagull mascot Sid was on TV every summer.', impact: 'Melanoma rates plateaued through the 1990s — the campaign is credited with saving thousands of lives.' },
  { era: 'now', icon: '🤳', title: '"Tanning aesthetic" went viral', body: 'TikTok and Instagram normalised sun-baked skin as beauty standard. Tanning oil sales rose 40% from 2020–2024.', impact: 'Dermatologists report a 28% increase in young patients with UV-related skin damage since 2020.' },
  { era: 'then', icon: '🧴', title: 'SPF was mainstream', body: 'Chemist warehouses ran out of SPF 15+ every summer. School policies required hats outdoors.', impact: "Australia's 2-minute rule (\"no hat, play in the shade\") reduced childhood UV exposure significantly." },
  { era: 'now', icon: '☁️', title: 'Cloud cover = safe? Myth spreading', body: 'Surveys show 61% of Gen Z believe UV is lower on cloudy days — up to 80% of UV penetrates cloud cover.', impact: 'This misconception leads to unprotected outdoor time during high-UV periods year-round.' },
  { era: 'then', icon: '🏫', title: 'School sun safety was compulsory', body: 'Victoria mandated sun protection policies in all schools from 1994. Hat rules were enforced.', impact: 'Cohorts educated under these policies show measurably lower skin cancer rates in their 40s today.' },
  { era: 'now', icon: '💊', title: 'Vitamin D fear replaced sun fear', body: 'Social media wellness culture promoted "safe" tanning for Vitamin D — experts say 15 mins is sufficient.', impact: 'Prolonged UV exposure for Vitamin D provides no extra benefit but multiplies skin cancer risk.' },
]
</script>

<style scoped>
.tvn-page { display: flex; flex-direction: column; gap: 2rem; }

.tvn-hero { text-align: center; padding: 1rem 0 0.5rem; }
.tvn-eyebrow { font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem; }
.tvn-title { font-family: var(--font-display); font-size: clamp(2.5rem, 8vw, 5rem); font-weight: 800; letter-spacing: -0.04em; margin-bottom: 0.75rem; background: linear-gradient(135deg, #f59e0b, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.vs { font-style: italic; opacity: 0.6; }
.tvn-desc { color: var(--text-muted); max-width: 480px; margin: 0 auto; font-size: 1rem; line-height: 1.6; }

.compare-container { padding: 0; overflow: hidden; cursor: col-resize; user-select: none; touch-action: none; }
.compare-scene { position: relative; height: 420px; }
.scene-side { position: absolute; inset: 0; overflow: hidden; }
.scene-bg { position: absolute; inset: 0; }
.then-bg { background: linear-gradient(180deg, #87ceeb 0%, #c8a96e 60%, #b8956a 100%); }
.now-bg { background: linear-gradient(180deg, #fde68a 0%, #fb923c 50%, #e8c4a0 100%); }
.scene-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; padding: 1.25rem; color: rgba(0,0,0,0.85); }
.scene-era { font-family: var(--font-display); font-weight: 800; font-size: 0.95rem; background: rgba(255,255,255,0.35); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 999px; display: inline-block; margin-bottom: auto; }
.beach-scene { position: relative; height: 140px; display: flex; align-items: flex-end; gap: 1.5rem; padding: 0 0.5rem; }
.sun { font-size: 2.5rem; position: absolute; top: 0; right: 16px; animation: sunFloat 4s ease-in-out infinite; }
@keyframes sunFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
.then-sun { filter: drop-shadow(0 0 12px rgba(255,200,0,0.7)); }
.now-sun { filter: drop-shadow(0 0 8px rgba(255,150,0,0.4)); }
.person-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.person { display: flex; flex-direction: column; align-items: center; }
.head { font-size: 1.8rem; }
.body-then { width: 26px; height: 48px; background: #c0392b; border-radius: 6px 6px 0 0; margin-top: -4px; }
.body-now { width: 26px; height: 48px; background: #d4956a; border-radius: 6px 6px 0 0; margin-top: -4px; }
.person-label { font-size: 0.62rem; text-align: center; line-height: 1.3; color: rgba(0,0,0,0.7); max-width: 75px; }
.person-label em { font-style: italic; }
.beach-item { font-size: 1.4rem; margin-bottom: 8px; }
.scene-stats { display: flex; gap: 6px; margin-top: auto; flex-wrap: wrap; }
.stat-card { flex: 1; min-width: 75px; background: rgba(255,255,255,0.4); backdrop-filter: blur(8px); border-radius: 8px; padding: 6px 8px; text-align: center; }
.now-stat { background: rgba(0,0,0,0.25); color: white; }
.stat-num { font-family: var(--font-display); font-weight: 800; font-size: 0.9rem; display: block; }
.stat-label { font-size: 0.6rem; opacity: 0.8; line-height: 1.2; display: block; }
.scene-quote { margin-top: 8px; font-style: italic; font-size: 0.8rem; background: rgba(255,255,255,0.3); backdrop-filter: blur(4px); padding: 5px 10px; border-radius: 8px; display: inline-block; }

.drag-handle { position: absolute; top: 0; bottom: 0; z-index: 10; transform: translateX(-50%); width: 40px; display: flex; flex-direction: column; align-items: center; cursor: col-resize; }
.handle-line { flex: 1; width: 3px; background: white; opacity: 0.9; }
.handle-pill { background: white; color: #333; border-radius: 999px; padding: 6px 10px; font-size: 0.72rem; font-weight: 700; display: flex; gap: 4px; box-shadow: 0 2px 12px rgba(0,0,0,0.3); flex-shrink: 0; }

.story-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 1rem; }
.story-card { cursor: pointer; transition: transform 0.2s; border-left: 3px solid transparent; }
.story-card:hover { transform: translateY(-2px); }
.story-then { border-left-color: #60a5fa; }
.story-now { border-left-color: #f97316; }
.sc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
.sc-era-tag { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; padding: 3px 10px; border-radius: 999px; }
.sc-era-tag.then { background: rgba(96,165,250,0.15); color: #60a5fa; }
.sc-era-tag.now { background: rgba(249,115,22,0.15); color: #f97316; }
.sc-icon { font-size: 1.4rem; }
.sc-title { font-family: var(--font-display); font-weight: 700; font-size: 0.95rem; margin-bottom: 0.5rem; }
.sc-body { font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.75rem; }
.sc-impact { background: var(--surface-2); border-radius: 8px; padding: 10px 12px; margin-bottom: 0.75rem; font-size: 0.8rem; line-height: 1.5; }
.impact-label { font-weight: 700; color: var(--accent); margin-bottom: 4px; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; }
.sc-toggle { background: none; border: none; color: var(--accent); font-size: 0.75rem; font-weight: 600; cursor: pointer; padding: 0; }

.stat-banner { background: linear-gradient(135deg, rgba(249,115,22,0.08), rgba(239,68,68,0.08)); border-color: rgba(249,115,22,0.25); }
.banner-inner { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.banner-num { font-family: var(--font-display); font-size: 3.5rem; font-weight: 800; color: var(--accent); line-height: 1; flex-shrink: 0; }
.banner-text { flex: 1; display: flex; flex-direction: column; gap: 4px; font-size: 0.88rem; }
.banner-text strong { font-size: 0.95rem; }
.banner-text span { color: var(--text-muted); }
</style>
