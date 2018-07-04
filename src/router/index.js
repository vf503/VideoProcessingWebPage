import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import LoginPage from '@/components/LoginPage'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LoginPage',
      component: LoginPage
    },
    {
      path: '/HomePage',
      name: 'HomePage',
      component: HomePage
    }
  ]
})
