import { nextTick, onBeforeUnmount, onMounted, ref, watch, isRef } from 'vue'

function debounceRAF(func) {
  let id = null
  return function () {
    id && cancelAnimationFrame(id)
    requestAnimationFrame(() => {
      func?.apply(this, arguments)
    })
  }
}

function debounce(func, wait = 100) {
  let timer = null
  return function () {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      func?.apply(this, arguments)
    }, wait)
  }
}

export default function useVirtualList(
  dataSource,
  config = {
    scrollContainer: '',
    contentContainer: '',
    itemContainer: '',
    dataSource: [],
    size: 10,
    bufferSize: 10,
    keyField: '',
    itemHeight: 20,
  }
) {
  const {
    scrollContainer,
    contentContainer,
    itemContainer,
    size = 10,
    bufferSize = 10,
    keyField = '',
    itemHeight = 20,
  } = config || {}

  if (!isRef(dataSource) || !scrollContainer || !contentContainer || !itemContainer || !keyField || !itemHeight)
    throw new Error(
      'The parameters `dataSource`,`scrollContainer`,`contentContainer`,`itemContainer`,`keyField`,`itemHeight` cannot be null'
    )

  const sourceList = ref([])
  const sliceData = ref([])
  let scrollContainerEl, contentContainerEl, phantomDivEl
  let startIndex = 0 //实际滚动定位起始索引
  let bufferStartIndex = -1 //起始缓存索引
  let resizeObserver = null
  let itemResized = false //容器，item尺寸是否改变
  let keyIndexObj = {} //key-index对照
  let startTopKey = null //记录上一次滚动开始item key

  const itemSizeMap = new Map()
  const getItemHeight = (key) => itemSizeMap.get(key)?.height || itemHeight || 0
  const getItemTop = (key) => itemSizeMap.get(key)?.top || 0
  const setItemSize = (key, obj = {}) => itemSizeMap.set(key, { ...itemSizeMap.get(key), ...obj })
  const getItemKey = (index) => (sourceList.value[index] && sourceList.value[index][keyField]) || ''

  watch(
    () => dataSource?.value?.slice(),
    (newVal, oldVal) => {
      if (newVal.some((el) => !el[keyField])) throw new Error('no keyField on items')
      sourceList.value = newVal || []
      itemResized = true
      startTopKey = null

      if (!sourceList.value?.length) {
        itemSizeMap.clear()
        keyIndexObj = {}
        startIndex = 0
        bufferStartIndex = -1
        nextTick(() => {
          if (!phantomDivEl || !contentContainerEl) return
          phantomDivEl.style.height = `0px`
          contentContainerEl.style.transform = `translateY(0px)`
        })

        updateData()
        return
      }

      keyIndexObj = {}
      sourceList.value?.forEach((el, index) => {
        keyIndexObj[el[keyField]] = index
        if (!itemSizeMap.get(el[keyField])) {
          itemSizeMap.set(el[keyField], { data: el, height: itemHeight, top: 0 })
        }
      })

      //对比出不存在的key，移除已缓存
      oldVal
        ?.filter((el) => isNaN(keyIndexObj[el[keyField]]))
        ?.forEach((key) => {
          if (itemSizeMap.get(key)) itemSizeMap.delete(key)
        })

      updateData()
    },
    { immediate: true }
  )

  onMounted(() => {
    scrollContainerEl = document.querySelector(scrollContainer)
    contentContainerEl = document.querySelector(contentContainer)
    if (!scrollContainerEl || !contentContainerEl) return

    scrollContainerEl.addEventListener('scroll', handleScroll)
    phantomDivEl = document.createElement('div')
    phantomDivEl.style.height = `${sourceList.value.length * itemHeight || 0}px`
    scrollContainerEl.appendChild(phantomDivEl)
    scrollContainerEl.style.position = 'relative'
    contentContainerEl.style.position = 'absolute'
    contentContainerEl.style.top = 0
    contentContainerEl.style.left = 0
    contentContainerEl.style.width = '100%'

    //容器尺寸变化或item高度变化需要重新计算高度, 更新所有已渲染item top
    resizeObserver = new ResizeObserver(
      debounce(async function () {
        await updateItemSize()
      }, 200)
    )

    resizeObserver.observe(contentContainerEl)
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    scrollContainerEl?.remove('scroll', handleScroll)
  })

  //获取当前已渲染的item dom
  const getCurrentRenderedItem = () => Array.from(contentContainerEl?.querySelectorAll(itemContainer) || [])

  const handleScroll = debounceRAF(async function (e) {
    const scrollTop = e.target.scrollTop
    //如果scrolltop在当前item高度内滚动，则跳过计算
    const preStartTop = getItemTop(startTopKey) || 0
    if (scrollTop > preStartTop && scrollTop <= preStartTop + getItemHeight(startTopKey)) return

    //根据已渲染的item key，二分查找匹配符合scrolltop的key，计算出符合的index
    const topKey = binarySearch(scrollTop)
    if (!topKey || startTopKey == topKey) return
    startTopKey = topKey
    startIndex = keyIndexObj[topKey]

    //实时计算数据，更新高度，top
    updateData()
    await updateItemSize()
    transformToStart()
  })

  function updateData() {
    let nBufSize = bufferSize || 1
    //计算起始索引
    bufferStartIndex = startIndex < nBufSize ? 0 : startIndex - nBufSize >= 0 ? startIndex - nBufSize : startIndex
    //计算结束索引
    let endSum = startIndex + size + nBufSize
    let end = endSum >= sourceList.value.length ? sourceList.value.length : endSum
    sliceData.value = sourceList.value.slice(bufferStartIndex, end)
  }

  async function updateItemSize() {
    //如果以更新到最后一项item数据，不再遍历，但是数据，高度变化，重新计算
    const allLength = sourceList.value.length
    if (allLength <= 0 || (!itemResized && itemSizeMap.length == allLength)) return
    itemResized = false

    await nextTick()
    const els = getCurrentRenderedItem()
    //动态缓存列表项最新高度, top
    for (let index = 0; index < els.length; index++) {
      const el = els[index]
      const key = sliceData.value[index][keyField]
      const ofsh = el.offsetHeight
      if (getItemHeight(key) != ofsh) setItemSize(key, { height: ofsh })
    }

    calcItemTop()
    updateHeight()
  }

  const updateHeight = () => {
    //更新总高度
    const endKey = getItemKey(sourceList.value.length - 1)
    if (!endKey) return
    phantomDivEl.style.height = `${getItemTop(endKey) + getItemHeight(endKey)}px`
  }

  function transformToStart() {
    //动态定位到start位置,由于添加了缓冲区所以滚动的top取值应该是缓冲区第一项(bufferStartIndex)的top值
    const transformTop = getItemTop((sliceData.value[0] || {})[keyField] || '')
    if (transformTop < 0) return
    contentContainerEl.style.transform = `translateY(${transformTop}px)`
  }

  //计算所有已渲染的item top值
  const calcItemTop = debounce(function () {
    if (!sourceList.value?.length) return
    //获取最新渲染列表，开始item的top，向下批量更新
    let bufferStartTop = getItemTop(getItemKey(bufferStartIndex))
    for (let index = bufferStartIndex; index < sourceList.value.length; index++) {
      const itemKey = getItemKey(index)
      setItemSize(itemKey, { top: bufferStartTop })
      const offsetHeight = getItemHeight(itemKey)
      bufferStartTop += offsetHeight
    }

    //更新时间不固定，会导致高度，滚动错位，需要再次计算
    transformToStart()
    updateHeight()
  }, 50)

  // 二分查找算法，配合检索虚拟列表scrolltop魔改，非原版通用
  function binarySearch(scrollTop) {
    let left = 0
    let right = sourceList.value.length - 1
    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      const midTop = getItemTop(getItemKey(mid))
      const val = midTop - scrollTop
      if (val >= 0 && val <= getItemHeight(getItemKey(mid))) return getItemKey(mid)
      else if (midTop < scrollTop) left = mid + 1
      else right = mid - 1
    }
    return undefined
  }

  function scrollTo(index) {
    const itemKey = getItemKey(index)
    if (!itemKey || getItemTop(itemKey) < 0 || !scrollContainerEl) return
    scrollContainerEl.scrollTop = getItemTop(itemKey)
  }

  return { sliceData, scrollTo }
}
