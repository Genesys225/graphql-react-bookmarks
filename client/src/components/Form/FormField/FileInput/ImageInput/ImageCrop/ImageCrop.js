import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./canvasCropper";
import styled from "styled-components";
import { CancelOutline } from "styled-icons/typicons";
import { Scissors } from "styled-icons/icomoon";
import { CheckCircle } from "styled-icons/boxicons-regular";
import Slider from "../../../../../Slider/Slider";

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
    const image = { img, fileName: props.fileName };
    const { blobUrl, file } = await getCroppedImg(image, croppedPixels, true);
    setImg(blobUrl);
    setFile(file);
    setZoom(1);
  };

  const ApproveCropHandler = async () => {
    console.log(file.name);
    if (!file.name) await executeCrop();
    await props.onApproveCrop(file, props.fileName, img);
  };

  return (
    <>
      <CropContainer>
        <AcceptBtn className="btn btn-warn" onClick={ApproveCropHandler}>
          <CheckCircle title="Accept results" size="16" />
        </AcceptBtn>
        <CropBtn className="btn btn-warn" onClick={executeCrop}>
          <Scissors title="Execute crop" size="16" />
        </CropBtn>
        <CancelBtn className="btn btn-warn" onClick={props.onCancelCrop}>
          <CancelOutline title="Cancel crop" size="16" />
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
        <SliderContainer>
          <Slider
            value={zoom}
            min={1.0}
            max={3.0}
            step={0.1}
            onChange={e => setZoom(e.target.value)}
          />
        </SliderContainer>
      </CropContainer>
    </>
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
    font-size: 1px;
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

const SliderContainer = styled.div`
  z-index: 100;
  position: absolute;
  bottom: -62px;
  width: 100%;
  left: -2px;
  background: #fff;
  label {
    vertical-align: middle;
    padding: 0 2rem;
    height: 4rem;
  }
`;
