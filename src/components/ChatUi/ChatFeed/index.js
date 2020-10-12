import React, { Component } from 'react'

import Title from './TitleSection'
import { Loading, AuthFail, Welcome } from './Steps'

import Message from './Message'
import MessageForm from './MessageForm'

import _ from 'lodash'
import { animateScroll } from "react-scroll"

export default class ChatList extends Component {
    state = {
        duration: 0
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ duration: 100 })
        }, 3000); // Once the chat loads, start animating
    }

    renderMessages() {
        const { messages, chats, chatId } = this.props
        const chat = chats && chats[chatId]
        const keys = Object.keys(messages)

        return keys.map((key, index) => {
            const message = messages[key]
            const lastMessageKey = index == 0 ? null : keys[index - 1]
            const nextMessageKey = index == keys.length - 1 ? null : keys[index + 1]
            
            return (
                <Message 
                    key={`message_${index}`} 
                    chat={chat} 
                    message={message} 
                    creds={this.props.creds} 
                    lastMessage={messages[lastMessageKey]}
                    nextMessage={messages[nextMessageKey]}
                />
            )
        })
    }

    scrollToBottom() {
        animateScroll.scrollToBottom({
            duration: this.state.duration,
            containerId: "feed-container"
        })
    }

    componentDidUpdate(){
        this.scrollToBottom()
    }

    render() {
        const { chats, creds, chatId } = this.props
        const chat = chats && chats[chatId] 

        if(creds === null) { 
            return <Loading />
        }

        if(creds === undefined) {
            return <AuthFail />
        }

        if(creds && chats !== null && _.isEmpty(chats)) {
            return <Welcome />
        }

        return (
            <div style={{ display: 'flex', maxHeight: '100vh', backgroundColor: '#f0f0f0' }}>

                <Title chat={chat} />

                <div style={ styles.feedContainer } id='feed-container'>

                    <div style={{ height: '88px' }} />

                    { this.renderMessages() }

                    <div id='feet-bottom' style={{ height: '42px' }} />

                </div>

                <MessageForm chatId={chatId} creds={creds} />

            </div>
        )
    }
}
const styles = {
    feedContainer: { 
        position: 'absolute', 
        top: '0px', 
        height: '100%', 
        width: '100%', 
        overflow: 'scroll',
        backgroundColor: 'white'
    }
}