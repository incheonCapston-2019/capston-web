import React, { Component } from "react";
import "./playList.css";
import { SpeakerSelectOption } from "../../container";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API } from "../index";
class PlayList extends Component {
  state = {
    script: [], //대본 목록
    scriptPlus: false,
    playList: [], //재생 목록
    checkBox: [],
    playTarget: [],
    nowPlay: "",
    setRotate: false,
    isPlay: false, //실행중인가요?
    isPause: false, //일시정지 중 인가요?
    isRandom: false, //랜덤실행인가요?
    isRevise: false, //대본 순서 변경인가요?
    reviseScript: [],
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
  playerListDelete = () => {
    Axios({
      url: `${API()}/playerListDelete`,
      method: "delete",
      data: { data: this.state.playTarget },
    })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };
  checkPlayScript = (e) => {
    var tempPlay = this.state.playTarget;
    if (e.target.checked) {
      tempPlay.push(e.target.value);
      this.setState({ playTarget: tempPlay });
    } else {
      tempPlay.splice(tempPlay.indexOf(e.target.value), 1);
      this.setState({ playTarget: tempPlay });
    }
    console.log(this.state.playTarget);
  };
  playScript = async () => {
    if (this.state.isRevise) {
      alert("대본 순서 설정 중에는 재생이 불가합니다");
      return 0;
    }
    for (let index = 0; index < this.state.playList.length; index++)
      document.getElementsByClassName("checkbox")[index].checked = false;
    if (!this.state.isPause) {
      //일시정지 중?
      if (this.state.playTarget.length == 1) {
        console.log("실행");
        await this.setState({
          nowPlay: this.state.playTarget[0],
        });
        //현재 실행중인 대본 저장
        Axios({
          url: `${API()}/playListPlay`,
          method: "post",
          data: { data: this.state.playTarget[0] },
        })
          .then(async (res) => {
            console.log(res);
            console.log("았싸 대본끝났다.");
            this.setState({ isPlay: false, isPause: false });
            console.log("상태변경");
            if (this.state.setRotate) {
              //대본 종료 후 다음 대본 자동 실행
              if (this.state.isRandom) {
                //대본 자동 실행할때 랜덤인 경우
                var randomCount = Math.random();
                randomCount = Math.floor(
                  randomCount * this.state.playList.length
                );
                var playTarget = [this.state.playList[randomCount]];
                while (playTarget[0] == this.state.nowPlay) {
                  //랜덤 타겟과 현재 실행중이던 타겟이 같다면 다시 반복
                  randomCount = Math.random();
                  randomCount = Math.floor(
                    randomCount * this.state.playList.length
                  );
                  playTarget = [this.state.playList[randomCount]];
                }
                console.log(playTarget[0]);
                await this.setState({
                  playTarget: playTarget,
                  nowPlay: playTarget[0],
                });
                console.log("랜덤 대본 실행", playTarget);
              } else {
                //대본 자동 실행할때 랜덤이 아닌 경우
                var nextplayIndex =
                  this.state.playList.indexOf(this.state.nowPlay) + 1; //몇번째 대본인지
                if (nextplayIndex == this.state.playList.length)
                  nextplayIndex = 0;
                else if (this.state.nowPlay == "") return 0;

                await this.setState({
                  playTarget: [this.state.playList[nextplayIndex]],
                });
              }
              console.log(this.state.playTarget);
              this.playScript();
            } else {
              this.setState({ nowPlay: "", playTarget: [] });
              for (let index = 0; index < this.state.playList.length; index++)
                document.getElementsByClassName("checkbox")[
                  index
                ].checked = false;
            }
          })
          .catch((err) => console.log(err));
        this.setState({ isPlay: true, isPause: false });
      } else if (this.state.playTarget.length == 0) {
        alert("대본을 선택해 주십시오!");
      } else {
        console.log(this.state.playTarget.length);
        alert("한 대본만 실행 가능합니다!");
      }
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
      this.setState({ isPlay: true, isPause: false });
    }
  };
  stopScript = () => {
    console.log("정지");
    for (let index = 0; index < this.state.playList.length; index++)
      document.getElementsByClassName("checkbox")[index].checked = false;
    this.setState({
      isPlay: false,
      isPause: false,
      nowPlay: "",
      playTarget: [],
    });
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
    Axios({
      url: `${API()}/playListnextJump`,
      method: "get",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  randomScript = async () => {
    await this.setState({ isRandom: !this.state.isRandom });
    if (this.state.isRandom) {
      alert("다음 대본을 랜덤으로 실행 합니다.");
    } else alert("랜덤 실행을 하지 않습니다.");
  };
  setRotate = async () => {
    await this.setState({ setRotate: !this.state.setRotate });
    if (this.state.setRotate) alert("반복합니다.");
    else alert("반복하지 않습니다.");
  };
  setRevise = async () => {
    if (this.state.isPlay) {
      alert("대본 재생 중에는 설정 불가 합니다.");
      return 0;
    }
    await this.setState({ isRevise: !this.state.isRevise });
    if (!this.state.isRevise) {
      //서버에 저장
      if (this.state.reviseScript.length == this.state.playList.length) {
        Axios({
          url: `${API()}/playListRevise`,
          method: "put",
          data: { data: this.state.reviseScript },
        })
          .then((res) => {
            console.log(res);
            console.log("설정 완료");
            window.location.reload();
          })
          .catch((err) => console.log(err));
      } else {
        alert("모든 대본의 순서를 설정해주시지 않으면 저장이 되지 않습니다.");
      }
    }
  };

  reviseScriptSave = async (e) => {
    let tempReviseScript = this.state.reviseScript;
    if (tempReviseScript.indexOf(e.target.name) == -1) {
      //순서를 안정한 대본인 경우
      console.log(e.target.name, tempReviseScript);
      tempReviseScript.push(e.target.name);
      console.log(tempReviseScript);
      await this.setState({ reviseScript: tempReviseScript });
      console.log("대본 번호 추가", tempReviseScript);
    } else {
      //순서를 정한 대본인 경우
      tempReviseScript.splice(tempReviseScript.indexOf(e.target.name), 1);
      await this.setState({ reviseScript: tempReviseScript });
      console.log(this.state.reviseScript);
    }
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
                    <label className="script_label" htmlFor={`script` + i}>
                      <div className="script_name" key={i}>
                        {index}
                        <input
                          id={`script` + i}
                          type="checkbox"
                          onChange={() => this.swScript(i)}
                        />
                      </div>
                    </label>
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
              <button className="button" onClick={this.playerListDelete}>
                대본 삭제
              </button>
              <button className="button" onClick={this.setRevise}>
                대본 순서 변경
              </button>
            </div>
          </div>

          <div className="script_area">
            <form className="playList_script" name="playList_script">
              {this.state.playList.map((index, i, key) => (
                <label key={i} htmlFor={index}>
                  <div className="each_script">
                    {this.state.isRevise ? (
                      <input
                        type="text"
                        onClick={this.reviseScriptSave}
                        value={
                          this.state.reviseScript.indexOf(index) != -1
                            ? this.state.reviseScript.indexOf(index) + 1
                            : "선택"
                        }
                        className="reviseIndex"
                        name={index}
                        readOnly
                      />
                    ) : (
                      <div />
                    )}
                    <input
                      className="checkbox"
                      type="checkbox"
                      value={index}
                      id={index}
                      onClick={this.checkPlayScript}
                    />
                    {index}
                  </div>
                </label>
              ))}
            </form>
          </div>
          <div className="bottomPlayBar">
            현재 실행중인 대본 : {this.state.nowPlay}
          </div>
          <div className="scriptBottom">
            <img src="img/speaker.png" className="bottomImg" alt="speaker" />
            <img
              src="img/rotate.png"
              className="bottomImg"
              alt="rotate"
              onClick={this.setRotate}
            />
            <img
              src="img/randomRotate.png"
              className="bottomImg"
              alt="randomRotate"
              onClick={this.randomScript}
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
