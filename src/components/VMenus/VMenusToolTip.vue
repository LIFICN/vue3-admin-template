<template>
  <i ref="slotRef" style="display: none"></i>
  <slot />

  <Teleport to="body" :disabled="!toBody">
    <VMenusTransition type="floating">
      <div
        class="v-menu-tooltip v-menus-color"
        ref="tooltipRef"
        v-show="mergeShow"
        @mouseenter="tooltipMouseEnter"
        @mouseleave="tooltipMouseLeave"
        @click="closeClick"
      >
        <div
          :class="[{ 'v-menu-tooltip-menus': showMenu }, { 'v-menu-tooltip-label': showLabel }]"
          v-if="isCreateContent"
        >
          <template v-if="showMenu">
            <VMenusToolTip
              v-for="it in item.children"
              :item="it"
              :key="it.key"
              :showMenu="it.children && it.children.length > 0"
            >
              <VFloatMenuItem :item="it" />
            </VMenusToolTip>
          </template>

          <span class="v-tooltip-label" v-else-if="showLabel">{{ item.label }}</span>
        </div>
      </div>
    </VMenusTransition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from 'vue'
import { useInjectMeuns, useFloatingPosition } from './hooks'
import VFloatMenuItem from './VFloatMenuItem.vue'
import VMenusTransition from './VMenusTransition.vue'

const props = defineProps({
  item: {
    type: Object,
    default: function () {
      return {}
    },
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
  showMenu: {
    type: Boolean,
    default: false,
  },
  toBody: {
    type: Boolean,
    default: false,
  },
})

const tooltipRef = ref('')
const slotRef = ref('')
const isMouseInSlot = ref(false)
const isCreateContent = ref(false)
const { collapse } = useInjectMeuns()
const [updatePosition] = useFloatingPosition(slotRef, tooltipRef)
const mergeShow = computed(() => collapse.value && (props.showLabel || props.showMenu) && isMouseInSlot.value)

onMounted(() => {
  slotRef.value = slotRef.value?.nextElementSibling
  slotRef.value?.addEventListener('mouseenter', slotMouseEnter)
  slotRef.value?.addEventListener('mouseleave', slotMouseLeave)
})

onBeforeUnmount(() => {
  slotRef.value?.removeEventListener('mouseenter', slotMouseEnter)
  slotRef.value?.removeEventListener('mouseleave', slotMouseLeave)
})

//清除掉mouse leave事件逻辑
const leaveTimer = ref(null)
const removeContentTimer = ref(null)

function slotMouseEnter() {
  resetLeaveTimer()
  isMouseInSlot.value = true
  if (collapse.value) updatePosition()
}

function slotMouseLeave() {
  startCloseTimeout()
}

function tooltipMouseEnter() {
  isMouseInSlot.value = true
  resetLeaveTimer()
}

function tooltipMouseLeave() {
  startCloseTimeout()
}

function closeClick() {
  isMouseInSlot.value = false
  leaveTimer.value = null
}

//解决两个元素切换触发mouse leave关闭弹窗的问题
function startCloseTimeout() {
  leaveTimer.value = setTimeout(() => {
    isMouseInSlot.value = false
    leaveTimer.value = null
  }, 300)
}

function resetLeaveTimer() {
  leaveTimer.value && clearTimeout(leaveTimer.value)
  leaveTimer.value = null
}

watch(
  () => mergeShow.value,
  (newVal) => {
    if (newVal) {
      //清除掉延时清除内容的定时器，并展示菜单内容
      removeContentTimer.value && clearTimeout(removeContentTimer.value)
      removeContentTimer.value = null
      isCreateContent.value = true
      return
    }

    //控制关闭动画时机，因为父元素内容是子元素撑开的
    nextTick(() => {
      removeContentTimer.value = setTimeout(() => (isCreateContent.value = false), 300)
    })
  },
)
</script>

<style lang="scss" scoped>
.v-menu-tooltip {
  position: absolute;
  z-index: 999;

  &-label {
    width: max-content;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px;
    border-radius: 4px;
    font-size: 14px;
  }

  &-menus {
    background-color: var(--menuBg);
    padding: 4px 4px 1px 4px;
    border-radius: 8px;
    white-space: nowrap;
    min-width: 160px;
    box-shadow:
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05);
    position: relative;

    &::before {
      position: absolute;
      content: ' ';
      background-color: transparent;
      width: 10px;
      height: 100%;
      display: block;
      left: -10px;
      top: 0;
    }
  }
}
</style>
