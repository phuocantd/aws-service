import * as AWS from "aws-sdk";

export const translate = new AWS.Translate({
  region: process.env.REACT_APP_REGION,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
});

// var polly = new AWS.Polly();

export const doTranslate = (
  inputText,
  sourceLanguageCode,
  targetLanguageCode
) => {
  var params = {
    Text: inputText || "",
    SourceLanguageCode: sourceLanguageCode,
    TargetLanguageCode: targetLanguageCode,
  };

  return translate.translateText(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      alert("Error calling Amazon Translate. " + err.message);
      return;
    }
    if (data) {
      // var outputTextArea = document.getElementById("outputText");
      // outputTextArea.value = data.TranslatedText;
      // console.log(data);
    }
  });
};
