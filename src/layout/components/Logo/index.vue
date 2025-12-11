<template>
  <router-link :class="['sidebar-logo-wrap', { 'sidebar-logo-wrap-collapse': collapse }]" to="/">
    <img v-if="logo" :src="logo" class="sidebar-logo" />

    <Transition name="sidebarLogoTitleFade">
      <h1 v-if="!collapse" class="sidebar-logo-title">{{ title }}</h1>
    </Transition>
  </router-link>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
})

const title = ref('Vue3 Admin')
const logo = ref('https://unpkg.byted-static.com/latest/byted/arco-config/assets/favicon.ico')
</script>

<style lang="scss" scoped>
$sidebarBg: transparent;
$sidebarText: #666;

.sidebarLogoTitleFade-enter-active {
  transition: opacity 1s;
}

.sidebarLogoTitleFade-enter-from,
.sidebarLogoTitleFade-leave-to {
  opacity: 0;
}

.sidebar-logo-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  text-decoration: none;
  height: var(--app-bar-height);
  background-color: $sidebarBg;
  overflow: hidden;
  will-change: opacity;
  outline: none;

  .sidebar-logo {
    width: 30px;
    height: 30px;
    margin: 0 10px;
  }

  .sidebar-logo-title {
    display: inline-block;
    margin: 0;
    color: $sidebarText;
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
  }
}

.sidebar-logo-wrap-collapse {
  justify-content: center;

  .sidebar-logo {
    margin: 0px;
  }
}
</style>
