
import React, { Component } from 'react';
import './App.css';
import './bootstrap-grid.css'
const api = require('./api-keys.json');
var search = require('youtube-search');
var opts = {
  maxResults: 1,
  key: api.youtube
};



class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputURI: '',

      spotify: '',
      songname: '',
      artist: '',
      albumimg: '',
      link: '',

      youtube: '',
      title: '',
      channel: '',
      thumbnail: '',
      url: ''
    };

    this.getInputData = this.getInputData.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getAPIdata = this.getAPIdata.bind(this);
  }

  getInputData(uri){this.setState({inputURI: uri})}

  getAPIdata(id) {
    const accessToken = api.spotify;
    fetch('https://api.spotify.com/v1/tracks/'+ id, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
      }
    }).then(response => response.json()).then(data => {
      console.log(data)
      this.setState({songname: data.name})
      this.setState({artist: data.artists[0].name})
      this.setState({albumimg: data.album.images[1].url})
      this.setState({link: data.external_urls.spotify})
      var self = this;
      search(this.state.songname + ' ' + this.state.artist, opts, function(err, results) {
        if(err) return console.log(err);
        console.log(results[0])
        self.setState({spotify: 'Spotify'})
        self.setState({youtube: 'YouTube'})
        self.setState({title: results[0].title})
        self.setState({channel: results[0].channelTitle})
        self.setState({thumbnail: results[0].thumbnails.medium.url})
        self.setState({url: results[0].link})
      });
    })
  }

  handleClick() {
    this.getAPIdata(this.state.inputURI.replace('spotify:track:',''))
  }

  render() {
    return (
      <div className="App">
        <h1>Music video finder</h1>
        <h2>Spotify to YouTube</h2>
        <SongInput callback={this.getInputData} btnpress={this.handleClick}/>
        <div className="row">
          <Spotify spotify={this.state.spotify} songname={this.state.songname} artist={this.state.artist} albumimg={this.state.albumimg} link={this.state.link}/>
          <YouTube youtube={this.state.youtube} title={this.state.title} channel={this.state.channel} thumbnail={this.state.thumbnail} url={this.state.url}/>
        </div>
      </div>
    );
  }
}

class SongInput extends Component {
  render() {
    return (
      <div className="searchbar">
        <input type="text" placeholder="Spotify Track URI" onChange={e => this.props.callback(e.target.value)}/>
        <button className='button' onClick={this.props.btnpress}>Submit</button>
      </div>
    );
  }
}

class Spotify extends Component {
  render() {
    return (
      <div className="col-md-6 col-sm-12 spotify">
        <p className="weak">{this.props.spotify}</p>
        <a href={this.props.link}><img src={this.props.albumimg} alt="Spotify Track Cover"/></a>
        <h4>{this.props.songname}</h4>
        <h5>{this.props.artist}</h5>
      </div>
    );
  }
}

class YouTube extends Component {
  render() {
    return (
      <div className="col-md-6 col-sm-12 youtube">
        <p className="weak">{this.props.youtube}</p>
        <a href={this.props.url}><img src={this.props.thumbnail} alt="YouTube Video Thumbnail"/></a>
        <h4>{this.props.title}</h4>
        <h5>{this.props.channel}</h5>
      </div>
    );
  }
}



export default App;
