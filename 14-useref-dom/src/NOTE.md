# 14 useRef

useRef类似于React.createRef.
使用场景：1.绑定DOM.  2.父组件拿到子组件的方法。

# 踩坑总结
1.useRef是一个方法，可以保存任何类型的值:dom、对象等任何**可变值**，且useRef返回一个可变的ref对象，initialValue被赋值给其返回值的.current对象。
正如官网说的, 它像一个变量, 类似于 this , 它就像一个盒子, 你可以存放任何东西，.current属性保存着一个可变值“盒子”，useRef 可以很好的解决闭包带来的不方便性。
2.createRef 每次渲染都会返回一个新的引用，而 useRef 每次都会返回相同的引用。useRef会在每次渲染时返回同一个ref对象，即返回的ref对象在组件的整个生命周期内保持不变。自建对象每次渲染时都建立一个新的。
3.ref对象的值发生改变之后，不会触发组件重新渲染。useRef 并不会通知我们。变更 .current 属性不会引发组件重新渲染。如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用回调 ref 来实现。
4.组件内部的任何函数，包括事件处理函数和 effect，都是从它被创建的那次渲染中被「看到」的。每次渲染都是独立的。

- 使用useRef自定义一个HOOK——useUpdate，返回一个布尔值来判断是首次渲染还是后续渲染。
```jsx
function demo () {
  const [count, setCount] = useState(0);

  const update = useUpdate()
  // 返回一个布尔值
  console.log(update, '是否更新')

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => {setCount(count+1)}}>+</button>
    </div>
  )
}
// 初始值设置为false,当值变化触发useEffect时设置为true.
// 
function useUpdate () {
  const ref = useRef(false)
  useEffect(() => {
    ref.current = true
  })
  return ref.current
}
```

- 封装一些常用的生命周期
```jsx

const useEffectOnce = (effect: EffectCallback) => {
  useEffect(effect, []);
};

export default useEffectOnce;



```
```jsx
import { useRef } from 'react';

export function useFirstMountState(): boolean {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;// 设置一个标志位，只进来第一次返回true，
    // 后面直接返回初始挂载的值。
    return true;
  }

  return isFirst.current;
}
```


// 当更新状态的时候, React 会重新渲染组件, 每一次渲染都会拿到独立的状态,
// 在useEffect第一个参数中将每次的独立状态赋值给这个引用就能拿到上个阶段的状态变量，
// 然后返回即可。





```jsx

 function usePrevious<T>(state: T): T | undefined {
  const ref = useRef<T>();

useEffect(() => {
    ref.current = state;
  });

  return ref.current;
}
```
```jsx

function Example () {
  const [count, setCount] = useState(0);

  const prevCount = usePrevious(count)
  console.log(prevCount, count, '之前的状态和现在的状态')
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => {setCount(count+1)}}>+</button>
    </div>
  )
}
function usePrevious (value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

```

- 如何拿到最新的值？
先将value用useRef包裹起来，赋值到ref，然后将value给到.current属性，返回这个引用对象
因为该对象可变，所以可以拿到实时的值。

```jsx
const useLatest = <T>(value: T): { readonly current: T } => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};

export default useLatest;
```

// 例子：从某些异步回调中读取最新的 state，用一个 ref 来保存，修改，并从中读取这个状态值。
// 要拿到最新的状态，则包裹时要传入一个初始值。
```jsx
function Example () {
  const [count, setCount] = useState(0);
  const ref = useRef(0)

  function handleAlertClick () {
    setTimeout(() => {
      console.log(ref.current)
    }, 3000)
  }

  function increment () {
    let newCount = count + 1;
    setCount(newCount)
    ref.current = newCount
  }

  return (
    <div>
      <div>{count}</div>
      <button onClick={increment}>+</button>
      <button onClick={handleAlertClick}>点击</button>
    </div>
  )
}
```