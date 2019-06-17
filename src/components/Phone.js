import React from 'react';
import ClusterWorker from '../workers/cluster.worker';

class Songs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            song: {},
            image: {}
        };

        this.worker = null;

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

    getAlbumImage(album, index) {
        if (index > 2) {
            return "";
        }

        console.log(album);
        if (album.images[index]["url"]) {
            return album.images[index]["url"];
        } else {
            return this.getAlbumImage(album, index + 1);
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
            // this.getTrackInfo();
            // this.getBase64FromImageUrl(this.getAlbumImage(this.props.song.album, 0));
            this.getBase64FromImageUrl(this.props.song.album.images[2]["url"]);
        }
    }

    render() {
        if (this.state.image.url) {
            return (
                <div id="phone" className="app">
                    <div className="phone">
                        <div className="top" style={{ 'backgroundImage': 'url("' + this.props.song.album.images[0]["url"] + '")' }}>
                            <div className="content"></div>
                        </div>
                        <div className="bottom">
                            {this.props.song.name}
                        </div>
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
