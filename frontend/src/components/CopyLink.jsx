//https://www.w3schools.com/howto/howto_js_copy_clipboard.asp

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
      <Button onClick={handleCopy} variant="warning">
        Copy text
      </Button>
    </>
  );
}

export default CopyLink;
