import React from 'react';
import ClusterWorker from '../workers/cluster.worker';

import * as constants from '../constants'

class Songs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: null,
            song: {},
            image: {}
        };

        this.worker = null;

        this.getTrackInfo = this.getTrackInfo.bind(this);
        this.getBase64FromImageUrl = this.getBase64FromImageUrl.bind(this);
        this.generateColorPalette = this.generateColorPalette.bind(this);
    }

    getBase64FromImageUrl(url) {
        if (url === "") {
            return this.setState({
                image: {
                    image: "",
                    url: "",
                    data: ""
                }
            })
        }

        let img = new Image();

        img.setAttribute('crossOrigin', 'anonymous');

        let that = this;
        img.onload = function () {
            let canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            let ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);
            let imageData = ctx.getImageData(0, 0, this.width, this.height).data;

            let dataURL = canvas.toDataURL("image/png");
            that.setState({
                image: {
                    image: dataURL,
                    url: url,
                    data: imageData
                }
            }, _ => that.generateColorPalette());
        };

        img.src = url;
        return url;
    }

    getTrackInfo() {
        let params = {
            "method": "track.getInfo",
            "api_key": process.env.REACT_APP_API_KEY,
            "artist": encodeURIComponent(this.props.song.artist),
            "track": encodeURIComponent(this.props.song.name),
            "format": "json",
        }

        let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
        console.log(constants.LAST_FM_API + queryString);

        fetch(constants.LAST_FM_API + queryString)
            .then(response => response.json())
            .then(track => {
                if (track) {
                    console.log(track);
                    this.setState({ info: track.track })
                    if (track.track.album) {
                        this.getBase64FromImageUrl(this.getAlbumImage(this.state.info.album, 3))
                    } else {
                        this.setState({
                            image: {
                                image: "",
                                url: "",
                                data: ""
                            }
                        })
                    }
                }
            });
    }

    getAlbumImage(album, index) {
        if (index < 0) {
            return "";
        }

        if (album.image[index]["#text"]) {
            return album.image[index]["#text"];
        } else {
            return this.getAlbumImage(album, index - 1);
        }
    }

    generateColorPalette() {
        let imageData = this.state.image.data;
        this.worker.postMessage(imageData);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.song !== state.song) {
            return {
                song: props.song,
            };
        }

        // Return null if the state hasn't changed
        return null;
    }

    componentDidMount() {
        this.worker = new ClusterWorker();
        this.worker.addEventListener('message', event => this.props.update(event.data));
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.song !== prevProps.song) {
            if (this.props.song.image) {

            }
            this.getTrackInfo();
        }
    }

    render() {
        if (this.state.info) {
            return (
                <div id="phone" className="app">
                    <div className="top" style={{ 'backgroundImage': 'url("' + this.state.image.url + '")' }}>
                        <div className="content"></div>
                    </div>
                    <div className="bottom">
                        {this.props.song.name}
                    </div>
                </div>
            );
        } else {
            return (
                <span>Choose a song first</span>
            );
        }
    }
}

export default Songs;
