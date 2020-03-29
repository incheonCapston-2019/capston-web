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
  render() {
    return (
      <div className="App">
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
