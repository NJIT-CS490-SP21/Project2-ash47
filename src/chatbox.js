import { useState, useRef, useEffect } from 'react';
export function ChatBox(props)
{
    const inputRef = useRef(null);
    const [ chat, setChat ] = useState([]);
    
    function clickHandler()
    {
        const userChat = inputRef.current.value;
        
        if(userChat !== '')
        {
            setChat(prevList => [...prevList, (userChat + ' (' + props.user + ')')]);
            
            props.socket.emit('chat', {chat: (userChat + ' (' + props.user + ')')});
        }
    }
    
    useEffect(() => {
        props.socket.emit('currentChat', 'getChat');
        
        props.socket.on('currentChat', (data) => {
            console.log(data);
            
            setChat((prevData) => {
            let newBoard = [...prevData];
            newBoard = data.board;
            return newBoard;
            });
        });
        
    }, []);
    
    useEffect(() => {
        
        props.socket.on('chat', (data) => {
             setChat(prevList => [...prevList, data.chat ]);
        });
        
    }, []);
    
    return (
        <div>
            <div className="chat">
            {chat.map((item, index) => {
                
                return (
                    <div>
                        {item}
                    </div>
              );
            })}
            </div>
            <input className="chatInput" ref={inputRef} type="text" placeholder="User name...."/>
            <button className="chatButton" type="submit" onClick= {clickHandler}>Submit</button>
        </div>
    );
}