import React, { useState, useEffect } from "react";
import { Input, Select, Radio } from "antd";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";

import { polly } from "../../aws";
import "./index.css";

const { TextArea } = Input;
const { Option } = Select;

// const useAudio = (url) => {
//   const [audio] = useState(new Audio(url));
//   const [playing, setPlaying] = useState(false);

//   const toggle = () => setPlaying(!playing);
//   const stop = () => {
//     audio.currentTime = 0;
//     audio.pause();
//     setPlaying(false);
//   };

//   useEffect(() => {
//     console.log(url);
//     playing ? audio.play() : audio.pause();
//   }, [playing, audio, url]);

//   useEffect(() => {
//     audio.addEventListener("ended", () => setPlaying(false));
//     return () => {
//       audio.removeEventListener("ended", () => setPlaying(false));
//     };
//   }, [audio]);

//   return [playing, toggle, stop];
// };

export default function Voice() {
  const [language, setLanguage] = useState("en");
  const [voice, setVoice] = useState("Joanna");
  const [text, setText] = useState(
    "The quick brown fox jumps over the lazy dog."
  );
  const [audio, setAudio] = useState(new Audio(""));
  const [playing, setPlaying] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    doSynthesize(text);
  }, [text]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, [audio]);

  const handleChangeText = (e) => {
    setText(e.target.value);
    handleStop();
  };

  const handleChangeLanguage = (value) => {
    setLanguage(value);
  };

  const handleTextDefault = () => {
    handleStop();
    setText("The quick brown fox jumps over the lazy dog.");
  };

  const handleReset = () => {
    setText("");
    handleStop();
  };

  const handlePlay = () => {
    audio.play();
    setPlaying(true);
  };

  const handlePause = () => {
    audio.pause();
    setPlaying(false);
  };
  const handleStop = () => {
    audio.currentTime = 0;
    audio.pause();
    setPlaying(false);
  };

  const handleListen = () => {
    if (playing) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const doSynthesize = (text) => {
    const params = {
      OutputFormat: "mp3",
      SampleRate: "8000",
      Text: text,
      TextType: "text",
      VoiceId: "Joanna",
    };

    polly.synthesizeSpeech(params, function (err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        alert("Error calling Amazon Polly. " + err.message);
      } else {
        var uInt8Array = new Uint8Array(data.AudioStream);
        var arrayBuffer = uInt8Array.buffer;
        var blob = new Blob([arrayBuffer]);
        var url = URL.createObjectURL(blob);
        console.log(url);
        setAudio(new Audio(url));
        // const audioElement = new Audio([url]);
        // audioElement.play();
      }
    });
  };

  return (
    <div>
      <h1>Text to Speed</h1>
      <TextArea
        placeholder="Input text ..."
        rows={7}
        value={text}
        onChange={handleChangeText}
      />
      <div className="control">
        <div>
          <p>Language and region</p>
          <Select
            value={language}
            className="select"
            defaultValue="lucy"
            style={{ width: 120 }}
            onChange={handleChangeLanguage}
          >
            <Option value="en">English</Option>
            <Option value="vi">Vietnamese</Option>
            <Option value="ar">Arabic</Option>
            <Option value="cs">Czech</Option>
            <Option value="de">German</Option>
            <Option value="fr">French</Option>
            <Option value="it">Italian</Option>
            <Option value="ja">Japanese</Option>
            <Option value="ru">Russian</Option>
            <Option value="tr">Turkish</Option>
            <Option value="zh">Chinese</Option>
          </Select>
        </div>
        <div>
          <p>Voice</p>
          <Radio.Group
            name="radiogroup"
            defaultValue={voice}
            className="ratio"
            value={voice}
            onChange={(event) => setVoice(event.target.value)}
          >
            <Radio value="Joanna">Joanna</Radio>
            <Radio value="Ivy">Ivy</Radio>
            <Radio value="Joey">Joey</Radio>
          </Radio.Group>
        </div>
        <div className="btn-group">
          <button type="button" onClick={handleTextDefault}>
            Show default text
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            Reset
          </button>
          <button
            type="button"
            style={{ background: "#00f", color: "#fff" }}
            onClick={handleListen}
            disabled={text === ""}
          >
            {playing ? <PauseOutlined /> : <CaretRightOutlined />}
            {playing ? "Stop the speed" : "Listen to speed"}
          </button>
        </div>
      </div>
    </div>
  );
}
