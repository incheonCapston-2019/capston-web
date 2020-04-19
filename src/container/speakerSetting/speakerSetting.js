import React, { Component } from "react";
import "./speakerSetting.css";
import SpeakerPopup from "../../component/speakerPopup/speakerPopup";
import { Link } from "react-router-dom";
import Axios from "axios";

class SpeakerSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      speakerPopup: [0, 1, 2],
      index: 3,
      defaultIp: null,
      length: 0,
    };
  }
  componentDidMount = () => {
    var array = null;
    console.log(this.state);
    Axios({
      url: "http://127.0.0.1:3001/speakerIp",
      method: "get",
    })
      .then((res) => {
        array = res.data;
        array.splice(0, 2);
        this.setState({ defaultIp: array, length: array.length });
      })
      .catch((err) => console.log(err));
  };

  addSpeaker = () => {
    var array = this.state.speakerPopup;
    var Index = this.state.index;
    var plusIndex = Index + 1;
    array.push(Index);
    this.setState({
      speakerPopup: array,
      index: plusIndex,
    });
    console.log(this.state);
  };
  deleteSpeaker = (index, ip) => {
    console.log(index);
    var array = this.state.speakerPopup;
    if (array.length == 1) {
      alert("마지막 하나입니다!");
      return 0;
    }
    //이미 저장된 아이피 칸인 경우 서버에서 제거
    Axios({
      url: "http://127.0.0.1:3001/speakerIpDelete",
      method: "delete",
      data: { url: ip },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));

    var indexof = array.indexOf(index);
    array.splice(indexof, 1);
    this.setState({ speakerPopup: array });
    alert("삭제완료");
  };
  render() {
    return (
      <div className="speakerSetting">
        <div className="speakerInsert" id="speakerInsert">
          {this.state.speakerPopup.map((index) => (
            <div>
              <SpeakerPopup
                index={index}
                key={index}
                defaultIp={this.state.defaultIp}
                length={this.state.length}
                deleteSpeaker={this.deleteSpeaker}
              />
            </div>
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
