import React from 'react';
import * as constants from '../constants';

class Songs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            song: {},
            searchkey: "",
            songs: []
        };
    }

    handleChange(e) {
        this.setState({ searchkey: e.target.value });
        this.searchSongs();
    }

    handleClick(track) {
        let song = this.state.songs[track];
        this.setState({ song: song });
        this.props.update(song);
    }

    searchSongs() {
        let params = {
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
            });
    }

    render() {

        const tracks = [];

        for (const [index, value] of this.state.songs.entries()) {
            tracks.push(
                <li className="track" key={index} onClick={this.handleClick.bind(this, index)}>
                    <div className="track-album-image"></div>
                    <span className="track-artist">{value.artist}</span>
                    <span className="track-name-separator"> - </span>
                    <span className="track-name">{value.name}</span>
                </li>
            )
        }

        return (
            <div className="songs">
                <input type="text" placeholder="search..." value={this.state.searchkey} onChange={this.handleChange.bind(this)} />
                <ul className="tracks">
                    {tracks}
                </ul>
            </div>
        );
    }
}

export default Songs;
