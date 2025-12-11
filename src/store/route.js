import { defineStore } from 'pinia'
import router, { constantRoutes, asyncRoutes } from '@/router'

let removeRoutesArr = []

export const useRouteStore = defineStore('router', {
  state: () => ({
    routes: [],
  }),
  getters: {
    routesGetter: (state) => state.routes,
  },
  actions: {
    addRoutes(routes) {
      return new Promise((resolve, reject) => {
        if (!Array.isArray(routes)) {
          reject('routes is not array')
          return
        }

        const addRouteList = [...routes, ...asyncRoutes]
        this.routes = constantRoutes.concat(addRouteList)

        addRouteList.forEach((el) => {
          const remove = router.addRoute(el)
          removeRoutesArr.push(remove)
        })

        resolve()
      })
    },
    resetRoutes() {
      this.routes = []
      removeRoutesArr.forEach((el) => el())
      removeRoutesArr = []
    },
  },
})
