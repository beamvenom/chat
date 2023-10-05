import React from 'react';
import { useState, useEffect } from "react";
import MessageBubble from './components/MessageBubble';
import axios from 'axios'
import { CognitoJwtVerifier } from "aws-jwt-verify";

// Verifier that expects valid access tokens:


const clientId = '';
const clientSecret = '';
const userPoolId = "";
const body = `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
const url = `https://chatauth.auth.eu-west-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=${clientId}&redirect_uri=http://localhost:8080`

export default function App() {
    const [messageList,setMessageList] = useState([]);
    const [inputText,setInputText] = useState("");
    const [userList, setUserList] = useState([]);
    const [accessToken, setAccessToken] = useState("");
    
    function onInput(event){
        setInputText(event.target.value)
    }
    async function getAccessToken(){
        console.log(window.location.hash)
        let params = new URLSearchParams(window.location.hash.replace('#',''));
        let access_token = params.get('access_token');
        console.log(params)
        console.log(access_token)
        const verifier = CognitoJwtVerifier.create({
            userPoolId: userPoolId,
            tokenUse: "access",
            clientId: clientId,
        });
        try {
        const payload = await verifier.verify(access_token);
        console.log("Token is valid. Payload:", payload);
            setAccessToken(access_token);
        } catch {
        console.log("Token not valid!");
        }
    }
    async function getUser(){
        
        var auth = "Bearer " + accessToken
        console.log(auth)
        await axios.get("https://chatauth.auth.eu-west-1.amazoncognito.com/oauth2/userInfo",{
            headers: {
                "Content-Type":"application/json",
                "Authorization": auth
        }}).then((res)=> {
            console.log(res.data.username)
            setUserList([res.data.username])
        })
        
        
    }
    function login(){
        window.location.href = url;
    }
    function updateChat(){
        axios.get('http://localhost:3000/chat/0')
        .then(function (response) {
          let tempMessageList = [];
          let tempUserList = [...userList];
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
            
            axios.post('http://localhost:3000/chat/0',{
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
        getAccessToken();
    },[])
    return (
        <div>

            <h1>Chat</h1>
            <div className="chat-box" >
                {messageList}
            </div>
            <div style= {{height:'20px'}}></div>
            <input type="text" value={inputText} onChange={(event)=>onInput(event)} onKeyDown={(event)=> onInputEnterPress(event)}></input>
            <button onClick={()=>login()} >hej</button>
            <button onClick={()=>getAccessToken()} >acc</button>
            <button onClick={()=>updateChat()} >Enter Chat room</button>
            <button onClick={()=>getUser()} >user</button>
            <div>You are {userList[0]}</div>
            
        </div>
    );
}