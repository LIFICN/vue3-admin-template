<template>
  <div
    :class="[
      'v-menu-item',
      { 'v-menu-item-active': isActiveMenuItem && !isSubmenuItem },
      { 'v-submenu-item-expand': expand && isSubmenuItem },
      { 'v-submenu-item-active': isSubmenuItem && isActiveSubmenuItem },
    ]"
    :style="{ 'padding-left': paddingLeftStyle, 'justify-content': collapse ? 'center' : '' }"
    @click.stop="menuClick"
    ref="vMenuItemRef"
  >
    <span class="v-menu-item-icon-wrap" v-if="slots.icon">
      <slots.icon :item="item" :active="mergeActive" />
    </span>

    <div class="v-menu-item-content" v-show="!collapse">
      <slots.label :item="item" :active="mergeActive" v-if="slots.label" />
      <span v-else>{{ item.label }}</span>
    </div>

    <i class="v-submenu-item-arrow" v-if="!collapse && isSubmenuItem">
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
import { computed, nextTick, shallowRef, watch } from 'vue'
import { useInjectMeuns } from './hooks'

const emits = defineEmits(['update:expand'])

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
  expand: {
    type: Boolean,
    default: false,
  },
})

const vMenuItemRef = shallowRef(null)
const { collapse, activeKey, menuItemClick, treeParentMap, slots } = useInjectMeuns()

const isSubmenuItem = computed(() => props.type == 'submenuItem')
const paddingLeftStyle = computed(() => {
  const count = treeParentMap.value[props.item.key]?.length + 1 || 1
  return count * 16 + 'px'
})

const isActiveSubmenuItem = computed(() => {
  return treeParentMap.value[activeKey.value]?.some((k) => k.key === props.item.key) || false
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
  else expandMenu()
}

function expandMenu() {
  if (collapse.value) return
  emits('update:expand', !props.expand)
}

watch(
  () => [collapse.value, isActiveSubmenuItem.value],
  () => {
    if (!isSubmenuItem.value) return
    //如果是选中二级菜单，主菜单未被折叠，则展开二级菜单
    if (isActiveSubmenuItem.value && !collapse.value) {
      emits('update:expand', true)
      return
    }

    //如果是未选中二级菜单，主菜单未被折叠，则折叠二级菜单
    // if (!isActiveSubmenuItem.value && !collapse.value) {
    //   emits('update:expand', false)
    //   return
    // }

    //如果主菜单折叠则关闭已展开二级菜单
    if (collapse.value && props.expand) emits('update:expand', false)
  },
  { immediate: true },
)

watch(
  () => props.item.label,
  () => {
    nextTick(() => {
      if (vMenuItemRef.value) {
        //解决宽度动画影响的文本动态高度换行问题
        vMenuItemRef.value.style.maxHeight = `${vMenuItemRef.value.offsetHeight}px`
      }
    })
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.v-menu-item {
  display: flex;
  align-items: center;
  color: var(--menuText);
  min-height: 40px;
  box-sizing: border-box;
  padding: 0 16px;
  border-radius: 8px;
  margin-bottom: 4px;
  cursor: pointer;
  transition: background-color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  position: relative;
  overflow: hidden;

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
    white-space: normal;
    // word-break: break-all; //会影响换行高度, 动画执行异常
  }
}

.v-submenu-item-arrow {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  will-change: transform;
  transition: transform 0.3s ease-in-out;

  svg {
    width: 100%;
    height: 100%;

    path {
      fill: var(--menuArrowColor);
    }
  }
}

.v-menu-item-active {
  background-color: var(--menuActiveBg) !important;
  color: var(--menuActiveText) !important;
}

.v-submenu-item-expand {
  .v-submenu-item-arrow {
    transform: rotateX(180deg);
  }
}

.v-submenu-item-active {
  color: var(--menuActiveText) !important;

  .v-submenu-item-arrow {
    svg {
      path {
        fill: var(--menuActiveArrowColor);
      }
    }
  }
}
</style>
