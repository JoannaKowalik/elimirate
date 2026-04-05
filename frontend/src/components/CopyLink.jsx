import React from "react";
import Button from "react-bootstrap/esm/Button";

function CopyLink({ link }) {
  const inputRef = React.useRef(null);

  const handleCopy = () => {
    const copyText = inputRef.current.value;

    navigator.clipboard.writeText(copyText);

    //alert("Copied the text: " + copyText);
  };

  return (
    <>
      <input
        type="text"
        value={link}
        ref={inputRef}
        id="myInput"
        readOnly
      ></input>
      <Button onClick={handleCopy}>Copy text</Button>
    </>
  );
}

export default CopyLink;
