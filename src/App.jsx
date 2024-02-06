import "./App.css"
import { useState, useEffect } from "react"
import "react-lazy-load-image-component/src/effects/blur.css"
import { GoHistory } from "react-icons/go"
import { AiOutlineUser } from "react-icons/ai"
import { RiRobot2Line } from "react-icons/ri"

const App = () => {
  const [value, setValue] = useState("")
    const [message, setMessage] = useState(null)
    const [previousChats, setPreviousChats] = useState([])
    const [currentTitle, setCurrentTitle] = useState(null)
    const [switc, setSwitc] = useState(false)


    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            getMessages()
        }
    }

    const handleClick = (uniqueTitle) => {
        setCurrentTitle(uniqueTitle)
        setMessage(null)
        setValue("")
    }

    const createNewChat = () => {
        setMessage(null)
        setValue("")
        setCurrentTitle(null)
    }

    const getMessages = async () => {
        setSwitc(true)
        const options = {
            method: "POST",
            body: JSON.stringify({
                message: value
            }),
            headers: {
                "Content-Type" : "application/json"
            }
        }
//
        try {
            const response = await fetch('https://ai-back-b0b674979905.herokuapp.com/api', options) //add website like and /completions
            const data = await response.json()
            setMessage(data.choices[0].message)
            setSwitc(false)
         } catch(error){
            console.error(error)
            console.log("nu mere")
        }
    }

    useEffect(() => {
    if(!currentTitle && value && message){
        setCurrentTitle(value)
    }
    if(currentTitle && value && message){
        setPreviousChats(prevChats => (
            [...prevChats, 
                {
                 title: currentTitle,
                 role: "user",
                 content: value
                },
                {
                 title: currentTitle,
                 role: message.role,
                 content: message.content
                }  
        ]))
        setValue("")
    }
    }, [message, currentTitle])

    const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
    const uniqueTitle = Array.from(new Set(previousChats.map(previousChat => previousChat.title )))


  return (
    <div className="chatGpt_main_container">

        <section className="sidebar">   
            <div className="sidebar_blur">
            <button onClick={createNewChat}>+ New Chat</button>
            <ul className="history">
                <div className="history_title">
                    <GoHistory/>
                    <p>HISTORY</p>
                </div>
              {uniqueTitle?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle.length > 17 ? uniqueTitle.slice(0, 17) +  "...": uniqueTitle}</li>)}
            </ul>   
            <nav>
                <p>Made by Fabian</p>
                </nav>
            </div>
        </section>

        <section className="main">
            <div className="main_blur">
          {!currentTitle && (
          <>
          <h1>Personal Assistant</h1>
          </>)}
            <ul className="feed">
            {currentChat?.map((chatMessage, index) => <div className="messages" key={index} style={{justifyContent: `${index % 2 === 0 ? "flex-end" : "flex-start"}`, animation: index % 2 === 0 ? "chatAnim 0.13s forwards" : "response 0.3s forwards"}} ><li className={chatMessage.role === "user" ? "user_question" : ""}>
                <p className="role" style={{margin: `${chatMessage.role === "user" ? "0 0 0 7px" : "0 10px 0 0"}`}}>{chatMessage.role === "user" ? <AiOutlineUser /> : <RiRobot2Line className="robot_icon"/>}</p> 
                <p>{chatMessage.content}</p>
            </li>
            </div>)}
            </ul>
            <div className="bottom-section">
                <div className="input_container">
                    <input 
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="search..."
                    onKeyDown={handleKeyDown} 
                    />
                    {!switc
                     ? <div id="submit" onClick={getMessages}>&#10148;</div>
                     : <i className="fa-solid fa-spinner fa-spin-pulse fa-lg" style={{color: "#3498DB"}}></i>
                    }
                </div>
                 <p className="info">Free Research Preview. 
            ChatGPT may produce inaccurate information about 
            people, places, or facts. ChatGPT May 24 Version
            </p>
            </div>
            </div>
        </section>
    </div>
  )
}
export default App