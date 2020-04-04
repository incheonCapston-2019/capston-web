import React, { Component } from "react";
import Axios from "axios";

class SpeakerPopup extends Component {
  state = {
    url: "",
  };

  onChangeUrl = (e) => {
    this.setState({ url: e.target.value });
    console.log(e.target.value);
  };

  spaekerCheck = (e) => {
    console.log(this.state.url);
    Axios({
      url: "http://127.0.0.1:3001/speakerConnect/",
      method: "post",
      data: { url: this.state.url },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  spaekerCheck1 = (e) => {
    console.log(this.state.url);
    Axios({
      url: "http://127.0.0.1:3001/speakerConnect1/",
      method: "post",
      data: { data: "이건 삭제 버튼" },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
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
        <button className="discardButton" onClick={this.spaekerCheck1}>
          삭제
        </button>
      </div>
    );
  }
}

export default SpeakerPopup;
