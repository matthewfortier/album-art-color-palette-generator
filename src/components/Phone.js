import React from 'react';
import { OverflowDetector } from 'react-overflow';
import ClusterWorker from '../workers/cluster.worker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faStepBackward,
  faStepForward,
  faList,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';

class Songs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      song: {},
      image: {},
      marquee: false,
      palette: {
        palette: [],
        ratios: {},
        backColor: '#333',
      },
    };

    this.worker = null;

    this.handleOverflowChange = this.handleOverflowChange.bind(this);
  }

  getBase64FromImageUrl(url) {
    if (url === '') {
      return this.setState({
        image: {
          image: '',
          url: '',
          data: '',
        },
      });
    }

    let img = new Image();

    img.setAttribute('crossOrigin', 'anonymous');

    let that = this;
    img.onload = function() {
      let canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;

      let ctx = canvas.getContext('2d');
      ctx.drawImage(this, 0, 0);
      let imageData = ctx.getImageData(0, 0, this.width, this.height).data;

      let dataURL = canvas.toDataURL('image/png');
      that.setState(
        {
          image: {
            image: dataURL,
            url: url,
            data: imageData,
          },
        },
        _ => that.generateColorPalette()
      );
    };

    img.src = url;
    return url;
  }

  getAlbumImage(album, index) {
    if (index > 2) {
      return '';
    }

    console.log(album);
    if (album.images[index]['url']) {
      return album.images[index]['url'];
    } else {
      return this.getAlbumImage(album, index + 1);
    }
  }

  getColorBoxShadow() {
    return `
            inset 7px 0 9px -7px ${this.state.palette.backColor}, 
            inset -7px 0 9px -7px ${this.state.palette.backColor}
        `;
  }

  generateColorPalette() {
    let imageData = this.state.image.data;
    this.worker.postMessage(imageData);
  }

  renderArtists() {
    return this.props.song.artists.reduce((acc, val, i) => {
      let artists = acc + val.name;
      if (i !== this.props.song.artists.length - 1) {
        artists += ', ';
      }
      return artists;
    }, '');
  }

  renderDuration(percent) {
    let min = Math.floor(
      ((this.props.song.duration_ms * percent) / 1000 / 60) << 0
    );
    let sec = Math.floor(((this.props.song.duration_ms * percent) / 1000) % 60);
    return `${min}:${sec}`;
  }

  handleOverflowChange() {
    console.log('Overflowing');
    this.setState({ marquee: true });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.song !== state.song) {
      return {
        song: props.song,
      };
    }

    if (props.palette && props.palette !== state.palette) {
      return {
        palette: props.palette,
      };
    }

    // Return null if the state hasn't changed
    return null;
  }

  componentDidMount() {
    this.worker = new ClusterWorker();
    this.worker.addEventListener('message', event =>
      this.props.update(event.data)
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.song !== prevProps.song) {
      this.getBase64FromImageUrl(this.props.song.album.images[2]['url']);
    }

    if (this.props.palette !== prevProps.palette) {
      this.setState({ palette: this.props.palette });
    }
  }

  render() {
    if (this.state.image.url) {
      return (
        <div className="mockup-container">
          <div id="phone" className="mockup">
            <div className="phone">
              <div className="top">
                <img src={this.props.song.album.images[0]['url']} alt="" />
              </div>
              <div
                className="bottom"
                style={{ backgroundColor: this.state.palette.backColor }}
              >
                <div className="time">
                  <span>{this.renderDuration(0.3)}</span>
                  <div className="line">
                    <span></span>
                    <span></span>
                  </div>
                  <span>{this.renderDuration(1)}</span>
                </div>
                <div className="text">
                  <OverflowDetector
                    onOverflowChange={this.handleOverflowChange}
                    style={{ width: '75%', height: '30px', margin: '0 auto' }}
                  >
                    <span
                      className="marquee"
                    >
                      {this.props.song.name}
                    </span>
                    <div
                      className="shadow"
                      style={{ boxShadow: this.getColorBoxShadow() }}
                    ></div>
                  </OverflowDetector>

                  <span className="artists">{this.renderArtists()}</span>
                </div>
                <div className="controls">
                  <FontAwesomeIcon icon={faThumbsDown} />
                  <FontAwesomeIcon icon={faStepBackward} />
                  <div id="play">
                    <FontAwesomeIcon icon={faPlay} />
                  </div>
                  <FontAwesomeIcon icon={faStepForward} />
                  <FontAwesomeIcon icon={faThumbsUp} />
                </div>
                <div className="spacer"></div>
                <div className="next">
                  <div className="left">
                    <FontAwesomeIcon icon={faList} />
                    <span>Playlist</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronUp} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <span>Choose a song first</span>;
    }
  }
}

export default Songs;
