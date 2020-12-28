# 15.React.memo
memo接收两个参数，一个是组件，一个是函数。
这个函数就是定义了memo需不需要render的钩子。
比较前一次的props跟当前props，返回true表示不需要render。
类似于类组件的shouldComponentUpdate。


React.memo 为高阶组件。它与 React.PureComponent 非常相似，但它适用于函数组件，但不适用于 class 组件。

如果函数组件在给定相同 props 的情况下渲染相同的结果，那么可以通过将其包装在 React.memo 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。
```jsx
const MyComponent = React.memo(function MyComponent(props) {
  /* 只在props更改的时候才会重新渲染 */
});

function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
}
function MyComponent(props) {
     /* render using props */
}
export default React.memo(MyComponent, areEqual);
```


React.memo 仅检查 props 变更。如果函数组件被 React.memo 包裹，且其实现中拥有 useState 或 useContext 的 Hook，当 context 发生变化时，它仍会重新渲染。

默认情况下其只会对复杂对象做浅层对比，如果想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。

```jsx
const Memo = React.memo(SubComponent, (prevProps, nextProps) => 
  prevProps.name === nextProps.name
);

//页面调用
<div className="App">
  <Memo name={name} />
</div>
```
将函数抽离的例子：
```jsx
import React from "react";

function Child({seconds}){
    console.log('I am rendering');
    return (
        <div>I am update every {seconds} seconds</div>
    )
};

function areEqual(prevProps, nextProps) {
    if(prevProps.seconds===nextProps.seconds){
        return true
    }else {
        return false
    }

}
export default React.memo(Child,areEqual)

```
React.memo()大部分的使用场景是纯函数组件频繁渲染props,比如本文件夹的案例，在一定范围内，笑脸的弯曲程度不变，但是用户输入的阈值在一直变换，就可以使用memo包裹来减少多次频繁的渲染。



# useMemo

useMemo主要用来解决使用React hooks产生的无用渲染的性能问题
在方法函数，由于不能使用shouldComponentUpdate处理性能问题，react hooks新增了useMemo


useMemo使用方法：
如果useMemo(fn, arr)第二个参数匹配，并且其值发生改变，fn才会多次执行，否则fn只执行一次.
如果为空数组[]，fn只执行一次.

举例说明：

第一次进来时，控制台显示rich child，当无限点击按钮时，控制台不会打印rich child。
但是当改变props.name为props.isChild时，每点击一次按钮，控制台就会打印一次rich child


```jsx
export default () => {
	let [isChild, setChild] = useState(false);
 
	return (
		<div>
			<Child isChild={isChild} name="child" />
			<button onClick={() => setChild(!isChild)}>改变Child</button>
		</div>
	);
}
 
let Child = (props) => {
	let getRichChild = () => {
		console.log('rich child');
 
		return 'rich child';
	}
 
	let richChild = useMemo(() => {
		//name改变才执行相应的函数，打印rich child
		return getRichChild();
	}, [props.name]);
 
	return (
		<div>
			isChild: {props.isChild ? 'true' : 'false'}<br />
			{richChild}
		</div>
	);
}
```
