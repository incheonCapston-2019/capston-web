import React, { Component } from "react";
import "./App.css";
import { MainPage, speakerSetting } from "./page";
import { Route, Router } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={MainPage} />
        <Route path="/speakersetting" component={speakerSetting} />
      </div>
    );
  }
}

export default App;
