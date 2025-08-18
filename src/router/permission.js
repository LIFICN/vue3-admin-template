import router from '@/router'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/store/user'
import NProgress from 'nprogress'
import { useRouteStore } from '@/store/route'

NProgress.configure({ showSpinner: false })

const loginRoute = '/login'
const whiteList = [loginRoute]

router.beforeEach(async (to, _, next) => {
  NProgress.start()

  const token = getToken()
  const userStore = useUserStore()
  const hasRole = Array.isArray(userStore.roleGetter) && userStore.roleGetter.length > 0

  if (token && to.path == loginRoute) {
    next('/')
    return
  }

  if (whiteList.includes(to.path)) {
    next()
    return
  }

  if (!token) {
    next(loginRoute)
    return
  }

  if (!hasRole) {
    const routeStore = useRouteStore()
    await userStore.getUserInfo()
    await routeStore.addRoutes([])

    //动态加载路由后必须重定向新路由，否则刷新白屏
    next({ ...to, replace: true })
    return
  }

  next()
})

router.afterEach(() => {
  NProgress.done()
})

router.onError((err, to, from) => {
  console.log(err, to, from)
  NProgress.done()
})
