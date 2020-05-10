import React, { Component } from "react";
import "./speakerSelectOption.css";
import { SpeakerSelectOption_main } from "../../component";
import { Link } from "react-router-dom";

class SpeakerSelectOption extends Component {
  state = {
    speakerIndex: [],
  };
  componentDidMount() {
    let speakerIndexArray = [];
    for (let index = 0; index < this.props.castPart.length; index++) {
      speakerIndexArray.push("");
    }
    this.setState({ speakerIndex: speakerIndexArray });
  }

  speakerIndexChange = (e, i) => {
    var tempArray = this.state.speakerIndex;
    tempArray[i] = e.target.value;
    this.setState({ speakerIndex: tempArray });
  };

  render() {
    return (
      <div>
        <div className="speakerSelectOption">
          <div
            className="speakerSelectOption_background"
            onClick={() => this.props.nonActive_speakerSelect(this.props.index)}
          />
          <form name="spekaer">
            <div className="speakerSelectOption_main">
              {this.props.castPart.map((i, index) => (
                <SpeakerSelectOption_main
                  key={index}
                  index={index}
                  speaker={this.props.speaker}
                  castPart={i}
                  speakerIndexChange={this.speakerIndexChange}
                />
              ))}
              <div>
                <button
                  type="button"
                  className="saveButton"
                  onClick={() =>
                    this.props.save_option(this.props.index, this.state)
                  }
                >
                  설정 완료 / 저장
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default SpeakerSelectOption;
