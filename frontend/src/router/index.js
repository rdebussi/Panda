import Vue from 'vue';
import VueRouter from 'vue-router';

import LoginPage from '../views/LoginPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import VideoPlayerPage from '../views/VideoPlayerPage.vue';
import VideoList from '../components/VideoList.vue';       
import NewFeature from '../components/NewFeature.vue';   

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/',
    component: DashboardPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: '', 
        name: 'Dashboard', 
        component: VideoList 
      },
      {
        path: 'lives', 
        name: 'Lives',
        component: NewFeature 
      },
      {
        path: 'analytics', 
        name: 'Analytics',
        component: NewFeature
      },
      {
        path: 'settings', 
        name: 'Settings',
        component: NewFeature
      }
    ]
  },
  {
    path: '/video/:id',
    name: 'Video',
    component: VideoPlayerPage,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '*',
    redirect: '/'
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('jwt_token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/');
  }
  else {
    next();
  }
});

export default router;