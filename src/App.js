import React from 'react';
//import logo from './logo.svg';
import Songs from './components/Songs';
import Phone from './components/Phone';
import Swatches from './components/Swatches';
import Login from './components/Login';

import ScrollableAnchor from 'react-scrollable-anchor'
import './App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      song: {},
      palette: {
        palette: [],
        ratios: {}
      },
      accessToken: new URLSearchParams(window.location.hash.substring(1)).get('access_token'),
      clientID: process.env.REACT_APP_CLIENT_ID
    }

    this.updateSong = this.updateSong.bind(this);
    this.updatePalette = this.updatePalette.bind(this);
  }

  updateSong(song) {
    this.setState({ song: song }, () => {
      console.log(song);
    });
  }

  updatePalette(palette) {
    this.setState({ palette: palette }, () => {
      console.log(palette);
    });
  }
  componentDidMount() {
    console.log(this.refs);
  }

  render() {
    if (this.state.accessToken === null) {
      return (
        <Login clientID={this.state.clientID} />
      )
    }

    return (
      <div className="App">
        <div id="search">
          <Songs update={this.updateSong} clientID={this.state.clientID} accessToken={this.state.accessToken} />
        </div>
        <div id="main-content">
          <div className="right">
            <Swatches palette={this.state.palette} />
          </div>
          <ScrollableAnchor id={'phone'}>
            <Phone song={this.state.song} palette={this.state.palette} update={this.updatePalette} />
          </ScrollableAnchor>
        </div>
      </div>
    );
  }
}

export default App;
