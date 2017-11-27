import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import Profile from '@/components/Profile'
import Houses from '@/components/Houses'
import House from '@/components/House'
import Devices from '@/components/Devices'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/houses',
      name: 'Houses',
      component: Houses
    },
    {
      path: '/houses/:id', component: House,
      children: [
        {
          path: 'devices',
          component: Devices
        }
      ]
    }
  ]
})
