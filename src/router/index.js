import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import Profile from '@/components/Profile'
import Houses from '@/components/Houses'
import House from '@/components/House'
import HouseDashboard from '@/components/HouseDashboard'
import Devices from '@/components/Devices'
import Device from '@/components/Device'
import Triggers from '@/components/Triggers'
import Trigger from '@/components/Trigger'
import Actions from '@/components/Actions'
import Action from '@/components/Action'
import Barks from '@/components/Barks'
import Bark from '@/components/Bark'

Vue.use(Router);

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
          path: 'dashboard',
          component: HouseDashboard
        },
        {
          path: 'devices',
          component: Devices
        },
        {
          path: 'barks',
          component: Barks
        },
        {
          path: 'barks/add',
          component: Bark
        },
        {
          path: 'barks/:bark_id',
          component: Bark
        }
      ]
    },
    {
      path: '/houses/:house_id/devices/:device_id',
      component: Device,
      children: [
        {
          path: 'triggers',
          component: Triggers
        },
        {
          path: 'triggers/add',
          component: Trigger
        },
        {
          path: 'triggers/:id',
          component: Trigger
        },
        {
          path: 'actions',
          component: Actions
        },
        {
          path: 'actions/add',
          component: Action
        },
        {
          path: 'actions/:id',
          component: Action
        }
      ]
    }
  ]
})
