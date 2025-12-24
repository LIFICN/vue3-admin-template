import { nextTick, onBeforeUnmount, ref, watch, isRef } from 'vue'

function debounceRAF(func) {
  let id = null
  return function () {
    id && cancelAnimationFrame(id)
    id = requestAnimationFrame(() => func?.apply(this, arguments))
  }
}

export default function useVirtualList(dataSourceRef, config = {}) {
  const {
    scrollContainer,
    contentContainer,
    itemContainer,
    size = 10,
    bufferSize = 10,
    keyField = '',
    itemHeight = 30,
    chunkSize = 1000,
  } = config || {}

  if (!isRef(dataSourceRef) || !scrollContainer || !contentContainer || !itemContainer || !keyField)
    throw new Error(
      'The parameters `dataSourceRef`,`scrollContainer`,`contentContainer`,`itemContainer`,`keyField` cannot be null',
    )

  const sourceList = ref([])
  const sliceData = ref([])
  const needUpdate = ref(false)
  let scrollContainerEl, contentContainerEl, phantomDivEl
  let startIndex = 0 //实际滚动定位起始索引
  let bufferStartIndex = -1 //起始缓存索引
  let keyIndexObj = {} //key-index对照
  let chunkList = [] //缓存数据
  const chunkChangedIndexList = new Set() //缓存数据变更索引
  const itemSizeMap = new Map()

  const getItemHeight = (key) => itemSizeMap.get(key)?.height || itemHeight || 0
  const getChunkIndex = (index) => Math.floor(index / chunkSize)
  const getItemTop = (key) => {
    const i = keyIndexObj[key]
    const chunk = chunkList[getChunkIndex(i)]
    let top = chunk?.top || 0
    if (chunk) top += chunk.prefixSums[Math.max(i - chunk.start, 0)] || 0
    return top
  }

  const setItemSize = (key, obj = {}) => itemSizeMap.set(key, { ...itemSizeMap.get(key), ...obj })
  const getItemKey = (index) => (sourceList.value[index] && sourceList.value[index][keyField]) || ''

  const callback = debounceRAF(function (e) {
    updateItemSize(e.map((el) => el.target))
  })

  const resizeObserver = new ResizeObserver(callback)

  watch(
    () => [dataSourceRef?.value?.slice(), needUpdate.value],
    (newVals, oldVals) => {
      const [newVal] = newVals
      const [oldVal] = oldVals || []

      if (!needUpdate.value) return
      if (newVal?.some((el) => !el[keyField])) throw new Error('no keyField on items')
      sourceList.value = newVal || []

      if (!sourceList.value?.length) return disposeAll(false)
      keyIndexObj = {}
      sourceList.value?.forEach((el, index) => {
        keyIndexObj[el[keyField]] = index
        if (!itemSizeMap.get(el[keyField])) {
          itemSizeMap.set(el[keyField], { data: el, height: itemHeight })
        }
      })

      //对比出不存在的key，移除已缓存
      oldVal?.forEach((el) => {
        const key = el[keyField]
        if (typeof keyIndexObj[key] != 'number' && itemSizeMap.has(key)) itemSizeMap.delete(key)
      })

      updateData().then(() => updateItemSize(null, true, true))
    },
    { immediate: true },
  )

  //获取当前已渲染的item dom
  const getCurrentRenderedItem = () => Array.from(contentContainerEl?.querySelectorAll(itemContainer) || [])

  const initVirtualList = async () => {
    await disposeAll() //销毁上一次的
    scrollContainerEl = isRef(scrollContainer) ? scrollContainer.value : document.querySelector(scrollContainer)
    contentContainerEl = isRef(contentContainer) ? contentContainer.value : document.querySelector(contentContainer)
    if (!scrollContainerEl || !contentContainerEl) return

    scrollContainerEl.addEventListener('scroll', handleScroll)
    phantomDivEl = document.createElement('div')
    phantomDivEl.style.height = `${sourceList.value.length * itemHeight || 0}px`
    scrollContainerEl.appendChild(phantomDivEl)
    scrollContainerEl.style.position = 'relative'
    contentContainerEl.style.cssText += 'position:absolute;top:0;left:0;width:100%;'
    needUpdate.value = true
  }

  const disposeAll = async (clearWatch = true) => {
    sourceList.value = []
    itemSizeMap.clear()
    keyIndexObj = {}
    startIndex = 0
    bufferStartIndex = -1
    chunkList = []
    chunkChangedIndexList?.clear()
    updateData()
    clearWatch && resizeObserver?.disconnect()
    clearWatch && scrollContainerEl?.removeEventListener('scroll', handleScroll)
    needUpdate.value = !clearWatch //只是数据清空,可以触发watch重新计算
    await nextTick()
    clearWatch && phantomDivEl?.remove()
    if (!clearWatch && phantomDivEl) phantomDivEl.style.height = `0px`
    if (contentContainerEl) contentContainerEl.style.transform = `translateY(0px)`
  }

  onBeforeUnmount(disposeAll)

  const handleScroll = debounceRAF(async function (e) {
    const scrollTop = e.target.scrollTop
    const startTopKey = getItemKey(startIndex)
    //根据已渲染的item key，二分查找匹配符合scrolltop的key，计算出符合的index
    const topKey = binarySearch(scrollTop)
    if (!topKey || startTopKey == topKey) return
    startIndex = keyIndexObj[topKey]
    //实时计算数据，更新高度，top
    await updateData()
    transformToStart()
  })

  async function updateData() {
    let nBufSize = bufferSize || 10
    //计算起始索引
    bufferStartIndex = Math.max(startIndex - nBufSize, 0)
    //计算结束索引
    let end = Math.min(startIndex + (size || 10) + nBufSize, sourceList.value.length)
    sliceData.value = sourceList.value.slice(bufferStartIndex, end)
    await nextTick()
    resizeObserver?.disconnect()
    getCurrentRenderedItem().forEach((el) => resizeObserver?.observe(el))
  }

  function updateItemSize(elArr = null, itemResized = false, isCalcAll = false) {
    if (sourceList.value?.length <= 0) return
    const els = elArr || getCurrentRenderedItem()
    if (!els || !els.length) return
    //动态缓存列表项最新高度, top
    let changeFlag = itemResized || false
    for (let index = 0; index < els.length; index++) {
      const ofsh = els[index]?.offsetHeight
      const key = sliceData.value[index]?.[keyField] || ''
      if (key && getItemHeight(key) != ofsh) {
        changeFlag = true
        setItemSize(key, { height: ofsh })
        chunkChangedIndexList.add(getChunkIndex(keyIndexObj[key]))
      }
    }

    if (!changeFlag) return
    updateItemOffset(isCalcAll)
    transformToStart() //更新时间不固定，会导致高度，滚动错位，需要再次计算
    updateHeight()
  }

  const updateHeight = debounceRAF(() => {
    const endKey = getItemKey(sourceList.value.length - 1)
    const height = getItemTop(endKey) + getItemHeight(endKey)
    if (endKey && Math.abs(phantomDivEl.clientHeight) != height) phantomDivEl.style.height = `${height}px`
  })

  function transformToStart() {
    //动态定位到start位置,由于添加了缓冲区所以滚动的top取值应该是缓冲区第一项(bufferStartIndex)的top值
    const transformStr = `translateY(${getItemTop(getItemKey(bufferStartIndex))}px)`
    if (!contentContainerEl.style.cssText.includes(transformStr)) contentContainerEl.style.transform = transformStr
  }

  //计算所有已渲染的item top值, 主要性能瓶颈
  const updateItemOffset = function (isCalcAll = false) {
    if (!sourceList.value?.length) return
    if (isCalcAll) {
      chunkList = []
      const count = Math.ceil(sourceList.value.length / chunkSize)
      let top = 0

      for (let i = 0; i < count; i++) {
        const start = i * chunkSize
        const end = Math.min(start + chunkSize, sourceList.value.length)

        let height = 0
        let prefixSums = []
        for (let j = start; j < end; j++) {
          prefixSums.push(height)
          height += getItemHeight(getItemKey(j))
        }

        chunkList.push({ start, end, top, height, prefixSums })
        top += height
      }
    } else {
      chunkChangedIndexList.forEach((index) => {
        const chunk = chunkList[index]
        let height = 0
        let prefixSums = []
        for (let i = chunk.start; i < chunk.end; i++) {
          const itemKey = getItemKey(i)
          const offsetHeight = getItemHeight(itemKey)
          prefixSums.push(height)
          height += offsetHeight
        }

        chunk.prefixSums = prefixSums
        const diff = height - chunk.height
        chunk.height = height
        if (Math.abs(diff) > 1) {
          for (let i = index + 1; i < chunkList.length; i++) {
            chunkList[i].top += diff
          }
        }
      })
    }

    chunkChangedIndexList.clear()
  }

  function binarySearch(scrollTop) {
    let left = 0
    let right = sourceList.value.length - 1
    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      const midTop = getItemTop(getItemKey(mid))
      if (scrollTop >= midTop && scrollTop <= midTop + getItemHeight(getItemKey(mid))) return getItemKey(mid)
      else if (midTop < scrollTop) left = mid + 1
      else right = mid - 1
    }
    return undefined
  }

  function scrollTo(index) {
    scrollContainerEl && requestAnimationFrame(() => (scrollContainerEl.scrollTop = getItemTop(getItemKey(index))))
  }

  return { initVirtualList, sliceData, scrollTo }
}
