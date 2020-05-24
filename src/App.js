import React, { useState } from "react";
import { Input, Select } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import * as AWS from 'aws-sdk'

import { translate } from "./aws/translate";
import "./App.css";

const { TextArea } = Input;
const { Option } = Select;

function App() {
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("vi");
  const [sourceText, setSourceText] = useState("");
  const [targetText, setTargetText] = useState("");

  AWS.config.getCredentials(function (err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
    console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
  }
});

  const handleSwitch = () => {
    const source = sourceLanguage;
    const target = targetLanguage;
    setSourceLanguage(target);
    setTargetLanguage(source);
    doTranslate(sourceText, target, source);
  };

  const handleChangeSourseLanguage = (value) => {
    setSourceLanguage(value);
    if (sourceText !== "") {
      doTranslate(sourceText, value, targetLanguage);
    }
  };

  const handleChangeTargetLanguage = (value) => {
    setTargetLanguage(value);
    if (sourceText !== "") {
      doTranslate(sourceText, sourceLanguage, value);
    }
  };

  const handleChangeText = async (event) => {
    const text = event.target.value;
    setSourceText(text);
    if (text !== "") {
      doTranslate(text, sourceLanguage, targetLanguage);
    }
  };

  const doTranslate = (inputText, sourceLanguageCode, targetLanguageCode) => {
    translate.translateText(
      {
        Text: inputText || "",
        SourceLanguageCode: sourceLanguageCode,
        TargetLanguageCode: targetLanguageCode,
      },
      function (err, data) {
        if (err) {
          console.log(err, err.stack);
          console.log({ inputText, sourceLanguageCode, targetLanguageCode });
          alert("Error calling Amazon Translate. " + err.message);
          return;
        }
        if (data) {
          setTargetText(data.TranslatedText);
        }
      }
    );
  };

  return (
    <>
      <h1>Amazon Translate</h1>
      <div className="language">
        <Select
          value={sourceLanguage}
          className="select"
          defaultValue="lucy"
          style={{ width: 120 }}
          onChange={handleChangeSourseLanguage}
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
        <button type="button" onClick={handleSwitch}>
          <SwapOutlined />
        </button>
        <Select
          value={targetLanguage}
          className="select"
          defaultValue="lucy"
          style={{ width: 120 }}
          onChange={handleChangeTargetLanguage}
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
      <div className="rowInput">
        <TextArea
          className="input"
          rows={5}
          placeholder="Enter text"
          value={sourceText}
          onChange={handleChangeText}
        />
        <TextArea
          className="input"
          placeholder="Translated text"
          value={targetText}
          onChange={(event) => setTargetText(event.target.value)}
        />
      </div>
    </>
  );
}

export default App;
