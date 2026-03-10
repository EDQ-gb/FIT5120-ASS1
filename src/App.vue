<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-logo"><span>☀️</span><span class="logo-text">SunSafe</span></div>
      <div class="nav-links">
        <router-link to="/" class="nav-btn" active-class="active">UV Check</router-link>
        <router-link to="/action" class="nav-btn" active-class="active">Today's Plan</router-link>
        <router-link to="/learn" class="nav-btn" active-class="active">Learn</router-link>
        <router-link to="/quiz" class="nav-btn" active-class="active">Quiz</router-link>
      </div>
      <div class="coin-badge">🪙 {{ coins }}</div>
    </nav>
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'
const coins = ref(0)
onMounted(() => { coins.value = parseInt(localStorage.getItem('sunsafe_coins') || '0') })
const addCoins = (n) => { coins.value += n; localStorage.setItem('sunsafe_coins', coins.value) }
const uvLevel = ref(0)
provide('coins', coins)
provide('addCoins', addCoins)
provide('uvLevel', uvLevel)
provide('setUvLevel', (v) => { uvLevel.value = v })
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500;600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --bg: #0a0a0f; --surface: #13131a; --surface-2: #1e1e2e;
  --border: rgba(255,255,255,0.08); --text: #f0f0f8; --text-muted: #888899;
  --accent: #f97316; --coin-gold: #f59e0b; --radius: 16px; --radius-sm: 8px;
}
body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
.navbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 2rem; height: 64px;
  background: rgba(13,13,20,0.85); backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100;
}
.nav-logo { display: flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; color: var(--accent); }
.nav-links { display: flex; gap: 4px; }
.nav-btn { padding: 6px 16px; border-radius: 999px; font-size: 0.875rem; font-weight: 500; color: var(--text-muted); text-decoration: none; transition: all 0.2s; }
.nav-btn:hover { color: var(--text); background: var(--surface-2); }
.nav-btn.active { color: #fff; background: var(--accent); }
.coin-badge { background: var(--surface-2); padding: 6px 14px; border-radius: 999px; border: 1px solid rgba(245,158,11,0.3); font-weight: 600; color: var(--coin-gold); }
.main-content { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }
.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.25s, transform 0.25s; }
.page-fade-enter-from { opacity: 0; transform: translateY(12px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-8px); }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; border: none; border-radius: 999px; font-family: var(--font-body); font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
.btn-ghost { background: var(--surface-2); color: var(--text); border: 1px solid var(--border); }
.btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
.section-title { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 0.5rem; }
.section-subtitle { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 2rem; }
.uv-low { color: #22c55e; } .uv-moderate { color: #eab308; } .uv-high { color: #f97316; } .uv-very-high { color: #ef4444; } .uv-extreme { color: #9333ea; }
</style>
