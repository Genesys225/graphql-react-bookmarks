import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import styled from "styled-components";

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
    <CropContainer>
      <AcceptBtn
        className="btn btn-warn"
        onClick={() => props.onApproveCrop(file, props.fileName, img)}
      >
        <span role="img" aria-label="approve">
          ✅
        </span>
      </AcceptBtn>
      <CropBtn className="btn btn-warn" onClick={() => executeCrop()}>
        <span role="img" aria-label="crop">
          ✂️
        </span>
      </CropBtn>
      <CancelBtn className="btn btn-warn" onClick={() => props.onCancelCrop()}>
        <span role="img" aria-label="cancel">
          ❌
        </span>
      </CancelBtn>
      <Cropper
        image={img}
        crop={crop}
        zoom={zoom}
        aspect={1}
        showGrid={false}
        cropShape="round" // cropShape= 'rect' | 'round'
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        crossOrigin="anonymous"
      />
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
    </CropContainer>
  );
};

export default ImageCrop;

const CropContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  button {
    position: absolute;
    background: unset;
    border: unset;
    padding: 0px;
    margin: 0px;
    width: 24px;
    height: 24px;
    font-size: 20px;
    z-index: 10;
  }
`;

const AcceptBtn = styled.button`
  top: 6px;
  right: 6px;
`;
const CropBtn = styled.button`
  top: 6px;
  left: 6px;
`;
const CancelBtn = styled.button`
  bottom: 6px;
  left: 6px;
`;
