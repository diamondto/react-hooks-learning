# 11 useContext

适合使用context的场景：
当数据流动超过两层时，简单的usestate传值比较麻烦，使用redux或者useReducer比较重，
可以忽略action(数据请求)和一些较复杂的业务逻辑时，
使用useState+useContext+createContext较好.

# API用法

- Context 通过组件树提供了一个传递数据的方法，从而避免了在每一个层级手动的传递 props 属性。
- React.createContext：创建一个上下文的容器(组件), defaultValue可以设置共享的默认数据

```jsx
const {Provider, Consumer} = React.createContext(defaultValue);
```


- Provider(生产者): 用于生产共享数据的地方。value:放置共享的数据。
```jsx
<Provider value={/*共享的数据*/}>
    /*里面可以渲染对应的内容*/
</Provider>
```

- Consumer(消费者):专门消费供应商(Provider)的数据。Consumer需要嵌套在生产者下面。才能通过回调的方式拿到共享的数据源。当然也可以单独使用，但是只能消费到上文提到的defaultValue。
```jsx
<Consumer>
  {value => /*根据上下文  进行渲染相应内容*/}
</Consumer>
```
# 好处：
1.这和redux带来的效果是一样的，即维护了一个可以多个组件共用的状态。
2.和redux不同的是，它更灵活，想放在那里放在那里。
3.useContext也可以模拟Redux的方式，把上面的useState换成useReducer就可以了。然后像redux一样一个页面只维护一个状态，同时维护多个reducer。
4.把useState换成useRef也可以的，然后把结果赋给一个dom元素，这样就可以在一个组件中拿到另一个组件的dom元素。

```jsx
import React from "react";
// 定义一个 MyContext，也就是我们需要共享的状态context。
const MyContext = React.createContext({
  username: "",
  setUsername: () => {}
});

export const MyContextProvider = props => {
    // 把MyContext的初始化value设置为 一个useState可以控制的值。
  const [username, setUsername] = React.useState("John Doe");
// 把需要用到这个context的组件包裹起来，即props.children组件。
// 被MyContext所包裹的所有组件，包含所有嵌套组件，都可以拿到和修改这个状态，
// 当状态改变时，所有用到的组件都会重新渲染。
  return (
    <MyContext.Provider value={{ username, setUsername }}>
      {props.children}
    </MyContext.Provider>
  );
};
```

- 子组件使用：React.useContext
```jsx

export const MyComponent = () => {
  const myContext = React.useContext(MyContext);

  return (
    <>
      <h3>{myContext.username}</h3>
    </>
  )
}
```


- Let's instantiate the provider on top of our application.

_./src/index.js_

```diff
import React from "react";
import ReactDOM from "react-dom";
- import { MyComponent } from "./demo";
+ import { MyComponent, MyContextProvider } from "./demo";
import "./styles.css";

function App() {
  return (
+    <MyContextProvider>
    <div className="App">
      <MyComponent />
    </div>
+   </MyContextProvider>
  );
}
```

- Now let's create a _MyComponent_ component under _demo.js_
**append this to the existing content on _demo.js**

```jsx
export const MyComponent = () => {
  const myContext = React.useContext(MyContext);

  return (
    <>
      <h3>{myContext.username}</h3>
    </>
  )
}
```

- Now if we run the sample we will get the expected behavior.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
