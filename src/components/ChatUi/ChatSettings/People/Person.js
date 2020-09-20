import React, { Component } from 'react'

import { removePerson } from 'react-chat-engine'

import Avatar from '../../components/Avatar'
import { Button } from '../../components/Button'

export default class Person extends Component {
    state = {
        selected: false
    }

    onRemovePerson() {
        removePerson(
            this.props.creds,
            this.props.chat.id,
            this.props.person.person
        )
    }

    render() {
        const { person, chat, creds } = this.props

        if (!person) { return <div /> }

        return (
            <div 
                onMouseEnter={() => this.setState({ selected: true })}
                onMouseLeave={() => this.setState({ selected: false })}
            >

                <div style={{ padding: '2px', height: '0px' }}>
                    
                    <Avatar text={person.person} />

                </div>

                <div style={{ paddingLeft: '52px', height: '44px', position: 'relative', top: '10px' }}>

                    { person.person }

                </div>

                {
                    this.state.selected && (creds.userName === chat.admin) &&
                    <div style={{ float: 'right', height: '0px', position: 'relative', bottom: '44px'}}>

                        <Button 
                            theme='danger'
                            icon='delete'
                            onClick={() => this.onRemovePerson()}
                        />

                    </div>
                }
            </div>
        )
    }
}
