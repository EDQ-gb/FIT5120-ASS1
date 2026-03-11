import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import ThenVsNow from './views/ThenVsNow.vue'
import UVCheck from './views/UVCheck.vue'
import ActionPlan from './views/ActionPlan.vue'
import LearnCards from './views/LearnCards.vue'
import QuizGame from './views/QuizGame.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',        component: ThenVsNow },
    { path: '/uv',      component: UVCheck },
    { path: '/action',  component: ActionPlan },
    { path: '/learn',   component: LearnCards },
    { path: '/quiz',    component: QuizGame },
  ]
})

createApp(App).use(router).mount('#app')
