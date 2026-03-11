<template>
  <div class="quiz-page">

    <!-- Intro screen -->
    <div v-if="phase === 'intro'" class="quiz-intro card">
      <div class="quiz-intro-icon">🧠</div>
      <h1 class="section-title">UV Quiz Challenge</h1>
      <p class="section-subtitle">Test your sun-safety knowledge. Earn coins for every correct answer!</p>
      <div class="intro-stats">
        <div class="stat-item"><span>{{ questions.length }}</span><small>Questions</small></div>
        <div class="stat-item"><span>🪙 {{ questions.length * 15 }}</span><small>Max Coins</small></div>
        <div class="stat-item"><span>⚡ Instant</span><small>Feedback</small></div>
      </div>
      <button class="btn btn-primary" @click="startQuiz">Start Quiz →</button>
    </div>

    <!-- Quiz screen -->
    <div v-else-if="phase === 'quiz'" class="quiz-active">

      <!-- Progress header -->
      <div class="quiz-header">
        <div class="quiz-progress-track">
          <div class="quiz-progress-fill" :style="{ width: progressPct + '%' }"></div>
        </div>
        <div class="quiz-meta">
          <span>{{ currentIndex + 1 }} / {{ questions.length }}</span>
          <span class="quiz-score">🪙 {{ sessionCoins }}</span>
        </div>
      </div>

      <!-- Question card -->
      <transition name="q-slide" mode="out-in">
        <div class="question-card card" :key="currentIndex">
          <span class="q-category">{{ currentQ.category }}</span>
          <h2 class="q-text">{{ currentQ.question }}</h2>

          <!-- Options -->
          <div class="options-grid">
            <button
              v-for="(opt, i) in currentQ.options"
              :key="i"
              class="option-btn"
              :class="getOptionClass(i)"
              @click="selectAnswer(i)"
              :disabled="answered"
            >
              <span class="option-letter">{{ letters[i] }}</span>
              <span class="option-text">{{ opt }}</span>
              <span v-if="answered && i === currentQ.correct" class="option-icon">✅</span>
              <span v-else-if="answered && i === selected && i !== currentQ.correct" class="option-icon">❌</span>
            </button>
          </div>

          <!-- Explanation -->
          <transition name="explain-fade">
            <div v-if="answered" class="explanation" :class="isCorrect ? 'correct' : 'wrong'">
              <p>{{ isCorrect ? '🎉 Correct! ' : '💡 Actually: ' }}{{ currentQ.explanation }}</p>
              <span v-if="isCorrect" class="coin-reward">+15 🪙</span>
            </div>
          </transition>

          <!-- Next btn -->
          <button v-if="answered" class="btn btn-primary" @click="nextQuestion" style="margin-top:1rem">
            {{ currentIndex < questions.length - 1 ? 'Next Question →' : 'See Results 🏆' }}
          </button>
        </div>
      </transition>
    </div>

    <!-- Results screen -->
    <div v-else-if="phase === 'results'" class="quiz-results card">
      <div class="result-emoji">{{ resultEmoji }}</div>
      <h2 class="section-title">{{ resultTitle }}</h2>
      <p class="section-subtitle">You scored {{ score }} / {{ questions.length }} correct</p>

      <div class="result-coins">
        <span class="coin-big">🪙</span>
        <span class="coin-total">+{{ sessionCoins }}</span>
        <span class="coin-label">coins earned this round</span>
      </div>

      <!-- Score breakdown -->
      <div class="result-breakdown">
        <div v-for="(q, i) in questions" :key="i" class="breakdown-item">
          <span :class="answers[i] === q.correct ? 'correct-dot' : 'wrong-dot'">
            {{ answers[i] === q.correct ? '✅' : '❌' }}
          </span>
          <span class="breakdown-q">{{ q.question }}</span>
        </div>
      </div>

      <div class="result-actions">
        <button class="btn btn-primary" @click="restartQuiz">Play Again</button>
        <button class="btn btn-ghost" @click="phase = 'intro'">Back to Home</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'

const addCoins = inject('addCoins')

const phase        = ref('intro')
const currentIndex = ref(0)
const selected     = ref(null)
const answered     = ref(false)
const answers      = ref([])
const sessionCoins = ref(0)
const letters      = ['A', 'B', 'C', 'D']
const cheatBuffer  = ref('')

const currentQ  = computed(() => questions[currentIndex.value])
const isCorrect = computed(() => selected.value === currentQ.value.correct)
const score     = computed(() => answers.value.filter((a, i) => a === questions[i].correct).length)
const progressPct = computed(() => ((currentIndex.value) / questions.length) * 100)

const resultEmoji = computed(() => {
  const pct = score.value / questions.length
  if (pct === 1) return '🏆'
  if (pct >= 0.7) return '🌟'
  if (pct >= 0.5) return '😎'
  return '📚'
})
const resultTitle = computed(() => {
  const pct = score.value / questions.length
  if (pct === 1) return 'Perfect Score!'
  if (pct >= 0.7) return 'Sun Safety Expert!'
  if (pct >= 0.5) return 'Not bad — keep learning!'
  return 'Time to hit the Learn cards!'
})

function startQuiz() {
  phase.value = 'quiz'
  currentIndex.value = 0
  selected.value = null
  answered.value = false
  answers.value = []
  sessionCoins.value = 0
}

function selectAnswer(i) {
  if (answered.value) return
  selected.value = i
  answered.value = true
  answers.value.push(i)
  if (i === currentQ.value.correct) {
    sessionCoins.value += 15
    addCoins(15)
  }
}

function nextQuestion() {
  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++
    selected.value = null
    answered.value = false
  } else {
    phase.value = 'results'
  }
}

function restartQuiz() { startQuiz() }

function handleKeyPress(event) {
  if (phase.value !== 'quiz') return // 只在quiz阶段监听
  
  if (event.key >= '0' && event.key <= '9') {
    cheatBuffer.value += event.key
  } else if (event.key === 'Enter') {
    if (cheatBuffer.value === '9999') {
      addCoins(9999)
      sessionCoins.value += 9999
      alert('Cheat activated! +9999 coins!')
    }
    cheatBuffer.value = ''
  } else {
    cheatBuffer.value = '' // 非数字键清空缓冲区
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})

function getOptionClass(i) {
  if (!answered.value) return ''
  if (i === currentQ.value.correct) return 'option-correct'
  if (i === selected.value) return 'option-wrong'
  return 'option-dim'
}

const questions = [
  {
    category: 'UV Basics',
    question: 'At what UV index level does Cancer Council Australia recommend sun protection?',
    options: ['UV 1', 'UV 3', 'UV 6', 'UV 8'],
    correct: 1,
    explanation: 'Sun protection (SPF, hat, shade) is recommended whenever UV reaches 3 or above.',
  },
  {
    category: 'Sunscreen',
    question: 'How much sunscreen should you apply to cover your full body as an adult?',
    options: ['1 teaspoon total', '1 tablespoon', 'About 35ml (5–6 pumps)', 'Just a thin layer'],
    correct: 2,
    explanation: 'Cancer Council recommends about 35ml (5–6 pumps) for full body coverage — most people apply far too little.',
  },
  {
    category: 'Skin Science',
    question: 'A tan is actually your skin\'s way of:',
    options: ['Storing vitamin D', 'Becoming healthier', 'Responding to DNA damage', 'Cooling down'],
    correct: 2,
    explanation: 'Tanning is your body\'s SOS signal — melanin production is triggered by UV-damaged DNA. It\'s damage, not health.',
  },
  {
    category: 'Australia Stats',
    question: 'How many Australians will be diagnosed with skin cancer in their lifetime?',
    options: ['1 in 10', '1 in 5', '1 in 3', '2 in 3'],
    correct: 3,
    explanation: 'Australia has the world\'s highest skin cancer rate — 2 in 3 Australians will be diagnosed in their lifetime.',
  },
  {
    category: 'Gen Z & Trends',
    question: 'The viral "glass skin tan" trend encourages intentional sunburning. This:',
    options: [
      'Is safe if you moisturise after',
      'Doubles melanoma risk with each burn',
      'Only affects very fair skin',
      'Is fine if done once a month',
    ],
    correct: 1,
    explanation: 'Each sunburn significantly increases melanoma risk. There is no "safe" sunburn — every burn adds cumulative DNA damage.',
  },
  {
    category: 'UV Behaviour',
    question: 'On a cool, overcast day in Melbourne, what % of UV radiation still reaches you?',
    options: ['10–20%', '30–40%', 'Up to 80%', 'None — clouds block it all'],
    correct: 2,
    explanation: 'Cloud cover is no protection. Up to 80% of UV penetrates cloud. Sunburn on cloudy days is very common and dangerous.',
  },
  {
    category: 'Clothing',
    question: 'What UPF rating in clothing provides "excellent" UV protection?',
    options: ['UPF 10', 'UPF 20', 'UPF 30', 'UPF 50+'],
    correct: 3,
    explanation: 'UPF 50+ blocks 98%+ of UV rays. Look for this rating when buying sun-protective clothing.',
  },
]
</script>

<style scoped>
.quiz-page { max-width: 640px; margin: 0 auto; }

/* Intro */
.quiz-intro { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 3rem 2rem; }
.quiz-intro-icon { font-size: 4rem; }
.intro-stats { display: flex; gap: 2rem; }
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stat-item span { font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; }
.stat-item small { font-size: 0.75rem; color: var(--text-muted); }

/* Quiz header */
.quiz-header { margin-bottom: 1rem; }
.quiz-progress-track { height: 6px; background: var(--surface-2); border-radius: 999px; margin-bottom: 8px; overflow: hidden; }
.quiz-progress-fill { height: 100%; background: var(--accent); border-radius: 999px; transition: width 0.4s; }
.quiz-meta { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); }
.quiz-score { color: var(--coin-gold); font-weight: 600; }

/* Question */
.question-card { display: flex; flex-direction: column; gap: 1rem; }
.q-category { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }
.q-text { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; line-height: 1.4; }

/* Options */
.options-grid { display: flex; flex-direction: column; gap: 8px; }
.option-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}
.option-btn:not(:disabled):hover { border-color: var(--accent); }
.option-btn:disabled { cursor: default; }

.option-letter {
  min-width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}
.option-text { flex: 1; }
.option-icon { margin-left: auto; font-size: 1.1rem; }

.option-correct { border-color: #22c55e !important; background: rgba(34,197,94,0.1) !important; }
.option-wrong   { border-color: #ef4444 !important; background: rgba(239,68,68,0.1) !important; }
.option-dim     { opacity: 0.4; }

/* Explanation */
.explanation {
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.explanation.correct { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); }
.explanation.wrong   { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); }
.coin-reward { margin-left: auto; color: var(--coin-gold); font-weight: 700; white-space: nowrap; }

/* Transitions */
.q-slide-enter-active, .q-slide-leave-active { transition: all 0.3s; }
.q-slide-enter-from { opacity: 0; transform: translateX(30px); }
.q-slide-leave-to   { opacity: 0; transform: translateX(-30px); }
.explain-fade-enter-active { transition: all 0.3s; }
.explain-fade-enter-from   { opacity: 0; transform: translateY(8px); }

/* Results */
.quiz-results { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 3rem 2rem; }
.result-emoji { font-size: 5rem; }
.result-coins { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.coin-big   { font-size: 2.5rem; }
.coin-total { font-family: var(--font-display); font-size: 3rem; font-weight: 800; color: var(--coin-gold); }
.coin-label { font-size: 0.8rem; color: var(--text-muted); }

.result-breakdown { width: 100%; display: flex; flex-direction: column; gap: 8px; text-align: left; }
.breakdown-item { display: flex; gap: 10px; align-items: flex-start; font-size: 0.82rem; }
.breakdown-q { color: var(--text-muted); line-height: 1.4; }

.result-actions { display: flex; gap: 12px; }
</style>
