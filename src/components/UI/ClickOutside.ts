import {
  defineComponent,
  VNode,
  Text,
  Comment,
  cloneVNode,
  shallowRef,
  onMounted,
  onBeforeUnmount
} from 'vue'

/**
 * コメントや文字列のVNodeを取り除く
 */
const filterChildren = <T extends VNode>(vnodes: T[]) =>
  vnodes.filter(vnode => {
    if (vnode.type === Text) return false
    if (vnode.type === Comment) return false
    if (typeof vnode.type === 'object' && '__isFragment' in vnode.type)
      return false
    return true
  })

/**
 * そのデフォルトスロットに指定した要素の外でクリックされたときにclickOutsideイベントを発火する
 */
export default defineComponent({
  name: 'ClickOutside',
  emits: {
    clickOutside: (e: MouseEvent) => true
  },
  setup(props, { slots, emit }) {
    const element = shallowRef<Element>()

    const onClick = (e: MouseEvent) => {
      const ele = element.value
      if (!ele) return

      if (ele === e.target || e.composedPath().includes(ele)) {
        return
      }

      emit('clickOutside', e)
    }

    onMounted(() => {
      window.addEventListener('click', onClick, { capture: true })
    })
    onBeforeUnmount(() => {
      window.removeEventListener('click', onClick, { capture: true })
    })

    return () => {
      if (!slots['default']) {
        return null
      }

      const filtedChildren = filterChildren(slots['default']())
      if (filtedChildren.length > 1) {
        throw new Error(
          '<ClickOutside>のデフォルトスロットには一つの要素しか渡せません'
        )
      }
      if (!filtedChildren[0]) {
        // v-ifで非表示になっている場合はここに入る
        return null
      }

      const [firstChild] = filtedChildren
      return cloneVNode(firstChild, { ref: element })
    }
  }
})
