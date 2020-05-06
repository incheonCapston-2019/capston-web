import React from "react";

const SpeakerSelectOption_main = (props) => {
  return (
    <div className="each">
      <span className="name">{props.castPart}</span>
      <span className="speaker">
        <select
          name="speaker"
          onChange={(e) => props.speakerIndexChange(e, props.index)}
        >
          <option value="스피커 선택" defaultValue hidden>
            스피커 선택
          </option>
          {props.speaker.map((index, key) => (
            <option key={key} value={index}>
              {index}
            </option>
          ))}
        </select>
      </span>
    </div>
  );
};

export default SpeakerSelectOption_main;
