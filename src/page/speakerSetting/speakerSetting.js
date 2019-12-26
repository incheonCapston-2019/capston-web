import React, { Component } from "react";
import "./speakerSetting.scss";
import { MpButton } from "../../component/index";

class SpeakerSetting extends Component {
  render() {
    return (
      <div className="speakerSetting">
        <div className="speakerInsert">
          <div className="eachLine">
            <input className="dnsBlock" placeholder="DNS 입력칸" />
            <div className="settingRoll">기본 역할 설정</div>
            <button className="connectCheck">연결확인</button>
            <button className="discardButton">삭제</button>
          </div>
          <div className="eachLine">
            <input className="dnsBlock" placeholder="DNS 입력칸" />
            <div className="settingRoll">기본 역할 설정</div>
            <button className="connectCheck">연결확인</button>
            <button className="discardButton">삭제</button>
          </div>
          <div className="eachLine">
            <input className="dnsBlock" placeholder="DNS 입력칸" />
            <div className="settingRoll">기본 역할 설정</div>
            <button className="connectCheck">연결확인</button>
            <button className="discardButton">삭제</button>
          </div>
        </div>
        <div className="speakerAdd">
          <button className="addButton">스피커 추가</button>
        </div>
        <div className="settingConfirm">
          <button className="confirmButton">설정 완료</button>
        </div>
      </div>
    );
  }
}
export default SpeakerSetting;
