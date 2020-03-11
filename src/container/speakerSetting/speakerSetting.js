import React, { Component } from "react";
import "./speakerSetting.scss";
import SpeakerPopup from "../../component/speakerPopup/speakerPopup";
import { Link } from "react-router-dom";

class SpeakerSetting extends Component {
  state = {
    speakerPopup: [0, 1, 2]
  };
  addSpeaker = () => {
    this.setState({
      speakerPopup: this.state.speakerPopup.concat(
        this.state.speakerPopup.length
      )
    });
  };

  render() {
    return (
      <div className="speakerSetting">
        <div className="speakerInsert" id="speakerInsert">
          {this.state.speakerPopup.map(index => (
            <SpeakerPopup index={index} />
          ))}
        </div>
        <div className="speakerAdd">
          <button className="addButton" onClick={this.addSpeaker}>
            스피커 추가
          </button>
        </div>
        <div className="settingConfirm">
          {" "}
          <Link to="/">
            <button className="confirmButton">설정 종료</button>
          </Link>
        </div>
      </div>
    );
  }
}
export default SpeakerSetting;
