import logo from './logo.svg';
import './App.css';
import { Box } from '@mui/material';
import Tile from './components/Tile.js'
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props);
  }
   

  displayForm() { 

    const array = ["C", "A", "S", "N", "I", "P", "Z"];
    var tiles = array.map(element => 
        
        <Tile text={element}/>
    )
      return tiles;
   }

  render() {

  return (

    <div className="App">
      <header className="App-header">
      <Box sx={{ display: 'flex',  flexDirection: 'row', justifyContent: 'space-evenly', width:'100%' }}>

        {this.displayForm()}
        </Box>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
  
}}

export default App;
