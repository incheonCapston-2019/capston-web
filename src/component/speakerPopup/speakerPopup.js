import React, { Component } from "react";
import Axios from "axios";
import { API } from "../../page/index";
class SpeakerPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.defaultIp !== prevProps.defaultIp) {
      console.log("업뎃");
      if (this.props.length > this.props.index) {
        this.setState({
          url: this.props.defaultIp[this.props.index],
        });
      }
    }
  }
  onChangeUrl = (e) => {
    this.setState({ url: e.target.value });
  };

  spaekerCheck = (e) => {
    Axios({
      url: `${API()}/speakerConnect`,
      method: "post",
      data: { url: this.state.url },
    })
      .then((res) => {
        console.log(res);
        if (res.data == "실패") {
          alert("연결 실패");
        } else if (res.data == "중복") {
          alert("이미 등록된 ip입니다.");
        } else {
          alert("연결에 성공하였습니다.");
        }
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
            onChange={this.onChangeUrl}
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
        <button
          className="discardButton"
          onClick={() =>
            this.props.deleteSpeaker(this.props.index, this.state.url)
          }
        >
          삭제
        </button>
      </div>
    );
  }
}

export default SpeakerPopup;
