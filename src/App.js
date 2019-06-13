import React from 'react';
//import logo from './logo.svg';
import Songs from './components/Songs';
import Phone from './components/Phone';
import './App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      song: {}
    }

    this.updateSong = this.updateSong.bind(this);
  }

  updateSong(song) {
    this.setState({ song: song }, () => {
      console.log(song);
    });
  }

  render() {
    return (
      <div className="App">
        <Songs update={this.updateSong} />
        <Phone song={this.state.song} />
      </div>
    );
  }
}

export default App;
