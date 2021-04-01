import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Router, Route, Switch } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import history from '../Utilities/history'

import ChatWithMePage from './ChatWithMePage'
import DirectChatsPage from './DirectChatsPage'
import ChatTutorial from './ChatTutorial'
import HomePage from './HomePage'

class RootPage extends Component {
  render() {    
    return (
      <Router history={history}>
        <Switch>
          <Route path='/with_me' component={ChatWithMePage} />
          <Route path='/direct' component={DirectChatsPage} />
          <Route path='/tutorial' component={ChatTutorial} />
          <Route path='/:id' component={HomePage} />
          <Route path='/' component={HomePage} />
        </Switch>
      </Router>
    )
  }
}

function mapStateToProps(state){
  return { accounts: state.accounts }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RootPage)
