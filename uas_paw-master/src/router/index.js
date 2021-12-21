import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'

Vue.use(VueRouter)
function importComponent(path) {
  return () => import(`../components/${path}.vue`)
}

const routes = [
  {
    path: '/',
    name: 'login',
    component: importComponent('Login')
  },
  {
    path: '/register',
    name: 'register',
    component: importComponent('Register')
  },
  {
    path: '/dashboardLayout',
    name: 'DashboardLayout',
    component: importComponent('DashboardLayout'),
    children: [
      {
        path: "/home",
        name: "Home",
        component: importComponent('HelloWorld'),
      },
      {
        path: "/dashboard",
        name: "Dashboard",
        component: importComponent('HelloWorld'),
      },
      {
        path: "/menu",
        name: "Menu",
        component: importComponent('Menu'),
      },
      {
        path: "/order",
        name: "Order",
        component: importComponent('Order'),
      },
      {
        path: "/detail-order/:id",
        name: "Detail Order",
        component: importComponent('DetailOrder'),
      },
      {
        path: "/profile",
        name: "Profile",
        component: importComponent('Profile'),
      }
    ],
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
