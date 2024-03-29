import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import recognizeMic from 'watson-speech/speech-to-text/genscribe-recognize-microphone';

class App extends Component {
  constructor() {
    super();
    this.state = {};
    this.link = "";
    this.file = {};
    this.stream;
  }

  startRecording = () => {
    this.stream = recognizeMic({
      token: "insert a valid token",
      objectMode: true, // send objects instead of text
      extractResults: true, // convert {results: [{alternatives:[...]}], result_index: 0} to {alternatives: [...], index: 0}
      format: false // optional - performs basic formatting on the results such as capitals an periods
    });
    this.stream.on('data', (data) => {
      // Send to backend for processing
      this.setState({
        text: data.test
      })
    });
    this.stream.on('error', function (err) {
      console.log(err);
    });
    this.stream.stop.bind(this.stream);
  }


  stopRecording = () => {
    this.stream.stop();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!(this.state.link || !this.state.file)) {
      // TODO: Tell user to give a valid input
      return;
    }
    var url = "http://localhost:3001/api/";
    if (this.state.link) {
      // TODO: Added validation logic for link
      url += "audioLink";
      fetch({
        url: url,
        type: 'POST',
        data: JSON.stringify({ link: this.state.link }),
        headers: { "Content-Type": "application/json" },
        success: function (a, b, c) {
          console.log("Successfully sent POST req");
        },
        error: function (a, b, c) {
          alert('Fail to analyze audio. Please input a valid format');
        },
      });
      return;
    }
    if (this.state.file) {
      // TODO: Added validation logic for audio file
      url += "audioFile";
      fetch({
        url: url,
        type: 'POST',
        data: this.state.file,
        headers: { "Content-Type": "application/json" },
        success: function (a, b, c) {
          console.log("Successfully sent POST req");
        },
        error: function (a, b, c) {
          alert('Fail to analyze audio. Please input a valid format');
        },
      });
    }
  }

  updateLink = (e) => {
    this.setState({
      link: e.target.value
    })
  }

  updateFile = (e) => {
    const file = e.target.files[0];
    var fileContent = "";
    const reader = new FileReader();

    reader.onload = (e) => {
      console.log("Loading file...");
      fileContent = e.currentTarget.result;
    }
    reader.onloadend = () => {
      console.log("Finished loading!");
      this.setState({
        file: fileContent
      })
    }
    reader.readAsBinaryString(file);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} alt="genscribe logo" className="logo" />
          <h1 className="App-title">Welcome to Genscribe</h1>
        </header>
        <div className="form-wrapper">
          <div>
            <h3> The best audio analyser for your meeting </h3>
            <form onSubmit={this.handleSubmit}>
              <div className="userInput">
                <input id="typeInput" type="text"
                  placeholder="https://s3.amazonaws.com/jzxhuang.com/test.mp3"
                  autoComplete="off"
                  onChange={this.updateLink} />
                <input id="fileInput" type="file" onChange={this.updateFile} />
              </div>
              <div className="submit-container">
                <button id="submit" onClick={this.handleSubmit}>Submit</button>
              </div>
            </form>
          </div>
          <br />
          <br />
          <br />
          <button onClick={this.startRecording}>Start Recording</button>
          <div style={{ fontSize: '40px' }}>{this.state.text}</div>
          <button onClick={this.stopRecording}>Stop Recording</button>
        </div>
      </div>
    );
  }
}

export default App;
