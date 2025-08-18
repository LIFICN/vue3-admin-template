<template>
  <Transition
    name="v-collapse-transition"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="reset"
    @enter-cancelled="reset"
    @leave-cancelled="reset"
    v-if="type == 'collapse'"
  >
    <slot />
  </Transition>

  <Transition name="v-floating-transition" v-else-if="type == 'floating'">
    <slot />
  </Transition>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'collapse', //collapse, floating
  },
})

const reset = (el) => {
  el.style.maxHeight = ''
  el.style.overflow = el.dataset.oldOverflow
  el.style.paddingTop = el.dataset.oldPaddingTop
  el.style.paddingBottom = el.dataset.oldPaddingBottom
}

function beforeEnter(el) {
  if (!el.dataset) el.dataset = {}

  el.dataset.oldPaddingTop = el.style.paddingTop
  el.dataset.oldPaddingBottom = el.style.paddingBottom
  if (el.style.height) el.dataset.elExistsHeight = el.style.height

  el.style.maxHeight = 0
  el.style.paddingTop = 0
  el.style.paddingBottom = 0
}

function enter(el) {
  requestAnimationFrame(() => {
    el.dataset.oldOverflow = el.style.overflow
    if (el.dataset.elExistsHeight) {
      el.style.maxHeight = el.dataset.elExistsHeight
    } else if (el.scrollHeight !== 0) {
      el.style.maxHeight = `${el.scrollHeight}px`
    } else {
      el.style.maxHeight = 0
    }

    el.style.paddingTop = el.dataset.oldPaddingTop
    el.style.paddingBottom = el.dataset.oldPaddingBottom
    el.style.overflow = 'hidden'
  })
}

function afterEnter(el) {
  el.style.maxHeight = ''
  el.style.overflow = el.dataset.oldOverflow
}

function beforeLeave(el) {
  if (!el.dataset) el.dataset = {}
  el.dataset.oldPaddingTop = el.style.paddingTop
  el.dataset.oldPaddingBottom = el.style.paddingBottom
  el.dataset.oldOverflow = el.style.overflow

  el.style.maxHeight = `${el.scrollHeight}px`
  el.style.overflow = 'hidden'
}

function leave(el) {
  if (el.scrollHeight !== 0) {
    el.style.maxHeight = 0
    el.style.paddingTop = 0
    el.style.paddingBottom = 0
  }
}
</script>

<style lang="scss" scoped>
.v-collapse-transition-leave-active,
.v-collapse-transition-enter-active {
  will-change: max-height, padding-top, padding-bottom;
  transition:
    0.26s max-height ease-in-out,
    0.26s padding-top ease-in-out,
    0.26s padding-bottom ease-in-out;
}

.v-floating-transition-enter-active,
.v-floating-transition-leave-active {
  will-change: transform, opacity;
  opacity: 1;
  transform: scale(1, 1);
  transition:
    0.3s transform,
    0.3s opacity;
  transform-origin: top left;
}

.v-floating-transition-enter-from,
.v-floating-transition-leave-active {
  opacity: 0;
  transform: scale(0.45, 0.45);
}
</style>
