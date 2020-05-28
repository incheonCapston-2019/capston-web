import React, { Component } from "react";
import "./mainPage.css";
import { MpButton } from "../../component/index";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API } from "../index";
class MainPage extends Component {
  speakerKill = () => {
    console.log("스피커 사망 명령");
    Axios({
      url: `${API()}/speakerKill`,
      method: "get",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  render() {
    return (
      <div className="mainPage">
        <div className="centerContainer">
          <div className="title">
            <div className="text" onClick={this.speakerKill}>
              {" "}
              너는 나의 친구
            </div>
          </div>
          <div>
            <Link to="/scriptSave">
              <MpButton className="MpButton" text="대본 저장소" />
            </Link>
            <Link to="/playList">
              <MpButton className="MpButton" text="재생 목록" />
            </Link>
            <Link to="/speakerPage">
              <MpButton className="MpButton" text="스피커 설정" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default MainPage;
