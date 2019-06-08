import React, { useEffect, useState } from "react";
import ImageCrop from "./ImageCrop/ImageCrop";
import styled from "styled-components";
import { Scissors } from "styled-icons/icomoon";
import { TrashAlt } from "styled-icons/fa-regular/TrashAlt";
import ProgressBar from "../../../../ProgressBar/ProgressBar";

const Thumbs = props => {
  const [cropper, setCropper] = useState(false);
  const [files, setFiles] = props.files;
  const showCropper = ({ name: fileName }, state) => {
    const updatedCropper = files.map(file => {
      if (file.name === fileName) file.cropper = state;
      return file;
    });
    setFiles(updatedCropper);
    setCropper(state);
  };

  const handleCropper = file => showCropper(file, true);

  const handleRemoveImg = ({ name: fileName }) =>
    setFiles(files.filter(file => fileName !== file.name));

  const handleApproveCrop = (croppedImage, fileName, img) => {
    showCropper(fileName, false);
    Object.assign(croppedImage, {
      preview: img,
      path: croppedImage.name,
      progress: null
    });
    const updatedFiles = [...files, croppedImage];
    setFiles(updatedFiles);
    console.log(croppedImage.name, fileName);
  };

  const handleCropCanceled = file => showCropper(file, false);

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, []);

  const thumbs = files.map(file => (
    <React.Fragment key={file.name}>
      {cropper ? (
        file.cropper && (
          <ImageCrop
            src={file.preview}
            fileName={file.name}
            onApproveCrop={handleApproveCrop}
            onCancelCrop={() => handleCropCanceled(file)}
          />
        )
      ) : (
        <Thumb>
          <ThumbInner>
            <img alt={file.name} src={file.preview} />
            <button className="btn btn-warn left" onClick={() => handleCropper(file)}>
              <Scissors title="Crop Image" size="16" />
            </button>
            <button className="btn btn-warn right" onClick={() => handleRemoveImg(file)}>
              <TrashAlt title="Remove Image" size="16" />
            </button>
          </ThumbInner>
          <ProgressContainer>
            <ProgressBar progress={file.progress} />
          </ProgressContainer>
        </Thumb>
      )}
    </React.Fragment>
  ));

  return <ThumbsContainer>{thumbs}</ThumbsContainer>;
};

export default Thumbs;

const ThumbsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 2rem;
  height: 16.25rem;
  border: 0.125rem dashed #ced4da;
  border-radius: 0.25rem;
  padding-top: 0.5rem;
  padding-left: 0.5rem;
`;

const Thumb = styled.div`
  position: relative;
  display: inline-flex;
  border-radius: 2px;
  border: 1px solid #eaeaea;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  width: 6.25rem;
  height: 7.25rem;
  padding: 0.25rem;
  padding-bottom: 20px;
  box-sizing: border-box;
  img {
    width: auto;
    height: 100%;
  }
  .btn {
    position: absolute;
    background: unset;
    border: unset;
    top: 0.375rem;
    padding: 0;
    margin: 0;
    width: 1.5rem;
    height: 1.5rem;
  }
  .left {
    left: 0.375rem;
  }
  .right {
    right: 0.375rem;
  }
`;

const ThumbInner = styled.div`
  display: flex;
  min-width: 0;
  overflow: hidden;
`;

const ProgressContainer = styled.div`
  position: absolute;
  bottom: 0.25rem;
  left: 0.25rem;
  border-radius: 0.25rem;
  width: 5.625rem;
`;
