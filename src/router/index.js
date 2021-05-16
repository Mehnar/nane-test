// eslint-disable-next-line import/no-cycle
import store from '@/store';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'default',
    meta: { authRequired: false },
    component: () => import(/* webpackChunkName: "Empty" */ '@/views/Empty'),
    children: [
      {
        path: 'login',
        name: 'Login',
        meta: { authRequired: false },
        component: () => import(/* webpackChunkName: "Login" */ '@/views/Login'),
      },
      {
        path: 'new',
        name: 'New',
        meta: { authRequired: true },
        component: () => import(/* webpackChunkName: "New" */ '@/views/New'),
      },
    ],
  },
  {
    path: '/:name',
    name: 'Chat',
    meta: { authRequired: true },
    component: () => import(/* webpackChunkName: "about" */ '@/views/Chat'),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const authRequiredTo = to.matched.some((rec) => rec.meta.authRequired);
  const isLogin = store.state.login;
  if (authRequiredTo) {
    if (isLogin) next();
    else next(false);
  } else next();
});

export default router;
