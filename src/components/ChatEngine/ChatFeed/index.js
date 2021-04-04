import React, { useContext, useState, useEffect, useRef } from 'react'

import { ChatEngineContext } from '../../Context'

import { getMessages, readMessage } from '../../../actions/messages'

import { AuthFail, Loading, Welcome } from './Steps'

import ChatHeader from './ChatHeader'
import MessageBubble from './MessageBubble'
import NewMessageForm from './NewMessageForm'
import IsTyping from './IsTyping'

import _ from 'lodash'

import { animateScroll } from "react-scroll"

const initial = 66
let count = initial
const interval = 33

const ChatFeed = props => {
    const didMountRef = useRef(false)
    const [duration, setDuration] = useState(0)
    const [currentChat, setCurrentChat] = useState(null)
    const [currentTime, setCurrentTime] = useState(Date.now())
    const { 
        connecting, conn,
        chats, setChats,
        sendingMessages,
        messages, setMessages,
        activeChat, setActiveChat,
        typingCounter, setTypingCounter,
    } = useContext(ChatEngineContext)

    function onReadMessage(chat) {
        if (chats) {
            const newChats = {...chats}
            newChats[chat.id] = chat
            setChats(newChats)
        }
    }

    function onGetMessages(chatId, messages) {
        setMessages(_.mapKeys(messages, 'id'))

        if (messages.length > 0) {
            const message = messages[messages.length - 1]

            if (props.userName && props.userName !== message.sender_username) {
                readMessage(conn, chatId, message.id, (chat) => onReadMessage(chat))
            }
        }
        
        props.onGetMessages && props.onGetMessages(chatId, messages)
    }

    function loadMoreMessages() {
        if (conn && !props.activeChat && activeChat !== null && activeChat !== currentChat) {
            count = initial
            setCurrentChat(activeChat)
            getMessages(conn, activeChat, (chatId, messages) => onGetMessages(chatId, messages))

        } else if (conn && props.activeChat && props.activeChat !== currentChat) {
            count = initial
            setActiveChat(props.activeChat)
            setCurrentChat(props.activeChat)
            getMessages(conn, props.activeChat, (chatId, messages) => onGetMessages(chatId, messages))
        }
    }

    useEffect(() => {
        loadMoreMessages()
    }, [conn, activeChat, currentChat])

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true
            setTimeout(() => {
                setDuration(100)
            }, 3000)
            setInterval(() => {
                setCurrentTime(Date.now())
            }, 1000)

        } else {
            if(!_.isEmpty(messages)) { // TODO: Make more sophisticated
                animateScroll.scrollToBottom({
                    duration,
                    containerId: "ce-feed-container"
                })
            }
        }
    })

    function renderTypers() {
        const typers = typingCounter && typingCounter[activeChat] ? typingCounter[activeChat] : []

        if (props.renderIsTyping) {
            return props.renderIsTyping(typers)
        }

        return Object.keys(typers).map((username, index) => {
            if (username !== props.userName && currentTime < typers[username]) {
                return <IsTyping key={`typer_${index}`} username={username} />
            } else {
                return <div key={`typer_${index}`} />
            }
        })
    }

    function renderMessages() {
        const chat = chats && chats[activeChat]
        const keys = Object.keys(messages)
        
        return keys.map((key, index) => {
            const message = messages[key]
            const lastMessageKey = index === 0 ? null : keys[index - 1]
            const nextMessageKey = index === keys.length - 1 ? null : keys[index + 1]

            if (props.renderMessageBubble) {
                return (
                    <div key={`message_${index}`}>
                        { 
                            props.renderMessageBubble(
                                conn, 
                                chat, 
                                messages[lastMessageKey], 
                                message, 
                                messages[nextMessageKey]
                            ) 
                        }
                    </div>
                )
            }
            
            return (
                <MessageBubble 
                    key={`message_${index}`}
                    chat={chat}
                    message={message}
                    lastMessage={messages[lastMessageKey]}
                    nextMessage={messages[nextMessageKey]}
                />
            )
        })
    }

    function renderSendingMessages() {
        const keys = Object.keys(sendingMessages)
        const chat = chats && chats[activeChat]

        return keys.map((key, index) => {
            const message = sendingMessages[key]
            const lastMessageKey = index === 0 ? null : keys[index - 1]
            const nextMessageKey = index === keys.length - 1 ? null : keys[index + 1]

            if(message && message.chat === activeChat) {
                return (
                    <MessageBubble 
                        sending
                        key={`sending-msg-${index}`}
                        chat={chat}
                        message={message}
                        lastMessage={sendingMessages[lastMessageKey]}
                        nextMessage={sendingMessages[nextMessageKey]}
                    />
                )
            }
        })
    }

    const chat = chats && chats[currentChat] 

    if(props.renderChatFeed) return props.renderChatFeed(props)

    if(conn === undefined) return <AuthFail />

    if(conn && chats !== null && _.isEmpty(chats)) return <Welcome />

    return (
        <div 
            className='ce-chat-feed'
            style={{ height: '100%', maxHeight: '100vh', backgroundColor: '#f0f0f0' }}
        >
            { connecting && <Loading /> }

            { props.renderChatHeader ?  props.renderChatHeader(chat) : <ChatHeader /> }

            <div
                id='ce-feed-container'
                style={styles.feedContainer} 
                className='ce-chat-feed-container'
            >
                <div style={{ height: '88px' }} className='ce-feed-container-top' />

                { renderMessages() }

                { renderSendingMessages() }

                { renderTypers() }

                <div style={{ height: '54px' }} className='ce-feed-container-bottom' />
            </div>

            { props.renderNewMessageForm ? props.renderNewMessageForm(props, currentChat) : <NewMessageForm /> }
        </div>
    )
}

export default ChatFeed

const styles = {
    feedContainer: { 
        width: '100%',
        height: '100%',
        maxHeight: '100vh',
        overflowX: 'hidden',
        overflowY: 'scroll',
        backgroundColor: 'white',
    }
}