import React, { Component } from "react";
import "./scriptSave.css";
import { SpeakerSelectOption } from "../../container";
import { Link } from "react-router-dom";
class ScriptSave extends Component {
  state = {
    script: ["헨젤과 그레텔", "신데렐라"],
    castPart: [
      ["철수", "영수", "부희", "승우"],
      ["철구", "영추", "부후", "승아"]
    ],
    speaker: ["스피커1", "스피커2", "스피커3"]
  };
  active_speakerSelect = index => {
    document.getElementsByClassName("speakerSelectOption")[
      index
    ].style.display = "block";
  };
  nonActive_speakerSelect = index => {
    document.getElementsByClassName("speakerSelectOption")[
      index
    ].style.display = "none";
  };

  save_option = index => {
    document.getElementsByClassName("speakerSelectOption")[
      index
    ].style.display = "none";
  };
  render() {
    return (
      <div>
        {this.state.castPart.map((index, i) => (
          <SpeakerSelectOption
            castPart={index}
            speaker={this.state.speaker}
            key={i}
            index={i}
            nonActive_speakerSelect={this.nonActive_speakerSelect}
            save_option={this.save_option}
          />
        ))}

        <div>
          <div className="pageInfo">
            <img
              src="img/backbutton.svg"
              className="backbutton"
              alt="backbutton"
              onClick={() => (window.location.href = "/")}
            />
            대본 저장소
            <Link to="/scriptList">
              <span className="scriptPlus">대본 추가</span>
            </Link>
          </div>
          <form>
            <div className="script_area">
              {this.state.script.map((index, i, key) => (
                <div
                  className="each_script"
                  onDoubleClick={() => this.active_speakerSelect(i)}
                  key={i}
                >
                  <input type="checkbox" name={index} value={index} />
                  {index}
                </div>
              ))}
            </div>

            <div className="scriptBottom">
              <button className="bottomDiv">대본 추가</button>
              <button className="bottomDiv">대본 삭제</button>
              <Link to="/playList">
                <button className="bottomDiv">재생 목록 이동</button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ScriptSave;
