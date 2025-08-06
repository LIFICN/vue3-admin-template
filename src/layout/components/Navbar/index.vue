<template>
  <div class="nav-bar">
    <div class="left-slot">
      <slot name="leftSlot" />
    </div>

    <div class="right-slot">
      <span class="username">用户名：{{ store.usernameGetter }}</span>
      <span class="sign-out" @click="logout">注 销</span>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

const store = useUserStore()
const router = useRouter()

function logout() {
  store.logout().then(() => {
    router.replace('/login')
  })
}
</script>

<style lang="scss" scoped>
$appHeaderHeight: var(--app-bar-height);
$appHeaderBg: var(--app-content-bg-color);

.nav-bar {
  height: $appHeaderHeight;
  width: 100%;
  background-color: $appHeaderBg;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--app-content-text-color);
  padding: 0 var(--app-content-gap);
  overflow: hidden;
  box-sizing: border-box;

  .right-slot {
    font-size: 16px;
    display: flex;
    align-items: center;

    .username {
      font-size: 14px;
      margin: 0 16px;
      display: inline-block;
    }

    .sign-out {
      display: inline-block;
      color: inherit;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      padding: 3px;

      &:hover {
        color: #1677ff;
        background-color: rgba($color: #1677ff, $alpha: 0.083);
      }
    }
  }
}
</style>
