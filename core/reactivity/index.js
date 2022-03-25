let currentEffect;
class Dep {
  // effect 桶
  constructor(value) {
    this.effects = new Set();
    this._value = value;
  }
  get value() {
    this.depend();
    return this._value;
  }
  set value(newValue) {
    this._value = newValue;
    this.notice();
  }
  // 依赖收集
  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect);
    }
  }
  // 依赖触发
  notice() {
    this.effects.forEach((effect) => effect());
  }
}

export function effectWatch(effect) {
  currentEffect = effect;
  effect();
  currentEffect = null;
}

// 模拟ref
// let dep1 = new Dep(2);
// let res1;
// effectWatch(() => {
//   res1 = dep1.value + 1;
//   console.log(res1);
// });
// dep1.value = 3;

let targetsMap = new Map();
function getDep(target, key) {
  let depsMap = targetsMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetsMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}
export function reactive(target) {
  return new Proxy(target, {
    get: function (target, key) {
      // target -> deps, key -> dep, dep.depend
      const dep = getDep(target, key);
      dep.depend();
      return Reflect.get(target, key);
    },
    set: function (target, key, value) {
      const dep = getDep(target, key);
      const result = Reflect.set(target, key, value);
      dep.notice();
      return result;
    },
  });
}

// let obj = reactive({ value: 5 });
// let res;
// effectWatch(() => {
//   res = obj.value + 1;
//   console.log(res);
// });
// obj.value = 10;
