import { effectWatch } from './reactivity/index.js'
import { diff, mountElement } from './renderer/index.js'
export function createApp(rootElement) {
  return {
    mount(rootContainer) {
      const context = rootElement.setup()
      // 引入 isMounted 和 preSubTree 两个状态
      let isMounted = false
      let preSubTree
      effectWatch(() => {
        // 区分 mounted | update
        if (!isMounted) {
          rootContainer.innerHTML = ``
          const subTree = rootElement.render(context)
          mountElement(subTree, rootContainer)
          // 记录状态
          isMounted = true
          preSubTree = subTree
        } else {
          const subTree = rootElement.render(context)
          // diff
          diff(preSubTree, subTree)
          // 记录状态
          preSubTree = subTree
        }
      })
    },
  }
}
