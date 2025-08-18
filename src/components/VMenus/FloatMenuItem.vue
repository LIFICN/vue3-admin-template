<template>
  <!-- 不使用click.stop，使事件冒泡到父级执行关闭悬浮窗 -->
  <div
    :class="[
      'v-menus-color',
      'v-float-menu-item',
      { 'v-float-menu-item-active': isActiveMenuItem && !isSubmenuItem },
      { 'v-float-submenu-item-active': isSubmenuItem && isActiveSubmenuItem },
    ]"
    :style="{ 'padding-left': paddingLeftStyle }"
    @click="menuClick"
  >
    <span class="v-float-menu-item-icon-wrap" v-if="slots.icon">
      <slots.icon :item="item" :active="mergeActive" />
    </span>

    <div class="v-float-menu-item-content">
      <slots.label :item="item" :active="mergeActive" v-if="slots.label" />
      <span v-else>{{ item.label }}</span>
    </div>

    <i class="v-float-submenu-item-arrow" v-if="isSubmenuItem">
      <svg viewBox="0 0 1024 1024">
        <path
          d="M512 693.333333c-14.933333 0-29.866667-4.266667-40.533333-14.933333l-277.33333399-234.666667c-27.733333-23.466667-29.866667-64-8.53333301-89.6 23.466667-27.733333 64-29.866667 89.6-8.53333299L512 546.133333l236.8-200.53333299c27.733333-23.466667 68.266667-19.19999999 89.6 8.53333299 23.466667 27.733333 19.19999999 68.266667-8.53333301 89.6l-277.33333399 234.666667c-10.666667 10.666667-25.6 14.933333-40.533333 14.933333z"
          fill="#999"
        ></path>
      </svg>
    </i>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useInjectMeuns } from './hooks'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
    required: true,
  },
  type: {
    type: String,
    default: '',
  },
})

const { activeKey, menuItemClick, treeParentMap, slots } = useInjectMeuns()

const isSubmenuItem = computed(() => props.item.children && props.item.children.length > 0)
const paddingLeftStyle = computed(() => 1 * 16 + 'px')

const isActiveSubmenuItem = computed(() => {
  return treeParentMap.value[activeKey.value]?.some((t) => t.key === props.item.key) || false
})

const isActiveMenuItem = computed(() => {
  return activeKey.value == props.item.key
})

const mergeActive = computed(() => {
  if (!isSubmenuItem.value) return isActiveMenuItem.value
  return isActiveSubmenuItem.value
})

function menuClick() {
  if (!isSubmenuItem.value) menuItemClick(props.item)
}
</script>

<style lang="scss" scoped>
.v-float-menu-item {
  display: flex;
  align-items: center;
  color: var(--menuText);
  height: 40px;
  box-sizing: border-box;
  padding: 0 16px;
  border-radius: 8px;
  margin-bottom: 4px;
  cursor: pointer;
  transition: background-color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  position: relative;

  &:hover {
    background-color: var(--menuHoverBg);
    color: var(--menuHoverText);
  }

  &-icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &-content {
    flex: 1;
    margin-left: 6px;
    font-size: 14px;
  }
}

.v-float-submenu-item-arrow {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transform: rotateZ(270deg);

  svg {
    width: 100%;
    height: 100%;

    path {
      fill: var(--menuArrowColor);
    }
  }
}

.v-float-menu-item-active {
  background-color: var(--menuActiveBg) !important;
  color: var(--menuActiveText) !important;
}

.v-float-submenu-item-active {
  color: var(--menuActiveText) !important;

  .v-float-submenu-item-arrow {
    svg {
      path {
        fill: var(--menuActiveArrowColor);
      }
    }
  }
}
</style>
