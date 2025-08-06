import { ref, watch, inject, nextTick } from 'vue'
import { computePosition, offset } from '@floating-ui/dom'

export function useProvideMenusKey() {
  return 'scopeMeunsObj'
}

export function useInjectMeuns() {
  return inject(useProvideMenusKey())
}

export function useTreeToParentMap(treeList) {
  const treeParentMap = ref({})

  watch(
    () => treeList,
    () => {
      treeParentMap.value = forEachTreeToMap(treeList)
      console.log('treeParentMap', treeParentMap)
    },
    { deep: true, immediate: true },
  )

  function forEachTreeToMap(arr, parentKey = '', parentMap = {}) {
    if (!arr || !arr.length) return

    arr.forEach((el) => {
      el.children &&
        el.children.forEach((x) => {
          parentMap[x.key] = [el]
        })

      if (parentKey) {
        parentMap[el.key] = [...(parentMap[parentKey] || []), ...(parentMap[el.key] || [])]
      }

      forEachTreeToMap(el.children, el.key, parentMap)
    })

    return parentMap
  }

  return [treeParentMap]
}

export function useFloatingPosition(targetRef, floatingRef) {
  function updatePosition() {
    if (!targetRef || !floatingRef || !targetRef.value || !floatingRef.value) return

    nextTick(() => {
      computePosition(targetRef.value, floatingRef.value, {
        placement: 'right',
        strategy: 'absolute',
        middleware: [offset({ mainAxis: 8 })],
      }).then(({ x, y }) => {
        Object.assign(floatingRef.value.style, {
          left: `${x}px`,
          top: `${y}px`,
        })
      })
    })
  }

  return [updatePosition]
}
