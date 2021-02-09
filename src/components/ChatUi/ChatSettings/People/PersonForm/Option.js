import React from 'react';

import Avatar from '../../../components/Avatar'


export default class Option extends React.Component {
    state = {
        focused: false
    }

    render() {
        return (
            <div 
                onMouseEnter={() => this.setState({ focused: true })}
                onMouseLeave={() => this.setState({ focused: false })}
                onClick={() => this.props.onClick && this.props.onClick()}
                style={{ ...styles.option, ...{ backgroundColor: this.state.focused ? '#f5f5f5' : 'white'} }}
            >
                <div>
                    <Avatar person={this.props.person} />
                </div>

                <div style={{ display: 'flex', padding: '12px 4px' }}>
                    {this.props.person.username}
                </div>
            </div>
        );
    }
}

const styles = {
  option: {
    padding: '4px 16px',
    cursor: 'pointer',
    fontSize: '15px',
    display: 'flex'
  },
}