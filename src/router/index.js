import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import LoginPage from '@/components/LoginPage'
import TaskList from '@/components/TaskList'
import CustomerEdit from '@/components/CustomerEdit'
import SelectCourse from '@/components/SelectCourse'
import LecturerEdit from '@/components/LecturerEdit'
import DocumentEdit
  from '@/components/DocumentEdit'
import CoursePic
  from '@/components/CoursePic'
import BgPicEdit
  from '@/components/BgPicEdit'
import PicEdit
  from '@/components/PicEdit'
import FontPicEdit
  from '@/components/FontPicEdit'

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
    },
    {
      path: '/SelectCourse',
      name: 'SelectCourse',
      component: SelectCourse
    }
    ,
    {
      path: '/LecturerEdit',
      name: 'LecturerEdit',
      component: LecturerEdit
    }
    ,
    {
      path: '/DocumentEdit',
      name: 'DocumentEdit',
      component: DocumentEdit
    },
    {
      path: '/CoursePic',
      name: 'CoursePic',
      component: CoursePic
    },
    {
      path: '/BgPicEdit',
      name: 'BgPicEdit',
      component: BgPicEdit
    },
    {
      path: '/PicEdit',
      name: 'PicEdit',
      component: PicEdit
    },
    {
      path: '/FontPicEdit',
      name: 'FontPicEdit',
      component: FontPicEdit
    }
  ]
})
