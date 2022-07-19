import React, { useEffect, useRef, useState } from "react"
import { Typography, message } from 'antd';
import { useRecoilState } from "recoil";
import { clipboardHook } from "../../../util/Atoms";

// Adapted from ant designs copy-to-clipboard
function copy(text, options) {
    var debug,
      message,
      range,
      selection,
      mark,
      success = false;
    if (!options) {
      options = {};
    }
    debug = options.debug || false;
    try {
  
      range = document.createRange();
      selection = document.getSelection();
  
      mark = document.createElement("span");
      mark.textContent = text;
      // reset user styles for span element
      mark.style.all = "unset";
      // prevents scrolling to the end of the page
      mark.style.position = "fixed";
      mark.style.top = 0;
      mark.style.clip = "rect(0, 0, 0, 0)";
      // used to preserve spaces and line breaks
      mark.style.whiteSpace = "pre";
      // do not inherit user-select (it may be `none`)
      mark.style.webkitUserSelect = "text";
      mark.style.MozUserSelect = "text";
      mark.style.msUserSelect = "text";
      mark.style.userSelect = "text";

  
      document.body.appendChild(mark);
  
      range.selectNodeContents(mark);
      selection.addRange(range);
  
      var successful = document.execCommand("copy");
      if (!successful) {
        throw new Error("copy command was unsuccessful");
      }
      success = true;
    } catch (err) {
      debug && console.error("unable to copy using execCommand: ", err);
      debug && console.warn("trying IE specific stuff");
      try {
        window.clipboardData.setData(options.format || "text", text);
        options.onCopy && options.onCopy(window.clipboardData);
        success = true;
      } catch (err) {
        debug && console.error("unable to copy using clipboardData: ", err);
        debug && console.error("falling back to prompt");
        message = format("message" in options ? options.message : defaultMessage);
        window.prompt(message, text);
      }
    } finally {
      if (selection) {
        if (typeof selection.removeRange == "function") {
          selection.removeRange(range);
        } else {
          selection.removeAllRanges();
        }
      }
  
      if (mark) {
        document.body.removeChild(mark);
      }
    }
  
    return success;
  }

export const TableItem = ({text}) => {
    const [clipboard, setClipBoard] = useRecoilState(clipboardHook)
    const tableItem = useRef(null)

    const copy = (event) => {
        setClipBoard(event.target.textContent)
        event.stopPropagation();
        event.preventDefault();
        event.clipboardData.clearData();
        event.clipboardData.setData('text/plain', event.target.textContent);
    }

    useEffect(() => {
        tableItem.current.addEventListener("copy", copy);
        return () => {
            if(tableItem.current != null) tableItem.current.removeEventListener("copy", copy)
        } 
    }, [tableItem])



    const onClick = () => {
        document.execCommand('copy')
        message.success("Copied to Clipboard and Internal Clipboard!", .5);
    }




    return (
        <Typography.Paragraph ref={tableItem} onClick={onClick}>
            {text}
        </Typography.Paragraph>
    )


}