import React from 'react';
import { useState, useEffect } from "react";
import MessageBubble from './components/MessageBubble';
import axios from 'axios'



export default function App() {
    const [messageList,setMessageList] = useState([]);
    const [inputText,setInputText] = useState("");
    const [userList, setUserList] = useState([]);
    
    function onInput(event){
        setInputText(event.target.value)
    }
    function updateChat(){
        axios.get('http://localhost:3000/chat')
        .then(function (response) {
          let tempMessageList = [];
          let tempUserList = [];
          response.data.message.Items.forEach(element => {
              if(!tempUserList.includes(element.user['S'])){
                  tempUserList.push(element.user['S']);
                  console.log(element.user['S'])
                  console.log(tempUserList)
              }
              tempMessageList.push(<MessageBubble userIndex = {tempUserList.indexOf(element.user['S'])} key = {tempMessageList.length} text={element.message['S']}></MessageBubble>)
              console.log(element)
          });
          setMessageList(tempMessageList);
          setUserList(tempUserList)
        })
    }
    function onInputEnterPress(event){
        if(event.key === "Enter"){
            
            axios.post('http://localhost:3000/chat',{
                "roomId": "0",
                "user": userList[0],
                "message": event.target.value
            }).then(function (res) {
                updateChat();
            })
            setInputText("");
        }
    }
    useEffect(() => {
        updateChat();
    },[])
    return (
        <div>

            <h1>Chat</h1>
            <div className="chat-box" >
                {messageList}
            </div>
            <div style= {{height:'20px'}}></div>
            <input type="text" value={inputText} onChange={(event)=>onInput(event)} onKeyDown={(event)=> onInputEnterPress(event)}></input>
        </div>
    );
}