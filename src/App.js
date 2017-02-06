import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { addItem } from  './actions/items'

class App extends Component {
  handleOnClick(){
    this.props.store.dispatch(addItem())
  }
  render() {
    return (
      <div className="App">
          <button onClick={this.handleOnClick.bind(this)}>Click</button>
          <p> {this.props.items.length}</p>
      </div>
    );
  }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(App)

function mapStateToProps(state){
  return {items: state.items}
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({addItem: addItem}, dispatch)
}

export default connectedComponent;
