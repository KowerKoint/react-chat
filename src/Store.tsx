import React from "react";
import io, { Socket } from "socket.io-client";

export type TChatItemState = {
  from: string,
  msg: string,
  topic: string
};

export type TChatState = {
  [key in string]: TChatItemState[];
};

export type TState = {
  allChats: TChatState,
  sendChatAction: (value: TChatItemState) => void,
  user: string
};

export type TActions = {
  type: "RECEIVE_MESSAGE",
  payload: {
    from: string,
    msg: string,
    topic: string
  }
}

let socket: Socket;

function sendChatAction(value: TChatItemState) {
  socket.emit('chat message', value);
}

const defaultItemStateArray: TChatItemState[] = [];
const defaultAllChats: TChatState = {defaultItemStateArray};
export const CTX = React.createContext<TState>({
  allChats: defaultAllChats,
  sendChatAction: sendChatAction,
  user: ""
});

const initState = {
  general: [
    {from: "Alex", msg: "Hello", topic:"general"}
  ],
  topic2: [
  ]
};

function reducer(state: TChatState, action: TActions) {
  console.log("state: " + JSON.stringify(state));
  console.log("action: " + JSON.stringify(action));
  const {from, msg, topic} = action.payload;
  switch (action.type) {
    case 'RECEIVE_MESSAGE':
      const res =  {
        ...state,
        [topic]: [
          ...state[topic],
          {from, msg, topic}
        ]
      };
      console.log(JSON.stringify(res));
      return res;
    default:
      return state;
  }
}

export default function Store(props: any) {
  const [allChats, dispatch] = React.useReducer(reducer, initState);

  if(!socket) {
    socket = io(':3001');
    socket.on('chat message', function(msg) {
      console.log(msg);
      dispatch({type: 'RECEIVE_MESSAGE', payload: msg});
    })
  }
  
  const user = "aaron" + (Math.random() * 100).toFixed(2);
  return (
    <CTX.Provider value={{allChats, sendChatAction, user}}>
      {props.children}
    </CTX.Provider>
  );
}