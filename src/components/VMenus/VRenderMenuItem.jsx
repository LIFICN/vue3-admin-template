import { defineComponent, computed } from 'vue'
import VMenuItem from './VMenuItem.vue'
import VSubmenu from './VSubmenu.vue'
import { useInjectMeuns } from './hooks'
import VMenusToolTip from './VMenusToolTip.vue'

const RenderMenuItem = defineComponent({
  props: {
    item: {
      type: Object, //item数据对象
      default: function () {
        return {}
      },
    },
  },
  setup(props) {
    const menuItemData = props.item
    const { treeParentMap } = useInjectMeuns()
    const hasChildren = computed(() => menuItemData.children && menuItemData.children.length > 0)
    const isFirstLevel = computed(() => (treeParentMap.value[menuItemData.key] ? false : true))

    const meunItemFuc = () => <VMenuItem item={menuItemData} />
    const submenuItemFuc = () => (
      <VSubmenu item={menuItemData}>
        {{
          default: () => menuItemData.children?.map((it) => <RenderMenuItem key={it.key} item={it} />),
        }}
      </VSubmenu>
    )

    if (isFirstLevel.value) {
      return () => (
        <VMenusToolTip item={menuItemData} showMenu={hasChildren.value} showLabel={!hasChildren.value} toBody={true}>
          {{ default: () => (!hasChildren.value ? meunItemFuc() : submenuItemFuc()) }}
        </VMenusToolTip>
      )
    }

    return () => (!hasChildren.value ? meunItemFuc() : submenuItemFuc())
  },
})

export default RenderMenuItem
