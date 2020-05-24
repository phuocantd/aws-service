import * as AWS from "aws-sdk";

export const translate = new AWS.Translate();

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
