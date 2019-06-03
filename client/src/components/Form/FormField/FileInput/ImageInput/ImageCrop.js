import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";

import "./styles.css";

const ImageCrop = props => {
  const [img, setImg] = useState(props.src);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(0);
  const [file, setFile] = useState({});

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels, zoom);
    setCroppedPixels(croppedAreaPixels);
  }, []);
  const executeCrop = async () => {
    const { blobUrl, file } = await getCroppedImg(img, croppedPixels, true);
    setImg(blobUrl);
    setFile(file);
    setZoom(1);
  };

  return (
    <div className="App">
      <div className="crop-container">
        <div className="crop-controls">
          <button
            className="btn btn-warn"
            style={{ ...containerBtn, top: 6, right: 6 }}
            onClick={() => props.onApproveCrop(file, props.fileName, img)}
          >
            <span role="img" aria-label="approve">
              ✅
            </span>
          </button>
          <button
            className="btn btn-warn"
            style={{ ...containerBtn, top: 6, left: 6 }}
            onClick={() => executeCrop()}
          >
            <span role="img" aria-label="crop">
              ✂️
            </span>
          </button>
          <button
            className="btn btn-warn"
            style={{ ...containerBtn, bottom: 6, left: 6 }}
            onClick={() => props.onCancelCrop()}
          >
            <span role="img" aria-label="cancel">
              ❌
            </span>
          </button>
        </div>
        <Cropper
          image={img}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          crossOrigin="anonymous"
        />
      </div>
      {/* <div className="controls">
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => setZoom(zoom)}
          classes={{ container: "slider" }}
        />
      </div> */}
    </div>
  );
};

export default ImageCrop;
const containerBtn = {
  position: "absolute",
  background: "unset",
  border: "unset",

  padding: 0,
  margin: 0,
  width: 24,
  height: 24,
  fontSize: "10",
  zIndex: 1
};
