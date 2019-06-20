import React from 'react';
import { goToAnchor } from 'react-scrollable-anchor';

import _ from 'lodash';
import * as SpotifyWebApi from 'spotify-web-api-js';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

class Songs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      song: {},
      searchkey: '',
      songs: [],
      searching: false,
    };

    console.log(window.location);

    this.spotify = new SpotifyWebApi();
    this.spotify.setAccessToken(this.props.accessToken);

    this.prev = null;

    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deboucnedChange = _.debounce(this.deboucnedChange.bind(this), 200);
  }

  handleChange(e) {
    this.setState({ searchkey: e.target.value });
    if (e.target.value !== '') {
      this.deboucnedChange();
    } else {
      this.setState({ songs: [], searching: false });
    }
  }

  deboucnedChange() {
    this.searchSongs();
    this.setState({ searching: true });
  }

  handleFocus() {
    if (this.state.searchkey !== '') {
      this.setState({ searching: true });
    }
  }

  handleClick(track) {
    let song = this.state.songs[track];
    console.log(song);
    this.setState({ song: song, searching: false });
    this.props.update(song);
    goToAnchor('phone');
  }

  handleKeyUp(e) {
    console.log(e.keyCode);
    switch (e.keyCode) {
      case 13:
        this.setState({ searching: true });
        this.searchSongs();
        break;
      case 27:
        this.setState({ searching: false });
        break;
      default:
        break;
    }
  }

  searchSongs() {
    // abort previous request, if any
    if (this.prev !== null) {
      this.prev.abort();
    }

    this.prev = this.spotify.searchTracks(this.state.searchkey, { limit: 10 });
    this.prev.then(
      data => {
        this.prev = null;
        console.log(data);
        this.setState({ songs: data.tracks.items });
      },
      err => console.log(err)
    );
  }

  render() {
    return (
      <div className="songs">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={this.state.searchkey}
            onFocus={this.handleFocus}
            onKeyUp={this.handleKeyUp}
            onChange={this.handleChange}
          />
        </div>
        <div className="results">
          <SimpleBar
            className="tracks"
            style={{ height: this.state.searching ? '400px' : '0px' }}
          >
            {this.state.songs.map((value, index) => (
              <div
                className="track"
                key={index}
                onClick={this.handleClick.bind(this, index)}
              >
                <div
                  className="track-album-image"
                  style={{
                    backgroundImage:
                      'url("' + value.album.images[2]['url'] + '")',
                  }}
                ></div>
                <div className="track-info">
                  <span className="track-name">{value.name}</span>
                  <p className="track-artist">
                    {value.artists[0].name} - {value.album.name}
                  </p>
                </div>
              </div>
            ))}
          </SimpleBar>
        </div>
      </div>
    );
  }
}

export default Songs;
