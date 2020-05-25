import React, { useState, useEffect } from "react";
import { Input, Select, Radio } from "antd";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";

import { polly } from "../../aws";
import "./index.css";

const { TextArea } = Input;
const { Option } = Select;

const describe = {
  arb: [{ name: "Zeina, Female", value: "Zeina" }],
  de: [
    { name: "Marlene, Female", value: "Marlene" },
    { name: "Vicki, Female", value: "Vicki" },
    { name: "Hans, Male", value: "Hans" },
  ],
  "en-US": [
    { name: "Salli, Female", value: "Salli" },
    { name: "Joey, Male", value: "Joey" },
  ],
  "ja-JP": [
    { name: "Mizuki, Female", value: "Mizuki" },
    { name: "Takumi, Male", value: "Takumi" },
  ],
  "ko-KR": [{ name: "Seoyeon, Female", value: "Seoyeon" }],
  "ru-RU": [
    { name: "Tatyana, Female", value: "Tatyana" },
    { name: "Maxim, Male", value: "Tatyana" },
  ],
};

// [
//   { language: { name: "", value: "", voice: [{ name: "", value: "" }] } },
// ];

export default function Voice() {
  const [language, setLanguage] = useState("en-US");
  const [voice, setVoice] = useState("Salli");
  const [text, setText] = useState(
    "The quick brown fox jumps over the lazy dog."
  );
  const [audio, setAudio] = useState(new Audio(""));
  const [playing, setPlaying] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    doSynthesize(text, voice);
  }, [text, voice]);

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
    setVoice(describe[value][0].value);
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

  const doSynthesize = (text, voice) => {
    const params = {
      OutputFormat: "mp3",
      SampleRate: "8000",
      Text: text,
      TextType: "text",
      VoiceId: voice,
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
            <Option value="arb">Arabic</Option>
            <Option value="en-US">English, US</Option>
            <Option value="de">German</Option>
            <Option value="ja-JP">Japanese</Option>
            <Option value="ru-RU">Russian</Option>
            <Option value="ko-KR">Korean</Option>
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
            {describe[language].map((item) => (
              <Radio key={item.value} value={item.value}>
                {item.name}
              </Radio>
            ))}
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
