import React, { useState } from "react";
import { Alert } from "antd";

import "./index.css";
import { rekognition } from "../../aws/index";

export default function Moderation() {
  const [imageUrl, setImageUrl] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isBlur, setIsBlur] = useState(false);
  const [isSafe, setIsSafe] = useState(true);

  const handleClick = () => {
    // processImage(imageUrl);
    setIsBlur(!isBlur);
  };

  React.useEffect(() => {
    if (imageUrl !== null) processImage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  const handleUpload = (e) => {
    setImageUrl(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

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
        rekognition.detectModerationLabels(params, function (err, data) {
          if (err) console.log(err, err.stack);
          // an error occurred
          else {
            // console.log("sucess", data);
            if (data.ModerationLabels.length > 0) {
              setIsBlur(true);
              setIsSafe(false);
            } else {
              setIsSafe(true);
              setIsBlur(false);
            }
          }
        });
      };
    })(file);
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <div>
        <button type="button" onClick={handleClick} style={{ marginRight: 10 }}>
          {isBlur ? "View content" : "Blur content"}
        </button>
        <input
          type="file"
          name="fileToUpload"
          id="fileToUpload"
          accept="image/*"
          onChange={handleUpload}
        />
      </div>
      {!isSafe && (
        <Alert
          style={{ marginTop: "10px" }}
          message="Warning"
          description="Image is not safe"
          type="warning"
          showIcon
        />
      )}
      <img
        src={preview}
        alt="preview"
        className={`mt-20 ${isBlur ? "image" : ""}`}
      />
    </div>
  );
}
