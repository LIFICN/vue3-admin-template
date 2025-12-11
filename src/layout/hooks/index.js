import { ref, computed, readonly, watch } from 'vue'

export function useCollapse() {
  const isCollapse = ref(false)
  const sidebarWidth = computed(() => (isCollapse.value ? '72px' : '240px'))

  function setCollapse() {
    isCollapse.value = !isCollapse.value
  }

  return [isCollapse, sidebarWidth, setCollapse]
}

export function useCovertRoutesToMenus(routeStoreData = []) {
  const routeArr = ref([])

  watch(
    () => routeStoreData,
    (newVal) => (routeArr.value = forEachRoutes(newVal || [], '')),
    { deep: true, immediate: true },
  )

  function forEachRoutes(routes = [], basePath = '') {
    if (!routes || routes.length == 0) return []
    const res = []

    routes.forEach((el) => {
      if (el.hidden) return
      let obj = {}
      let flag = basePath && el.path && !basePath.endsWith('/') && !el.path.startsWith('/')
      obj.key = flag ? `${basePath}/${el.path}` : el.path
      obj.icon = getIcon(el)
      obj.label = getLabel(el)
      if (Array.isArray(el.children) && (el.children.length > 1 || el.meta?.menuGroup)) {
        obj.children = forEachRoutes(el.children, obj.key)
      }

      res.push(obj)
    })

    return res
  }

  function getIcon(item) {
    if (item.meta?.icon) return item.meta.icon
    if (item.children && item.children.length == 1) return item.children[0].meta?.icon || ''
    return ''
  }

  function getLabel(item) {
    if (item.meta?.title) return item.meta.title
    if (item.children && item.children.length == 1) return item.children[0].meta?.title || ''
    return ''
  }

  return readonly(routeArr)
}
