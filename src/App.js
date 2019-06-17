import React from 'react';
//import logo from './logo.svg';
import Songs from './components/Songs';
import Phone from './components/Phone';
import Swatches from './components/Swatches'

import ScrollableAnchor from 'react-scrollable-anchor'
import './App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      song: {},
      palette: [],
      counter: 0
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
    return (
      <div className="App">
        <Songs update={this.updateSong} />
        <ScrollableAnchor id={'phone'}>
          <Phone song={this.state.song} update={this.updatePalette} />
        </ScrollableAnchor>
        <div className="right">
          <Swatches palette={this.state.palette} />
        </div>
        <span>{this.state.counter}</span>
      </div>
    );
  }
}

export default App;
