<template>
  <div class="v-submenu">
    <MenuItem :item="item" type="submenuItem" v-model:expand="expand" />

    <VMenusTransition>
      <div v-show="expand && !collapse">
        <slot />
      </div>
    </VMenusTransition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VMenusTransition from './VMenusTransition.vue'
import MenuItem from './MenuItem.vue'
import { useInjectMeuns } from './hooks'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
    required: true,
  },
})

const { collapse } = useInjectMeuns()
const expand = ref(false)
</script>

<style lang="scss" scoped>
.v-submenu {
  // background-color: rgba(0, 0, 0, 0.02);
  position: relative;
}
</style>
