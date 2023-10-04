import React from "react";
function getUserColor(listIndex){
    console.log(listIndex);
    switch(listIndex){
        case 0: 
            return 'lightblue';
        case 1:
            return 'lightpink';
        case 2: 
            return 'lightgreen';
    }
}
const MessageBubble = (props) => {
    console.log(props.text);
    if(props.userIndex === 0){
        return (<div  className="message-bubble" style={{backgroundColor: getUserColor(props.userIndex)}}>
        {props.text}
    </div>)
    } else{
        return (<div  className="message-bubble" style={{backgroundColor: getUserColor(props.userIndex), marginLeft: 'auto',  marginRight:'0'}}>
        {props.text}
    </div>)
    }
    
}
export default MessageBubble;