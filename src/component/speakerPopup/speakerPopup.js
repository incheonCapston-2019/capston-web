import React, { Component } from "react";
import Axios from "axios";

class SpeakerPopup extends Component {
  state = {
    url: ""
  };

  onChangeUrl = e => {
    this.setState({ url: e.target.value });
    console.log(e.target.value);
  };

  spaekerCheck = e => {
    console.log(this.state.url);
    Axios({
      url: "http://127.0.0.1:3001/speakerConnect/",
      method: "post",
      data: { url: this.state.url }
    })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="eachLine">
        <div className="inputBox">
          <input
            className="dnsBlock"
            placeholder="DNS 입력칸"
            onBlur={this.onChangeUrl}
          />
          <div className="settingRoll">기본 역할 설정</div>
        </div>
        <button className="connectCheck" onClick={this.spaekerCheck}>
          연결확인
        </button>
        <button className="discardButton">삭제</button>
      </div>
    );
  }
}

export default SpeakerPopup;
