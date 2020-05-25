import React, { useState, useEffect } from "react";
import { Alert } from "antd";

import { rekognition } from "../../aws/index";

export default function TextImage() {
  const [imageUrl, setImageUrl] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState([]);

  const handleUpload = (e) => {
    setImageUrl(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  useEffect(() => {
    if (imageUrl !== null) {
      processImage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  const processImage = () => {
    var file = imageUrl;
    var reader = new FileReader();
    reader.onload = (function (theFile) {
      return function (e) {
        //Call Rekognition
        var params = {
          Image: {
            Bytes: e.target.result,
          },
        };
        rekognition.detectText(params, function (err, data) {
          if (err) console.log(err, err.stack);
          // an error occurred
          else {
            console.log("sucess", data);
            // const value = data.TextDetections.filter(
            //   (item) => item.Type === "WORD"
            // ).map((item) => item.DetectedText);
            // console.log(value, value.toString());
            setResult(data.TextDetections);
          }
        });
      };
    })(file);
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <div>
        <input
          type="file"
          name="fileToUpload"
          id="fileToUpload"
          accept="image/*"
          onChange={handleUpload}
        />
      </div>
      {result.length > 0 ? (
        <Alert
          style={{ marginTop: 20 }}
          message="RESULT"
          description={result
            .filter((item) => item.Type === "WORD")
            .map((item) => item.DetectedText)
            .join(" | ")}
          type="info"
        />
      ) : (
        imageUrl !== null && (
          <Alert
            style={{ marginTop: 20 }}
            message="The image haven't text"
            description=""
            type="warning"
          />
        )
      )}
      <img
        src={preview}
        alt="preview"
        style={{ marginTop: 20, width: "80%" }}
      />
    </div>
  );
}
