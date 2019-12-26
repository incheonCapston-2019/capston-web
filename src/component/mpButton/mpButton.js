import React from "react";

const MpButton = props => {
  return (
    <div className={props.className} id={props.id}>
      <span className="text">{props.text}</span>
    </div>
  );
};

export default MpButton;
