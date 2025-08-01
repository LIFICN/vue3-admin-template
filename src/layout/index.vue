<template>
  <div class="app-container">
    <div class="sidebarmenu-wrap" :style="{ width: sidebarWidth }">
      <Logo :collapse="collapse" />

      <i class="collapse-btn" @click.stop="setCollapse" :style="{ transform: collapse ? 'rotateY(180deg)' : '' }">
        <svg viewBox="0 0 1024 1024" aria-hidden="true">
          <path
            d="M707.323 960.556l56.093-54.503-403.917-392.469 403.917-392.475-56.093-54.502L247.32 513.584l460.004 446.972z m0 0z"
          ></path>
        </svg>
      </i>

      <div class="sidebarmenu-wrap-content">
        <VMenus :collapse="collapse" :active-key="activeKey" :list="menusList" @menu-item-click="menuItemClick">
          <template v-slot:icon="{ item, active }">
            <i
              :style="{ color: active ? '#1677ff' : 'inherit', width: '16px', height: '16px' }"
              v-if="item.icon == 'Polygon'"
            >
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" p-id="1473">
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

    <div class="main-container" :style="{ left: sidebarWidth, width: `calc(100% - ${sidebarWidth})` }">
      <Navbar />
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

<style lang="scss" scoped>
.app-container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;

  --app-content-bg-color: #fafbfc;
  --app-bar-height: 45px;

  .sidebarmenu-wrap {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    box-sizing: border-box;
    will-change: width;
    transition: width 0.26s ease-in-out;
    border-right: 1px solid rgba(5, 5, 5, 0.06);
    padding: 0 4px;

    .collapse-btn {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      position: absolute;
      top: 12px;
      right: -12px;
      z-index: 99;
      background-color: #ffffff;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.23);
      cursor: pointer;
      will-change: transform;
      transition: transform 0.3s;

      svg {
        width: 10px;
        height: 10px;

        path {
          fill: rgba(0, 0, 0, 0.6);
        }
      }
    }

    &-content {
      overflow-y: auto;
      height: calc(100% - 50px);
    }
  }

  .main-container {
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
    will-change: left;
    transition: left 0.26s ease-in-out;
    height: 100%;
  }
}
</style>
