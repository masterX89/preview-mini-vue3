// n1: oldVnode
// n2: newVnode
export function diff(n1, n2) {
  if (n1.tag !== n2.tag) {
    const el = (n2.el = document.createElement(n2.tag))
    n1.el.replaceWith(el)
  } else {
    const el = (n2.el = n1.el)
    // props
    const { props: newProps } = n2
    const { props: oldProps } = n1
    // {id : 1 , class: 'test'} -> {id : 2, class: 'test'}
    // {id : 1 , class: 'test'} -> {id : 2, class: 'test', name: 'name'}
    if (newProps && oldProps) {
      Object.keys(newProps).forEach((key) => {
        const newProp = newProps[key]
        const oldProp = oldProps[key]
        if (newProp !== oldProp) {
          el.setAttribute(key, newProp)
        }
      })
    }
    // {id : 1 , class: 'test'} -> {id : 1}
    if (oldProps) {
      Object.keys(oldProps).forEach((key) => {
        if (!newProps[key]) {
          el.removeAttribute(key)
        }
      })
    }
    // children
  }
}

export function mountElement(vnode, container) {
  const { tag, props, children } = vnode
  // tag
  const el = (vnode.el = document.createElement(tag))
  // props
  if (props) {
    for (const key in props) {
      if (/^on/.test(key)) {
        const type = key.substring(2).toLowerCase()
        const listener = props[key]
        el.addEventListener(type, listener)
      } else {
        const value = props[key]
        el.setAttribute(key, value)
      }
    }
  }
  // children
  if (typeof children === 'string') {
    const textNode = document.createTextNode(children)
    el.append(textNode)
  } else if (Array.isArray(children)) {
    children.forEach((child) => mountElement(child, el))
  }
  // mount
  container.append(el)
}
