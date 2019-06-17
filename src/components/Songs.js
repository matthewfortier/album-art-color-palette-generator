import React from 'react';
import { goToAnchor } from 'react-scrollable-anchor'

import _ from 'lodash';
import * as SpotifyWebApi from 'spotify-web-api-js';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

class Songs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            song: {},
            searchkey: "",
            songs: []
        };

        console.log(window.location);

        this.spotify = new SpotifyWebApi();
        this.spotify.setAccessToken(this.props.accessToken);

        this.prev = null;

        this.handleChange = this.handleChange.bind(this);
        this.deboucnedChange = _.debounce(this.deboucnedChange.bind(this), 200);
    }

    handleChange(e) {
        this.setState({ searchkey: e.target.value });
        this.deboucnedChange()
    }

    deboucnedChange() {
        this.searchSongs();
    }

    handleClick(track) {
        let song = this.state.songs[track];
        console.log(song);
        this.setState({ song: song });
        this.props.update(song);
        goToAnchor('phone');
    }

    searchSongs() {
        /* let params = {
            "method": "track.search",
            "track": encodeURIComponent(this.state.searchkey),
            "api_key": process.env.REACT_APP_API_KEY,
            "format": "json",
            "limit": 10
        }

        let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
        //console.log(LAST_FM_API + queryString);

        fetch(constants.LAST_FM_API + queryString)
            .then(response => response.json())
            .then(data => {
                if (data.hasOwnProperty('results')) {
                    console.log(data.results.trackmatches.track);
                    this.setState({ songs: data.results.trackmatches.track })
                }
            }); */

        // abort previous request, if any
        if (this.prev !== null) {
            this.prev.abort();
        }

        this.prev = this.spotify.searchTracks(this.state.searchkey, {limit: 10})
        this.prev.then(data => {
            this.prev = null;
            console.log(data);
            this.setState({ songs: data.tracks.items })
        }, err => console.log(err));
    }

    render() {
        return (
            <div className="songs">
                <input type="text" placeholder="search..." value={this.state.searchkey} onChange={this.handleChange} />
                {/* <ul className="tracks">
                    {tracks}
                </ul> */}
                <SimpleBar className="tracks" style={{ height: '100%'}}>
                    {this.state.songs.map((value, index) =>
                        <div className="track" key={index} onClick={this.handleClick.bind(this, index)}>
                            <div className="track-album-image" style={{ 'backgroundImage': 'url("' + value.album.images[2]["url"] + '")' }}></div>
                            <div className="track-info">
                                <span className="track-name">{value.name}</span>
                                <p className="track-artist">{value.artists[0].name} - {value.album.name}</p>
                            </div>
                        </div>
                    )}
                </SimpleBar>
            </div>
        );
    }
}

export default Songs;
