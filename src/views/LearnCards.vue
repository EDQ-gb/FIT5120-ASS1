<template>
  <div class="learn-page">
    <h1 class="section-title">UV Reality Check</h1>
    <p class="section-subtitle">Tap a card to flip it — myth vs. fact edition 🧠</p>

    <!-- Category Filter -->
    <div class="filter-row">
      <button
        v-for="cat in categories"
        :key="cat"
        class="filter-btn"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Card Grid -->
    <div class="cards-grid">
      <div
        v-for="card in filteredCards"
        :key="card.id"
        class="flip-card"
        :class="{ flipped: flipped[card.id], 'is-myth': card.type === 'myth' }"
        @click="toggleCard(card.id)"
      >
        <div class="flip-inner">
          <!-- Front -->
          <div class="flip-front">
            <span class="card-category">{{ card.category }}</span>
            <span class="card-type-badge" :class="card.type">
              {{ card.type === 'myth' ? '🚫 MYTH' : '💡 FACT' }}
            </span>
            <p class="card-question">{{ card.front }}</p>
            <span class="card-tap-hint">Tap to reveal ↓</span>
          </div>
          <!-- Back -->
          <div class="flip-back">
            <span class="card-type-badge back-badge" :class="card.type">
              {{ card.type === 'myth' ? '✅ TRUTH' : '✅ WHY IT MATTERS' }}
            </span>
            <p class="card-answer">{{ card.back }}</p>
            <div v-if="card.stat" class="card-stat">{{ card.stat }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress indicator -->
    <div class="progress-bar-wrap card">
      <p class="progress-label">Cards explored: {{ flippedCount }} / {{ filteredCards.length }}</p>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <button
        v-if="flippedCount >= filteredCards.length && filteredCards.length > 0"
        class="btn btn-primary"
        @click="claimReward"
        :disabled="rewardClaimed"
      >
        {{ rewardClaimed ? '🎉 +20 coins claimed!' : '🪙 Claim Learning Reward' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, inject } from 'vue'

const addCoins = inject('addCoins')

const flipped       = reactive({})
const rewardClaimed = ref(false)
const activeCategory = ref('All')

function toggleCard(id) {
  flipped[id] = !flipped[id]
}

const flippedCount = computed(() => Object.values(flipped).filter(Boolean).length)
const progressPercent = computed(() =>
  filteredCards.value.length ? (flippedCount.value / filteredCards.value.length) * 100 : 0
)

function claimReward() {
  if (rewardClaimed.value) return
  rewardClaimed.value = true
  addCoins(20)
}

const categories = ['All', 'Myth Busters', 'Skin Science', 'Gen Z Trends', 'Australia Stats']
const filteredCards = computed(() =>
  activeCategory.value === 'All'
    ? cards
    : cards.filter(c => c.category === activeCategory.value)
)

const cards = [
  {
    id: 1, type: 'myth', category: 'Myth Busters',
    front: '"I can\'t get sunburned on a cloudy day."',
    back: 'Up to 80% of UV radiation passes through clouds. Overcast days are still dangerous — the sky is just hiding the evidence.',
    stat: '☁️ 80% UV penetration through clouds',
  },
  {
    id: 2, type: 'myth', category: 'Myth Busters',
    front: '"A base tan protects me from burning."',
    back: 'A "tan" is your skin\'s distress signal — it\'s DNA damage trying to prevent more damage. A base tan offers at most SPF 4 protection.',
    stat: '🔬 Tan = SPF 4 at best (Cancer Council AU)',
  },
  {
    id: 3, type: 'myth', category: 'Gen Z Trends',
    front: '"Glass skin tanning TikTok trend is just aesthetics, no real harm."',
    back: 'Intentional sunburning for a "glass skin" look accelerates DNA mutations. Each sunburn before age 18 doubles melanoma risk later in life.',
    stat: '📱 74% of Gen Z have misconceptions about UV harm',
  },
  {
    id: 4, type: 'fact', category: 'Australia Stats',
    front: 'Australia has the world\'s highest rate of skin cancer.',
    back: '2 in 3 Australians will be diagnosed with skin cancer in their lifetime. This is largely due to proximity to the ozone hole and high outdoor culture.',
    stat: '🇦🇺 2 in 3 Australians will get skin cancer',
  },
  {
    id: 5, type: 'fact', category: 'Skin Science',
    front: 'SPF 30 blocks 97% of UVB rays. SPF 50 blocks 98%.',
    back: 'The jump from SPF 30 to 50 is small but significant for high-UV environments like Australia. Reapplication matters more than SPF number.',
    stat: '🧴 SPF 50+ is recommended by Cancer Council AU for UV 3+',
  },
  {
    id: 6, type: 'myth', category: 'Myth Busters',
    front: '"Dark skin tones don\'t need sunscreen."',
    back: 'Melanin provides some natural protection but NOT enough. Dark skin tones can still develop skin cancer — and are often diagnosed later when harder to treat.',
    stat: '🌍 Melanoma is less common but more deadly in darker skin tones',
  },
  {
    id: 7, type: 'fact', category: 'Skin Science',
    front: 'UV radiation is the #1 cause of premature skin ageing.',
    back: 'Photoageing (UV damage) accounts for up to 90% of visible skin changes — wrinkles, dark spots, and loss of elasticity. SPF is the best anti-ageing product.',
    stat: '✨ Daily SPF is the single most effective anti-ageing habit',
  },
  {
    id: 8, type: 'fact', category: 'Australia Stats',
    front: 'Victoria UV levels can exceed UV 12 in summer — "Extreme" category.',
    back: 'At UV 12+, unprotected skin can burn in under 10 minutes. Victoria\'s summer UV is among the most intense globally due to the southern ozone hole.',
    stat: '⚠️ Melbourne peak UV: 12–14 on summer days',
  },
  {
    id: 9, type: 'myth', category: 'Gen Z Trends',
    front: '"Sunscreen causes vitamin D deficiency."',
    back: 'Incidental sun exposure (hands, face, 5–10 mins outside peak hours) is sufficient for vitamin D synthesis. You don\'t need to skip SPF for vitamin D.',
    stat: '☀️ 5–10 min exposure outside 10am–3pm = adequate vitamin D',
  },
]
</script>

<style scoped>
.learn-page { display: flex; flex-direction: column; gap: 1.5rem; }

/* Filter */
.filter-row { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-btn {
  padding: 6px 16px;
  border-radius: 999px;
  border: 1.5px solid var(--border);
  background: transparent;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all 0.2s;
}
.filter-btn:hover, .filter-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(249,115,22,0.08);
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

/* Flip card */
.flip-card {
  height: 220px;
  cursor: pointer;
  perspective: 1000px;
}
.flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
  transform-style: preserve-3d;
}
.flip-card.flipped .flip-inner { transform: rotateY(180deg); }

.flip-front, .flip-back {
  position: absolute;
  inset: 0;
  border-radius: var(--radius);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
  backface-visibility: hidden;
  border: 1px solid var(--border);
}
.flip-front { background: var(--surface); }
.flip-back  {
  background: var(--surface-2);
  transform: rotateY(180deg);
  border-color: var(--accent);
}

.card-category { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }
.card-type-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  width: fit-content;
}
.card-type-badge.myth { background: rgba(239,68,68,0.15); color: #ef4444; }
.card-type-badge.fact { background: rgba(34,197,94,0.15); color: #22c55e; }
.back-badge { background: rgba(34,197,94,0.2) !important; color: #22c55e !important; }

.card-question {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  flex: 1;
  font-style: italic;
}
.card-tap-hint {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: auto;
}
.card-answer {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--text);
  flex: 1;
}
.card-stat {
  font-size: 0.72rem;
  color: var(--accent);
  font-weight: 600;
  padding: 4px 10px;
  background: rgba(249,115,22,0.1);
  border-radius: 6px;
}

/* Progress */
.progress-bar-wrap { display: flex; flex-direction: column; gap: 0.75rem; }
.progress-label { font-size: 0.85rem; color: var(--text-muted); }
.progress-track { height: 8px; background: var(--surface-2); border-radius: 999px; overflow: hidden; }
.progress-fill  { height: 100%; background: var(--accent); border-radius: 999px; transition: width 0.5s; }
</style>
