import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";

import "./styles.css";

const ImageCrop = props => {
  const [img, setImg] = useState(props.src);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(0);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels, zoom);
    setCroppedPixels(croppedAreaPixels);
  }, []);
  const executeCrop = async () => {
    // debugger;
    const { blobUrl, file } = await getCroppedImg(img, croppedPixels, true);
    setImg(blobUrl);
    await console.log(file);
    setZoom(1);
  };

  return (
    <div className="App">
      <div className="crop-container" onClick={executeCrop}>
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
