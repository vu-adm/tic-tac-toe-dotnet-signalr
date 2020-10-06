import React from 'react';
import logo from '../../assets/logo.svg';
import './App.css';
import { TicTacToe } from '../tic-tac-toe/ticTacToe'

export default class App extends React.Component {
  render(){
    return (
      <div className="App">
        <TicTacToe />
        <img src={logo} className="App-logo" alt="logo" />
      </div>
    );
  }
}
