import React from 'react';
import { homepage } from '../../package.json';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.spotifyLogin = this.spotifyLogin.bind(this);
  }

  spotifyLogin() {
    let params = {
      "client_id": this.props.clientID,
      "response_type": "token",
      "redirect_uri": (process.env.NODE_ENV === 'production') ? encodeURIComponent(homepage) : encodeURIComponent('http://localhost:3000/'),
    }

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    let href = "https://accounts.spotify.com/authorize?" + queryString;

    window.location.href = href;
  }

  render() {
    return (
      <div className="Login">
        <h1>Hello!</h1>
        <h4>To start generating color palettes from your favorite album art, login with Spotify below</h4>
        <a onClick={this.spotifyLogin}>Login with Spotify</a>
      </div>
    );
  }
}

export default Login