import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/home/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../pages/about/AboutView.vue'),
    },
    {
      path: '/generate',
      name: 'generate',
      component: () => import('../pages/generate/GenerateView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../pages/profile/ProfileView.vue'),
    },
    {
      path: '/profile/generations',
      name: 'my-generations',
      component: () => import('../pages/profile/MyGenerationsView.vue'),
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('../pages/timeline/TimelineView.vue'),
    },
  ],
})

export default router
