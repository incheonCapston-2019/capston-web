import React, { Component } from "react";
import "./scriptList.css";
import { SpeakerSelectOption } from "../../container";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API } from "../index";
class ScriptList extends Component {
  state = {
    script: [],
    castPart: [],
    speaker: ["스피커1", "스피커2", "스피커3"],
  };
  componentDidMount = () => {
    Axios({
      url: `${API()}/scriptListCall`,
      method: "get",
    })
      .then((res) => {
        console.log(res);
        var titleArray = [],
          castPartArray = [],
          speakerArray = [],
          speakerIndexArray = [];

        for (
          let index = 0;
          index < res.data.scriptList.script.length;
          index++
        ) {
          titleArray.push(res.data.scriptList.script[index].title);
          castPartArray.push(res.data.scriptList.script[index].act.char);
        }
        for (let index = 0; index < res.data.ipArray.length - 2; index++) {
          speakerArray.push(`스피커${index + 1}`);
        }

        this.setState({
          script: titleArray,
          castPart: castPartArray,
          speaker: speakerArray,
        });
      })
      .catch((err) => console.log(err));
  };
  active_speakerSelect = (index) => {
    document.getElementsByClassName("speakerSelectOption")[
      index
    ].style.display = "block";
  };
  nonActive_speakerSelect = (index) => {
    console.log(index);
    document.getElementsByClassName("speakerSelectOption")[
      index
    ].style.display = "none";
  };
  //대본 저장
  save_option = (index, arr) => {
    if (arr.speakerIndex.indexOf("") == -1) {
      //만약 공백이 없다면
      Axios({
        url: `${API()}/scriptListSave`,
        method: "post",
        data: { index: index, arr: arr },
      })
        .then((res) => {
          console.log(res);
          alert("update!");
        })
        .catch((err) => console.log(err));
      document.getElementsByClassName("speakerSelectOption")[
        index
      ].style.display = "none";
    } else {
      alert("모든 역할에 대해 설정해 주셔야 합니다.");
    }
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
