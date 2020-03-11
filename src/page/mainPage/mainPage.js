import React, { Component } from "react";
import "./mainPage.scss";
import { MpButton } from "../../component/index";
import { Link } from "react-router-dom";

class MainPage extends Component {
  render() {
    return (
      <div className="mainPage">
        <div className="centerContainer">
          <div className="title">
            <div className="text"> 너는 나의 친구</div>
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
