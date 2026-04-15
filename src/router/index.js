import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Account from '../views/Account.vue';
import Admin from '../views/Admin.vue';
import HallView from '../views/HallView.vue';
import About from '../views/About.vue';
import BookingPage from '../views/BookingPage.vue';
import CertificatesPage from '../views/CertificatesPage.vue';
import NotFound from '../views/NotFound.vue';
import Offer from '../views/Offer.vue';
import Privacy from '../views/Privacy.vue';

const routes = [
  {path: '/', name: 'home', component: Home },
  {path: '/account', name: 'account', component: Account, meta: { requiresAuth: true } },
  {path: '/admin', name: 'admin', component: Admin, meta: { requiresAdmin: true } },
  {path: '/about', name: 'about', component: About },
  {path: '/booking', name: 'booking', component: BookingPage, meta: { requiresAuth: true } },
  {path: '/certificates', name: 'certificates', component: CertificatesPage },
  {path: '/offer', name: 'offer', component: Offer },
  {path: '/privacy', name: 'privacy', component: Privacy },
  {path: '/hall/:id', name: 'hall',component: HallView },
  {path: '/:pathMatch(.*)*', name: 'notFound', component: NotFound }
];

const router = createRouter({
   history: createWebHistory('/BLAS02/'),
  routes,
  scrollBehavior: function (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

router.beforeEach(function (to, from, next) {
  const session = localStorage.getItem('studio_session');
  const user = session ? JSON.parse(session) : null;

  if (to.matched.some(function (record) { return record.meta.requiresAdmin; })) {
    if (!user || user.role !== 'admin') {
      console.warn('Доступ ограничен: требуются права администратора');
      return next('/');
    }
  }

  if (to.matched.some(function (record) { return record.meta.requiresAuth; })) {
    if (!user) {
      return next('/');
    }
  }

  next();
});

export default router;