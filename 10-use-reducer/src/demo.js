import React from "react";

const userInfoReducer = (state, action) => {
  switch (action.type) {
    case "setusername":
      return {
        ...state,// 先复制之前的状态
        name: action.payload // 覆盖name的值
      };
    case "setlastname":
      return {
        ...state,
        lastname: action.payload
      };
    default:
      return state;
  }
};

export const MyComponent = () => {
  const [reducer, dispatch] = React.useReducer(userInfoReducer, {
    name: "John",
    lastname: "Doe"
  });

  return (
    <>
      <h3>
        {reducer.name} {reducer.lastname}
      </h3>
      <EditUsername name={reducer.name} dispatch={dispatch} />
      <input
        value={reducer.lastname}
        onChange={e =>
          dispatch({
            type: "setlastname",
            payload: e.target.value
          })
        }
      />
    </>
  );
};

const EditUsername = React.memo(props => {
  console.log(
    "Hey I'm only rerendered when name gets updated, check React.memo"
  );

  return (
    <input
      value={props.name}
      onChange={e =>
        props.dispatch({
          type: "setusername",
          payload: e.target.value
        })
      }
    />
  );
});
