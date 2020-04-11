import React, { Component } from "react";
import "./playList.css";
import { SpeakerSelectOption } from "../../container";
import { Link } from "react-router-dom";
class PlayList extends Component {
  state = {
    script: ["헨젤과 그레텔", "신데렐라"],
    castPart: [
      ["철수", "영수", "부희", "승우"],
      ["철구", "영추", "부후", "승아"],
    ],
    speaker: ["스피커1", "스피커2", "스피커3"],
    scriptPlus: false,
    playList: ["헨젤과 그레텔"],
  };

  scriptPlus = () => {
    this.setState({ scriptPlus: !this.state.scriptPlus });
  };

  render() {
    return (
      <div>
        <div>
          {this.state.scriptPlus ? (
            <div className="playList_plus">
              <div className="script_background" onClick={this.scriptPlus} />
              <div className="script_area">
                <form>
                  {this.state.script.map((index, i) => (
                    <div className="script_name" key={i}>
                      <label className="script_label" htmlFor={`script` + i}>
                        {index}
                      </label>
                      <input id={`script` + i} type="checkBox" />
                    </div>
                  ))}
                  <div className="button">
                    <button>확인</button>
                    <button onClick={this.scriptPlus}>취소</button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div />
          )}

          <div className="playListInfo">
            <div>
              <img
                src="img/backbutton.svg"
                className="backbutton"
                alt="backbutton"
                onClick={() => (window.location.href = "/")}
              />
              재생목록
            </div>
            <div className="playListTopButton">
              <button className="button" onClick={this.scriptPlus}>
                대본 추가
              </button>
              <button className="button">대본 삭제</button>
              <button className="button">대본 순서 변경</button>
            </div>
          </div>

          <div className="script_area">
            {this.state.playList.map((index, i, key) => (
              <div className="each_script" key={i}>
                {index}
              </div>
            ))}
          </div>

          <div className="scriptBottom">
            <img src="img/speaker.png" className="bottomImg" alt="speaker" />
            <img src="img/rotate.png" className="bottomImg" alt="rotate" />
            <img
              src="img/randomRotate.png"
              className="bottomImg"
              alt="randomRotate"
            />
            <img src="img/rewind.png" className="bottomImg" alt="rewind" />
            <img src="img/play.png" className="bottomImg" alt="play" />
            <img src="img/stop.png" className="bottomImg" alt="stop" />
            <img
              src="img/fastForward.png"
              className="bottomImg"
              alt="fastForward"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PlayList;
