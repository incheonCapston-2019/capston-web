import React from "react";

const SpeakerSelectOption_main = ({ castPart, speaker }) => {
  return (
    <div className="each">
      <span className="name">{castPart}</span>
      <span className="speaker">
        <select name="speaker">
          <option value="스피커 선택" defaultValue hidden>
            스피커 선택
          </option>
          {speaker.map((index, key) => (
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
