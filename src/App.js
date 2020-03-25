import React, { Component } from "react";
import "./App.css";
import {
  MainPage,
  SpeakerPage,
  ScriptSave,
  ScriptList,
  PlayList
} from "./page";
import { Route } from "react-router-dom";

class App extends Component {
  state = {
    username: null
  };
  componentDidMount() {
    fetch("http://localhost:3001/api")
      .then(res => res.json())
      .then(data => this.setState({ username: data.username }));
  }
  render() {
    const username = this.state.username;
    return (
      <div className="App">
        {username ? `Hello ${username}` : "Hello World"}
        <Route exact path="/" component={MainPage} />
        <Route path="/speakerPage" component={SpeakerPage} />
        <Route path="/scriptSave" component={ScriptSave} />
        <Route path="/scriptList" component={ScriptList} />
        <Route path="/playList" component={PlayList} />
      </div>
    );
  }
}

export default App;
