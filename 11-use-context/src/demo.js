import React from "react";
// 适合使用context的场景：
// 当数据流动超过两层时，简单的usestate传值比较麻烦，使用redux或者useReducer比较重，
// 可以忽略action(数据请求)和一些较复杂的业务逻辑时，
// 使用useState+useContext+createContext较好
// MyContext包含Provider和Consumer两个属性
const MyContext = React.createContext({
  username: "",
  setUsername: () => {}
});

// 父组件
export const MyContextProvider = props => {
  const [username, setUsername] = React.useState("John Doe");

  return (
    <MyContext.Provider value={{ username, setUsername }}>
      {props.children}
    </MyContext.Provider>
  );
};

export const MyComponent = () => {
  const myContext = React.useContext(MyContext);

  return (
    <>
      <h3>{myContext.username}</h3>
    </>
  )
}
