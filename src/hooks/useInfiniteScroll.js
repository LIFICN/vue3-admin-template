import { onMounted, readonly, ref, onUnmounted } from 'vue'

export default function useInfiniteScroll(containerSelctor, loadMore, offset = 10) {
  const isLoading = ref(false)
  let container = null
  let isLock = false
  let oldScrollTop = 0

  onMounted(() => {
    if (typeof loadMore != 'function') throw new Error('loadMore is not function')
    container = document.querySelector(containerSelctor)
    container?.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => container?.removeEventListener('scroll', handleScroll))

  const handleScroll = () => {
    if (!container || isLoading.value) return
    const scrollTop = container.scrollTop
    const clientHeight = container.clientHeight
    const scrollHeight = container.scrollHeight

    //向上滚动不触发
    const oldScrollTopVal = oldScrollTop
    oldScrollTop = scrollTop
    if (oldScrollTopVal > scrollTop) return

    if (scrollHeight <= clientHeight + scrollTop + offset) {
      //动态创建加载动画或者其他底部元素，触底校验会触发两次，需要跳过
      if (isLock) {
        isLock = false
        return
      }

      isLoading.value = true
      isLock = true
      const resLoaded = loadMore?.()
      resLoaded?.then ? resLoaded.finally(() => (isLoading.value = false)) : (isLoading.value = false)
    }
  }

  return { isLoading: readonly(isLoading) }
}
