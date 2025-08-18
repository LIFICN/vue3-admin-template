import { defineStore } from 'pinia'
import { setToken, removeToken } from '@/utils/auth'
import { useRouteStore } from './route'

export const useUserStore = defineStore('user', {
  state: () => ({
    role: [],
    username: '',
  }),
  getters: {
    roleGetter: (state) => state.role,
    usernameGetter: (state) => state.username,
  },
  actions: {
    changeUserInfo(obj) {
      this.username = obj['username'] || ''
      this.role = obj['role'] || []
    },
    login(data) {
      return new Promise((resolve, reject) => {
        if (data.username != 'admin' || data.password != '123') {
          reject('用户名或密码错误！')
          return
        }

        setToken('element-admin')
        resolve()
      })
    },
    logout() {
      return new Promise((resolve, reject) => {
        try {
          const stroe = useRouteStore()
          stroe.resetRoutes()
          removeToken()
          this.$reset()
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    },
    getUserInfo() {
      return new Promise((resolve) => {
        const info = { username: '超级管理员', role: ['admin'] }
        this.changeUserInfo(info)
        resolve(info)
      })
    },
  },
})
