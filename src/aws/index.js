import * as AWS from "aws-sdk";

export const translate = new AWS.Translate({
  region: process.env.REACT_APP_REGION,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
});

export const polly = new AWS.Polly({
  region: "ap-southeast-1",
  secretAccessKey: "wX6hinF8f1NSpQ2S2T2OrblfD4qKMhTlEbpOSK5e",
  accessKeyId: "AKIARBLBFVRUASBU345C",
});
