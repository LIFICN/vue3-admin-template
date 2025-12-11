<template>
  <div class="tab-scrollbar">
    <div
      :class="[{ active: state.currentIndex == index }, 'tab-item']"
      v-for="(item, index) in state.tabList"
      :key="item.title"
      :id="`appTabItem${index}`"
      @click="tabClick(index)"
    >
      <span class="title">{{ item.title }}</span>
      <i class="close-icon" @click.stop="tabRemove(index)" v-if="!item.affix">
        <svg viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M567.168 512l189.184 188.352a40.064 40.064 0 0 1 0.768 55.68 37.76 37.76 0 0 1-54.4 0.832L512 566.912l-190.72 189.952a37.76 37.76 0 0 1-54.4-0.768 40.064 40.064 0 0 1 0.768-55.68L456.832 512 267.648 323.648a40.064 40.064 0 0 1-0.768-55.68 37.76 37.76 0 0 1 54.4-0.832L512 457.088l190.72-189.952a37.76 37.76 0 0 1 54.4 0.768 40.064 40.064 0 0 1-0.768 55.68L567.168 512z"
            fill="currentColor"
          ></path>
        </svg>
      </i>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRouteStore } from '@/store/route'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
let affixRoutes = []
const { routesGetter: routesArr } = storeToRefs(useRouteStore())

const state = reactive({
  tabList: [],
  currentIndex: 0,
})

const currentRoute = computed(() => {
  return {
    ...route.meta,
    path: route.fullPath,
  }
})

function tabRemove(target) {
  const lastIndex = state.tabList.length - 1
  state.tabList.splice(target, 1)

  //删除当前选项卡左边选项卡
  if (target < state.currentIndex) {
    state.currentIndex-- //位置向后偏移
    return
  }

  //删除当前选项卡
  if (target == state.currentIndex) {
    //位置向后偏移
    if (target == lastIndex) state.currentIndex--
    else state.currentIndex = target //位置不偏移(当前元素已删除),自动切换下一个元素
    router.replace(state.tabList[state.currentIndex].path)
  }
}

function tabClick(index) {
  state.currentIndex = index
  const currentTab = state.tabList[index]
  router.replace(currentTab.path)
}

function srollTo(tag) {
  nextTick(() => {
    const target = document.getElementById(tag)
    if (!target) return
    target.parentNode.scrollLeft = target.offsetLeft - 20 //因为有左右padding所以减去20
  })
}

function watchCurrentRoute(newVal, _) {
  if (newVal && !state.tabList.some((el) => el.title === newVal.title)) {
    state.tabList.push(newVal)
  }

  state.currentIndex = state.tabList.findIndex((el) => el.title === newVal.title)
}

function watchCurrentIndex(newVal, _) {
  srollTo(`appTabItem${newVal}`)
}

function watchRoutesArr(newVal, oldVal) {
  if (oldVal && newVal.length === oldVal.length) return
  affixRoutes = []
  let addArr = []
  newVal.forEach((el) => recursionRoutes(el))
  affixRoutes.forEach((el) => {
    if (!state.tabList.some((tb) => tb.title === el.title)) addArr.push(el)
  })

  const first = state.tabList.filter((el) => el.affix)
  const second = state.tabList.filter((el) => !el.affix)
  state.tabList = [...first, ...addArr, ...second]
}

function recursionRoutes(val) {
  const { path: rootPath, children, meta } = val
  if (meta && meta.affix) affixRoutes.push({ ...meta, path: rootPath })
  if (!children) return
  children.forEach((el) => {
    let basePath = el.path ? `${rootPath}/${el.path}` : rootPath
    recursionRoutes({ path: basePath, meta: el.meta, children: el.children })
  })
}

watch(() => state.currentIndex, watchCurrentIndex)
watch(() => [...routesArr.value], watchRoutesArr, { deep: true, immediate: true })
watch(() => ({ ...currentRoute.value }), watchCurrentRoute, { deep: true, immediate: true })
</script>

<style lang="scss" scoped>
.tab-scrollbar {
  margin: 0 var(--app-content-gap);
  height: var(--app-bar-height);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  background-color: var(--app-content-bg-color);

  --tab-item-active-color: #1677ff;

  .tab-item {
    border-radius: 6px;
    height: 30px;
    cursor: pointer;
    color: var(--app-content-text-color);
    margin-right: 6px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    padding: 0 8px;
    justify-content: space-between;
    user-select: none;
    background-color: #ffffff;
    border: 1px solid var(--app-content-border-color);

    .title {
      font-size: 14px;
    }

    .close-icon {
      margin-left: 8px;
      width: 13px;
      height: 13px;
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      color: var(--app-content-text-color);

      svg {
        width: 100%;
        height: 100%;
      }
    }
  }

  .active {
    color: var(--tab-item-active-color);

    .close-icon {
      color: var(--tab-item-active-color);
    }
  }

  &::-webkit-scrollbar {
    width: 6px; /* 宽度 */
    height: 6px; /* 高度 */
  }

  &::-webkit-scrollbar-track {
    background-color: #fcfcfc; /* 淡色轨道背景 */
    border-radius: 5px; /* 圆角 */
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ddd; /* 淡色滑块 */
    border-radius: 5px; /* 圆角 */
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #ccc; /* 更淡的悬停颜色 */
  }

  &::-webkit-scrollbar-thumb:active {
    background-color: #bbb; /* 最淡的滑动颜色 */
  }
}
</style>
