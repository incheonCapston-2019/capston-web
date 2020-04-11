import React, { Component } from "react";
import Axios from "axios";
class SpeakerPopup extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      url: "",
    };
  }

  onChangeUrl = (e) => {
    this.setState({ url: e.target.value });
  };

  spaekerCheck = (e) => {
    Axios({
      url: "http://127.0.0.1:3001/speakerConnect/",
      method: "post",
      data: { url: this.state.url },
    })
      .then((res) => {
        console.log(res);
        // if (res.data == "실패") {
        //   alert("연결 실패");
        // } else if (res.data == "중복") {
        //   alert("이미 등록된 ip입니다.");
        // } else {
        //   alert("연결에 성공하였습니다.");
        // }
      })
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
            defaultValue={
              this.props.length > this.props.index
                ? this.props.defaultIp[this.props.index]
                : null
            }
          />
          <div className="settingRoll">기본 역할 설정</div>
        </div>
        <button className="connectCheck" onClick={this.spaekerCheck}>
          연결확인
        </button>
      </div>
    );
  }
}

export default SpeakerPopup;
