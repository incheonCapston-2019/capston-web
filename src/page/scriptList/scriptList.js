import React, { Component } from "react";
import "./scriptList.css";
import { SpeakerSelectOption } from "../../container";
import { Link } from "react-router-dom";
class ScriptList extends Component {
  state = {
    script: ["헨젤과 그랬대", "신 병데렐라"],
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
    window.location.href = "/scriptSave";
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
            대본 목록
            <Link to="/scriptSave">
              <span className="scriptPlus">나가기</span>
            </Link>
          </div>
          <div className="script_area">
            {this.state.script.map((index, i, key) => (
              <div
                className="each_script"
                onClick={() => this.active_speakerSelect(i)}
                key={i}
              >
                {index}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ScriptList;
