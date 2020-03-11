import React from "react";

const SpeakerPopup = index => {
  console.log(index);
  return (
    <div className="eachLine">
      <div className="inputBox">
        <input className="dnsBlock" placeholder="DNS 입력칸" />
        <div className="settingRoll">기본 역할 설정</div>
      </div>
      <button className="connectCheck">연결확인</button>
      <button className="discardButton">삭제</button>
    </div>
  );
};
export default SpeakerPopup;
