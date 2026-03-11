<template>
  <div class="uv-page">

    <!-- Location + Time Bar -->
    <div class="location-bar card">
      <div class="location-info">
        <span class="loc-icon">📍</span>
        <div class="loc-details">
          <span class="loc-name">{{ locationName }}</span>
          <span class="loc-coords" v-if="coords">{{ coords.lat.toFixed(4) }}°, {{ coords.lon.toFixed(4) }}°</span>
        </div>
      </div>
      <div class="live-clock">
        <span class="clock-time">{{ currentTime }}</span>
        <span class="clock-date">{{ currentDate }}</span>
      </div>
    </div>

    <!-- Google Maps Satellite -->
    <div class="map-container card" v-if="coords">
      <div class="map-header">
        <span class="map-label">📡 Satellite View</span>
        <span class="map-uv-pill" :class="uvClass">UV {{ uvIndex }} · {{ uvLevelText }}</span>
      </div>
      <div class="map-wrap">
        <iframe :src="mapSrc" class="map-iframe" allowfullscreen loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
        <div class="map-uv-overlay" :class="uvClass">
          <span class="overlay-number">{{ uvIndex }}</span>
          <span class="overlay-label">UV NOW</span>
        </div>
      </div>
    </div>

    <!-- Placeholder before location detected -->
    <div class="map-placeholder card" v-else>
      <div class="placeholder-inner">
        <span class="placeholder-icon">🛰</span>
        <p>Detect your location to load satellite view</p>
      </div>
    </div>

    <!-- Hero UV Display -->
    <div class="uv-hero card" :style="heroStyle">
      <div class="uv-hero-inner">
        <p class="uv-label">UV Index · {{ locationName }}</p>
        <div class="uv-number" :class="uvClass">{{ uvIndex ?? '—' }}</div>
        <div class="uv-level-badge" :class="uvClass">{{ uvLevelText }}</div>
        <p class="uv-human-msg">{{ humanMessage }}</p>
      </div>

      <!-- UV Gauge bar -->
      <div class="uv-gauge">
        <div class="uv-gauge-fill" :style="{ width: gaugePercent + '%', background: gaugeColor }"></div>
        <div class="uv-gauge-labels">
          <span>0</span><span>3</span><span>6</span><span>8</span><span>11+</span>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="uv-actions">
        <button class="btn btn-primary" @click="getLocation" :disabled="loading">
          {{ loading ? '📡 Detecting...' : '📍 Use My Location' }}
        </button>
        <button class="btn btn-ghost" @click="useManualDemo">
          🏙 Try Melbourne Demo
        </button>
      </div>

      <p v-if="error" class="uv-error">{{ error }}</p>
    </div>

    <!-- Hourly Forecast Strip -->
    <div v-if="hourlyData.length" class="forecast-strip">
      <h3 class="forecast-title">Today's UV Forecast</h3>
      <div class="forecast-row">
        <div v-for="h in hourlyData" :key="h.hour" class="forecast-item" :class="getUvClass(h.uv)">
          <span class="forecast-hour">{{ h.hour }}</span>
          <span class="forecast-bar-wrap">
            <span class="forecast-bar"
              :style="{ height: (h.uv / 12 * 60) + 'px', background: getUvColor(h.uv) }"></span>
          </span>
          <span class="forecast-uv">{{ h.uv }}</span>
        </div>
      </div>
    </div>

    <!-- Skin Burn Time (quick summary) -->
    <div v-if="uvIndex !== null" class="burn-card card">
      <h3>⏱ Skin Burn Time (Unprotected)</h3>
      <div class="burn-grid">
        <div v-for="skin in skinTypes" :key="skin.type" class="burn-item">
          <span class="burn-emoji">{{ skin.emoji }}</span>
          <span class="burn-type">{{ skin.type }}</span>
          <span class="burn-time" :class="uvClass">{{ calcBurnTime(skin.factor) }}</span>
        </div>
      </div>
    </div>

    <!-- Skin Burn Simulator -->
    <SkinSimulator v-if="uvIndex !== null" :uv-index="uvIndex" />

  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'
import SkinSimulator from './SkinSimulator.vue'

const setUvLevel = inject('setUvLevel')
const addCoins = inject('addCoins')

// ---- State ----
const uvIndex = ref(null)
const locationName = ref('Your Location')
const loading = ref(false)
const error = ref('')
const hourlyData = ref([])
const coords = ref(null)

// ---- Live Clock ----
const currentTime = ref('')
const currentDate = ref('')
let clockTimer = null

function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-AU', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  })
  currentDate.value = now.toLocaleDateString('en-AU', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  })
}

onMounted(() => { updateClock(); clockTimer = setInterval(updateClock, 1000) })
onUnmounted(() => clearInterval(clockTimer))

// ---- API Keys ----
const MAPS_KEY = 'AIzaSyCndMNBZC8NQWOw2h5HSRPNjawqDm5CoaM'
const OWM_KEY = 'e325740a50315633953fb71413f31c6f'

const mapSrc = computed(() => {
  if (!coords.value) return ''
  const { lat, lon } = coords.value
  return `https://www.google.com/maps/embed/v1/view?key=${MAPS_KEY}&center=${lat},${lon}&zoom=14&maptype=satellite`
})

// ---- UV Level Logic ----
const uvClass = computed(() => {
  const v = uvIndex.value
  if (v === null) return ''
  if (v >= 11) return 'uv-extreme'
  if (v >= 8) return 'uv-very-high'
  if (v >= 6) return 'uv-high'
  if (v >= 3) return 'uv-moderate'
  return 'uv-low'
})

const uvLevelText = computed(() => {
  const v = uvIndex.value
  if (v === null) return ''
  if (v >= 11) return 'EXTREME ☠️'
  if (v >= 8) return 'VERY HIGH 🔥'
  if (v >= 6) return 'HIGH ⚠️'
  if (v >= 3) return 'MODERATE 😎'
  return 'LOW ✅'
})

const humanMessage = computed(() => {
  const v = uvIndex.value
  if (v === null) return 'Tap "Use My Location" to get live UV data for your area.'
  if (v >= 11) return `UV ${v} — Skin damage begins in under 10 mins. Stay indoors or use full cover + SPF 50+.`
  if (v >= 8) return `UV ${v} — Unprotected skin burns in ~${calcBurnTime(3)}. Apply SPF 50+ before going out.`
  if (v >= 6) return `UV ${v} — Burns possible in ~${calcBurnTime(3)}. Sunscreen + hat recommended.`
  if (v >= 3) return `UV ${v} — Moderate risk. SPF 30+ if outdoors for extended time.`
  return `UV ${v} — Low risk today. Still a good habit to moisturise with SPF!`
})

const gaugePercent = computed(() => Math.min(((uvIndex.value ?? 0) / 12) * 100, 100))
const gaugeColor = computed(() => getUvColor(uvIndex.value ?? 0))
const heroStyle = computed(() => ({
  borderColor: gaugeColor.value + '44',
  boxShadow: `0 0 40px ${gaugeColor.value}22`
}))

// ---- Helpers ----
function getUvColor(v) {
  if (v >= 11) return '#9333ea'
  if (v >= 8) return '#ef4444'
  if (v >= 6) return '#f97316'
  if (v >= 3) return '#eab308'
  return '#22c55e'
}
function getUvClass(v) {
  if (v >= 11) return 'uv-extreme'
  if (v >= 8) return 'uv-very-high'
  if (v >= 6) return 'uv-high'
  if (v >= 3) return 'uv-moderate'
  return 'uv-low'
}

// ---- Skin burn time ----
const skinTypes = [
  { type: 'Very Fair', emoji: '👱', factor: 1.5 },
  { type: 'Fair', emoji: '🧑', factor: 2 },
  { type: 'Medium', emoji: '🧑🏽', factor: 3 },
  { type: 'Olive', emoji: '🧑🏾', factor: 5 },
  { type: 'Dark', emoji: '🧑🏿', factor: 8 },
]
function calcBurnTime(factor) {
  if (!uvIndex.value || uvIndex.value === 0) return '∞'
  const mins = Math.round((factor * 10) / uvIndex.value * 6)
  if (mins >= 60) return `${Math.round(mins / 60)}h`
  return `${mins}min`
}

// ---- Geolocation + API ----
async function getLocation() {
  loading.value = true
  error.value = ''
  if (!navigator.geolocation) {
    error.value = 'Geolocation not supported by your browser.'
    loading.value = false
    return
  }
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      coords.value = { lat: pos.coords.latitude, lon: pos.coords.longitude }
      await fetchUV(pos.coords.latitude, pos.coords.longitude)
      loading.value = false
      addCoins(5)
    },
    () => {
      error.value = 'Could not get location. Try the demo button instead.'
      loading.value = false
    }
  )
}

async function fetchUV(lat, lon) {
  try {
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OWM_KEY}`
    )
    const geoData = await geoRes.json()
    locationName.value = geoData[0]?.name ?? 'Your Location'

    const uvRes = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${OWM_KEY}`
    )
    const uvData = await uvRes.json()
    uvIndex.value = Math.round(uvData.value)
    setUvLevel(uvIndex.value)

    const fcRes = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily,alerts&appid=${OWM_KEY}`
    )
    const fcData = await fcRes.json()
    hourlyData.value = (fcData.hourly ?? []).slice(0, 12).map(h => ({
      hour: new Date(h.dt * 1000).getHours() + ':00',
      uv: Math.round(h.uvi ?? 0)
    }))
  } catch (e) {
    error.value = 'API error — showing Melbourne demo data.'
    useManualDemo()
  }
}

function useManualDemo() {
  locationName.value = 'Melbourne, VIC'
  coords.value = { lat: -37.8136, lon: 144.9631 }
  uvIndex.value = 9
  setUvLevel(9)
  hourlyData.value = [
    { hour: '6:00', uv: 0 }, { hour: '7:00', uv: 1 }, { hour: '8:00', uv: 3 },
    { hour: '9:00', uv: 5 }, { hour: '10:00', uv: 7 }, { hour: '11:00', uv: 9 },
    { hour: '12:00', uv: 11 }, { hour: '13:00', uv: 10 }, { hour: '14:00', uv: 9 },
    { hour: '15:00', uv: 7 }, { hour: '16:00', uv: 4 }, { hour: '17:00', uv: 2 },
  ]
  addCoins(5)
}
</script>

<style scoped>
.uv-page { display: flex; flex-direction: column; gap: 1.5rem; }

/* Location bar */
.location-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.location-info { display: flex; align-items: center; gap: 10px; }
.loc-icon { font-size: 1.2rem; }
.loc-details { display: flex; flex-direction: column; gap: 2px; }
.loc-name { font-weight: 600; font-size: 0.95rem; }
.loc-coords { font-size: 0.72rem; color: var(--text-muted); font-family: monospace; }
.live-clock { text-align: right; }
.clock-time { display: block; font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; }
.clock-date { display: block; font-size: 0.72rem; color: var(--text-muted); }

/* Map */
.map-container { padding: 0; overflow: hidden; }
.map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
}
.map-label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); }
.map-uv-pill {
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1.5px solid currentColor;
}
.map-wrap { position: relative; height: 320px; }
.map-iframe { width: 100%; height: 100%; border: none; display: block; }
.map-uv-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(10,10,15,0.85);
  backdrop-filter: blur(8px);
  border: 2px solid currentColor;
  border-radius: 12px;
  padding: 8px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}
.overlay-number { font-family: var(--font-display); font-size: 2rem; font-weight: 800; line-height: 1; }
.overlay-label { font-size: 0.6rem; letter-spacing: 0.12em; opacity: 0.7; }

/* Map placeholder */
.map-placeholder { min-height: 160px; display: flex; align-items: center; justify-content: center; }
.placeholder-inner { text-align: center; color: var(--text-muted); }
.placeholder-icon { font-size: 2.5rem; display: block; margin-bottom: 8px; }

/* Hero */
.uv-hero { text-align: center; padding: 3rem 2rem; border-width: 1px; border-style: solid; transition: all 0.5s; }
.uv-hero-inner { margin-bottom: 2rem; }
.uv-label { font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem; }
.uv-number { font-family: var(--font-display); font-size: clamp(5rem, 15vw, 9rem); font-weight: 800; line-height: 1; margin-bottom: 0.5rem; transition: color 0.5s; }
.uv-level-badge { display: inline-block; padding: 4px 20px; border-radius: 999px; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.08em; border: 1.5px solid currentColor; margin-bottom: 1.5rem; }
.uv-human-msg { max-width: 520px; margin: 0 auto; font-size: 1.05rem; line-height: 1.6; color: var(--text-muted); }

/* Gauge */
.uv-gauge { max-width: 480px; margin: 0 auto 2rem; }
.uv-gauge-fill { height: 8px; border-radius: 999px; transition: width 0.8s cubic-bezier(0.34,1.56,0.64,1), background 0.5s; margin-bottom: 6px; }
.uv-gauge-labels { display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted); }

/* Actions */
.uv-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.uv-error { color: #ef4444; margin-top: 1rem; font-size: 0.85rem; }

/* Forecast */
.forecast-title { font-family: var(--font-display); font-weight: 700; margin-bottom: 1rem; font-size: 1.1rem; }
.forecast-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; }
.forecast-item { flex: 0 0 72px; display: flex; flex-direction: column; align-items: center; gap: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 8px; font-size: 0.8rem; }
.forecast-hour { color: var(--text-muted); }
.forecast-bar-wrap { height: 64px; display: flex; align-items: flex-end; }
.forecast-bar { width: 16px; border-radius: 4px; min-height: 4px; transition: height 0.4s; }
.forecast-uv { font-weight: 700; }

/* Burn card */
.burn-card h3 { font-family: var(--font-display); font-weight: 700; margin-bottom: 1.25rem; }
.burn-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
.burn-item { display: flex; flex-direction: column; align-items: center; gap: 4px; background: var(--surface-2); border-radius: var(--radius-sm); padding: 1rem; }
.burn-emoji { font-size: 1.8rem; }
.burn-type { font-size: 0.75rem; color: var(--text-muted); }
.burn-time { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; }
</style>
