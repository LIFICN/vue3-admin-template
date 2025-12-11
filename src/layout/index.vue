<template>
  <div class="app-container" :style="{ paddingLeft: sidebarWidth }">
    <div class="sidebarmenu-wrap" :style="{ width: sidebarWidth }">
      <Logo :collapse="collapse" />

      <div class="sidebarmenu-wrap-content">
        <VMenus :collapse="collapse" :active-key="activeKey" :list="menusList" @menu-item-click="menuItemClick">
          <template v-slot:icon="{ item, active }">
            <i
              :style="{ color: active ? '#1677ff' : 'inherit', width: '16px', height: '16px', lineHeight: '16px' }"
              v-if="item.icon == 'Polygon'"
            >
              <svg
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1473"
                style="height: 100%; width: 100%"
              >
                <path
                  d="M680.71 915.22H343.29c-39.53 0-76.37-21.27-96.12-55.52L78.46 567.49c-19.75-34.22-19.75-76.77 0-110.99l168.71-292.2c19.75-34.24 56.6-55.52 96.12-55.52h337.42c39.53 0 76.37 21.27 96.12 55.52l168.71 292.2c19.75 34.22 19.75 76.77 0 110.99L776.83 859.7c-19.75 34.24-56.59 55.52-96.12 55.52zM343.29 175.69c-15.7 0-30.35 8.43-38.21 22.04l-168.71 292.2c-7.84 13.61-7.84 30.52 0 44.13l168.71 292.2c7.86 13.61 22.51 22.04 38.21 22.04h337.42c15.7 0 30.35-8.43 38.21-22.04l168.71-292.2c7.84-13.61 7.84-30.52 0-44.13l-168.71-292.2c-7.86-13.61-22.51-22.04-38.21-22.04H343.29z"
                  fill="currentColor"
                  p-id="1474"
                ></path>
              </svg>
            </i>
          </template>
        </VMenus>
      </div>
    </div>

    <div class="main-container">
      <Navbar>
        <template #leftSlot>
          <i class="collapse-btn" @click.stop="setCollapse">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" p-id="33984">
              <path
                d="M163.108571 171.885714h697.782858A53.394286 53.394286 0 0 1 914.285714 225.28a53.76 53.76 0 0 1-53.76 54.125714H163.474286A53.76 53.76 0 0 1 109.714286 225.28 53.394286 53.394286 0 0 1 163.108571 171.885714z"
                fill="currentColor"
                p-id="33985"
              ></path>
              <path
                d="M163.474286 458.24h697.051428A53.76 53.76 0 0 1 914.285714 512a53.76 53.76 0 0 1-53.394285 53.394286H163.108571A53.76 53.76 0 0 1 109.714286 512a53.76 53.76 0 0 1 53.76-54.125714z"
                fill="currentColor"
                p-id="33986"
              ></path>
              <path
                d="M163.474286 744.594286h294.765714A53.76 53.76 0 0 1 512 798.72a53.394286 53.394286 0 0 1-53.394286 53.394286H163.108571A53.394286 53.394286 0 0 1 109.714286 798.72a53.76 53.76 0 0 1 53.76-54.125714z"
                fill="currentColor"
                p-id="33987"
              ></path>
            </svg>
          </i>
        </template>
      </Navbar>

      <TabsView />
      <AppMain />
    </div>
  </div>
</template>

<script setup>
import Logo from './components/Logo/index.vue'
import Navbar from './components/Navbar/index.vue'
import TabsView from './components/TabsView/index.vue'
import AppMain from './components/AppMain/index.vue'
import { useCollapse, useCovertRoutesToMenus } from './hooks'
import { useRouter, useRoute } from 'vue-router'
import { useRouteStore } from '@/store/route'
import { computed } from 'vue'

const [collapse, sidebarWidth, setCollapse] = useCollapse()
const store = useRouteStore()
const router = useRouter()
const route = useRoute()
const menusList = useCovertRoutesToMenus(store.routesGetter)
const activeKey = computed(() => route.path)

// const menuList = reactive([
//   {
//     key: '1',
//     label: '菜单1',
//   },
//   {
//     key: '2',
//     label: '菜单2',
//     children: [
//       {
//         key: '2-1',
//         label: '菜单2-1',
//       },
//       {
//         key: '2-2',
//         label: '菜单2-2',
//       },
//     ],
//   },
// ])

const menuItemClick = (menuItem) => {
  router.push(menuItem.key)
}
</script>

<style>
:root {
  --app-sidebar-bg-color: #fff;
  --app-content-bg-color: #fafbfc;
  --app-bar-height: 50px;
  --app-content-text-color: #78829d;
  --app-content-gap: 15px;
  --app-content-border-color: rgba(219, 223, 233, 0.6);
}

.v-menus-color {
  --menuBg: var(--app-sidebar-bg-color) !important;
}
</style>

<style lang="scss" scoped>
.app-container {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  position: relative;
  will-change: padding-left;
  transition: padding-left 0.26s ease-in-out;
  contain: layout paint;

  .sidebarmenu-wrap {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    box-sizing: border-box;
    will-change: width;
    transition: width 0.26s ease-in-out;
    border-right: 1px solid var(--app-content-border-color);
    contain: layout paint;
    background-color: var(--app-sidebar-bg-color);
    z-index: 99;

    &-content {
      overflow-y: auto;
      padding: 10px;
      height: calc(100% - var(--app-bar-height));
    }
  }

  .main-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    contain: layout paint;
    background-color: var(--app-content-bg-color);

    .collapse-btn {
      width: 18px;
      height: 18px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      svg {
        width: 100%;
        height: 100%;
        color: var(--app-content-text-color);
      }
    }
  }
}
</style>
