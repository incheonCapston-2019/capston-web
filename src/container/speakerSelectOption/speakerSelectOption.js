import React, { Component } from "react";
import "./speakerSelectOption.scss";
import { SpeakerSelectOption_main } from "../../component";
import { Link } from "react-router-dom";

class SpeakerSelectOption extends Component {
  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <div>
        <div className="speakerSelectOption">
          <div
            className="speakerSelectOption_background"
            onClick={() => this.props.nonActive_speakerSelect(this.props.index)}
          />

          <div className="speakerSelectOption_main">
            {this.props.castPart.map((index, i) => (
              <SpeakerSelectOption_main
                speaker={this.props.speaker}
                castPart={index}
                key={i}
              />
            ))}
            <div>
              <button
                className="saveButton"
                onClick={() => this.props.save_option(this.props.index)}
              >
                설정 완료 / 저장
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SpeakerSelectOption;
