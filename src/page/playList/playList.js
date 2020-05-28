import React, { Component } from "react";
import "./playList.css";
import { SpeakerSelectOption } from "../../container";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API } from "../index";
class PlayList extends Component {
  state = {
    script: [],
    scriptPlus: false,
    playList: [],
    checkBox: [],
    playTarget: "",
    isPlay: false,
    isPause: false,
  };
  componentDidMount = () => {
    Axios({
      url: `${API()}/scriptSaveCall`,
      method: "get",
    })
      .then((res) => {
        console.log(res);
        var titleArray = [],
          checkBox = [];
        for (
          let index = 0;
          index < res.data.scriptList.script.length;
          index++
        ) {
          if (res.data.scriptList.script[index].userChoice.title == "1") {
            titleArray.push(res.data.scriptList.script[index].title);
            checkBox.push(false);
          }
        }
        this.setState({
          script: titleArray,
          checkBox: checkBox,
        });
      })
      .catch((err) => console.log(err));
    Axios({
      url: `${API()}/scriptPlayerCall`,
      method: "get",
    })
      .then((res) => {
        console.log(res);
        var titleArray = [];
        if (Object.keys(res.data.scriptList.script.title).length != 0) {
          if (typeof res.data.scriptList.script.title != "string")
            this.setState({ playList: res.data.scriptList.script.title });
          else
            this.setState({
              playList: [res.data.scriptList.script.title],
            });
        }
        console.log(this.state);
      })
      .catch((err) => console.log(err));
  };
  scriptPlus = () => {
    var tempArray = [];
    if (this.state.scriptPlus == true) {
      // 추가 팝업 on인 상태
      for (let index = 0; index < this.state.script.length; index++) {
        tempArray.push(false);
      }
      this.setState({
        scriptPlus: !this.state.scriptPlus,
        checkBox: tempArray,
      });
    }
    this.setState({ scriptPlus: !this.state.scriptPlus });
  };
  swScript = (index) => {
    var tempIndex = this.state.checkBox;
    tempIndex[index] = !tempIndex[index];
    this.setState({ checkBox: tempIndex });
  };
  playerListSave = () => {
    var requestTitle = [],
      stateScript = this.state.script,
      stateCheckBox = this.state.checkBox;
    for (let index = 0; index < stateScript.length; index++) {
      if (stateCheckBox[index]) {
        //체크되어 있으면 전송하고자 하는 대본 목록에 추가
        requestTitle.push(stateScript[index]);
      }
    }
    Axios({
      url: `${API()}/playerListSave`,
      method: "post",
      data: { data: requestTitle },
    })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };
  checkPlayScript = (e) => {
    console.log(e.target.value);
    this.setState({ playTarget: e.target.value });
  };
  playScript = () => {
    if (this.state.playTarget != "") {
      if (!this.state.isPause) {
        console.log("실행");
        Axios({
          url: `${API()}/playListPlay`,
          method: "post",
          data: { data: this.state.playTarget },
        })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => console.log(err));
      } else {
        console.log("재실행");
        Axios({
          url: `${API()}/playListRePlay`,
          method: "get",
        })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => console.log(err));
      }
      this.setState({ isPlay: true, isPause: false });
    }
  };
  stopScript = () => {
    console.log("정지");
    this.setState({ isPlay: false, isPause: false });
    Axios({
      url: `${API()}/playListStop`,
      method: "get",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  pauseScript = () => {
    console.log("일시정지");
    this.setState({ isPlay: false, isPause: true });
    Axios({
      url: `${API()}/playListPause`,
      method: "get",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  prevScript = () => {
    console.log("이전 한줄 건너뛰기");
    this.setState({ isPlay: false, isPause: true });
    Axios({
      url: `${API()}/playListprevJump`,
      method: "get",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  nextScript = () => {
    console.log("이후 한줄 건너뛰기");
    this.setState({ isPlay: false, isPause: true });
    Axios({
      url: `${API()}/playListnextJump`,
      method: "get",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
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
                      <input
                        id={`script` + i}
                        type="checkBox"
                        onChange={() => this.swScript(i)}
                      />
                    </div>
                  ))}
                  <div className="button">
                    <button type="button" onClick={this.playerListSave}>
                      확인
                    </button>
                    <button type="button" onClick={this.scriptPlus}>
                      취소
                    </button>
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
                <label>
                  <input
                    type="checkbox"
                    value={index}
                    onClick={this.checkPlayScript}
                  />
                  {index}
                </label>
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
            <img
              src="img/rewind.png"
              className="bottomImg"
              alt="rewind"
              onClick={this.prevScript}
            />
            {this.state.isPlay ? (
              <img
                src="img/pause.png"
                className="bottomImg"
                alt="play"
                onClick={this.pauseScript}
              />
            ) : (
              <img
                src="img/play.png"
                className="bottomImg"
                alt="play"
                onClick={this.playScript}
              />
            )}
            <img
              src="img/stop.png"
              className="bottomImg"
              alt="stop"
              onClick={this.stopScript}
            />
            <img
              src="img/fastForward.png"
              className="bottomImg"
              alt="fastForward"
              onClick={this.nextScript}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PlayList;
