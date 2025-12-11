<template>
  <div class="v-menus-color v-menus">
    <!-- 递归菜单 -->
    <VRenderMenuItem v-for="(item, index) in list" :key="'rendermenuitem' + index" :item="item" />
  </div>
</template>

<script setup>
import VRenderMenuItem from './VRenderMenuItem.jsx'
import { provide, computed, ref, readonly, watch, useSlots } from 'vue'
import { useTreeToParentMap, useProvideMenusKey } from './hooks'

const emits = defineEmits(['menuItemClick'])

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
    required: true,
  },
  collapse: {
    type: Boolean,
    default: false,
  },
  activeKey: {
    typed: String,
    default: '',
  },
})

const rootSlots = useSlots()
const [treeParentMap] = useTreeToParentMap(props.list)
const provideKey = useProvideMenusKey()
const activeKey = ref('')

provide(provideKey, {
  collapse: computed(() => props.collapse),
  activeKey: readonly(activeKey),
  treeParentMap: readonly(treeParentMap),
  menuItemClick: menuItemClick,
  slots: rootSlots,
})

function menuItemClick(item) {
  emits('menuItemClick', item)
  setActiveKey(item.key)
}

function setActiveKey(val) {
  activeKey.value = val || ''
}

watch(
  () => props.activeKey,
  (newVal) => setActiveKey(newVal),
  { immediate: true },
)
</script>

<style>
.v-menus-color {
  --menuBg: #fff;
  --menuText: #333;
  --menuHoverBg: rgba(0, 0, 0, 0.06);
  --menuHoverText: #333;
  --menuArrowColor: #999;
  --menuActiveArrowColor: #1677ff;
  --menuActiveBg: #e6f4ff;
  --menuActiveText: #1677ff;
}
</style>

<style lang="scss" scoped>
.v-menus {
  background-color: var(--menuBg);
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  white-space: nowrap;
}
</style>
