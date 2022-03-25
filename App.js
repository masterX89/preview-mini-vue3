import { reactive } from './core/reactivity/index.js'
import { h } from './core/h.js'

export default {
  setup() {
    const num = reactive({ value: 5 })
    const tag = reactive({ value: 'div' })
    const nodeProps = reactive({
      id: 'div' + num.value,
      class: 'div-class',
      onClick: () => {
        alert('onClick')
      },
    })
    window.num = num
    window.tag = tag
    window.nodeProps = nodeProps
    return {
      num,
      tag,
      nodeProps,
    }
  },
  render(context) {
    const { num, tag, nodeProps } = context
    return h(tag.value, { ...nodeProps }, [
      h('div', null, String(context.num.value)),
      h('p', null, 'test'),
    ])
  },
}
