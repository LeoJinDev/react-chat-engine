import React, { Component } from 'react'

import { stringToColor } from '../../Utilities/colorMapping' 


export default class Avatar extends Component {
    state = { avatar: '' } // State to avoid rerendering

    componentDidUpdate() {
        const avatar = this.props.person ? this.props.person.avatar : undefined
        if (avatar && avatar.split('?')[0] !== this.state.avatar.split('?')[0]) {
            this.setState({ avatar })
        }
    }

    render() {
        const { person } = this.props
        const customStyle = this.props.style ? this.props.style : {}
        const text = person.username ? person.username.substring(0, 2).toUpperCase() : ''
        const color = stringToColor(person ? person.username : '')    
                
        return (
            <div>

                {
                    this.props.show_online !== false && 
                    <div  
                        style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '100%', 
                            position: 'absolute', 
                            border: '2px solid white',
                            backgroundColor: person.is_online ? '#52c41a' : '#f5222d' 
                        }} 
                    />
                }

                <div style={{ 
                    ...styles.avatar, 
                    ...customStyle, 
                    ...{ 
                        backgroundColor: this.state.avatar ? 'white' : color,
                        backgroundImage: this.state.avatar && `url(${this.state.avatar})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: '48px'
                    }
                }}>
                    
                    <div style={{ color: 'white', paddingTop: '12px', fontSize: '15px', fontWeight: '600' }}>
                    
                        { !this.state.avatar && text }
                    
                    </div>
                
                </div>
            </div>
        )
    }
}

const styles = {
    avatar: {
        width: '44px',
        height: '44px',
        borderRadius: '22px',
        color: 'white',
        textAlign: 'center',
    }
}