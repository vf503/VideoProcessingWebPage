import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import LoginPage from '@/components/LoginPage'
import TaskList from '@/components/TaskList'
import CustomerEdit from '@/components/CustomerEdit'


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
    },
    {
      path: '/TaskList',
      name: 'TaskList',
      component: TaskList
    }
    ,
    {
      path: '/CustomerEdit',
      name: 'CustomerEdit',
      component: CustomerEdit
    }
  ]
})
