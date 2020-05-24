import * as AWS from "aws-sdk";

export const translate = new AWS.Translate({
  region: process.env.REACT_APP_REGION,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
});

// var polly = new AWS.Polly();
