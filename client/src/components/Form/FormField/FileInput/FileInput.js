import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ImageCrop from "./ImageInput/ImageCrop";
import styled from "styled-components";
import { Scissors } from "styled-icons/icomoon";
import { TrashAlt } from "styled-icons/fa-regular/TrashAlt";

const FileInput = ({ fieldAttributes, parentProps }) => {
  const { title, error, camelName } = parentProps;
  const [files, setFiles] = useState([]);
  // dropzone plugin declaration
  const allowedFiles = {
    mimeTypes: ["image/gif", "image/jpeg", "image/bmp", "image/png"],
    maxWeight: null
  };
  const { getRootProps, getInputProps, open, inputRef } = useDropzone({
    accept: allowedFiles.mimeTypes,
    onDrop: acceptedFiles => {
      const filteredFiles = acceptedFiles.filter(
        file => !files.some(stateFile => stateFile.name === file.name)
      );
      const updatedFileList = [
        ...files,
        ...filteredFiles.map(file => {
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
            progress: null
          });
        })
      ];
      setFiles(updatedFileList);
      return;
    },
    noClick: true,
    noKeyboard: true
  });

  // this happens every time page loads and when files array is updated
  useEffect(
    // passing the dropzone change event to the form framework to validate and store
    () => fieldAttributes.onChange({ target: inputRef.current }, files),
    [files]
  );

  const handleRemoveImg = ({ name: fileName }) => setFiles(files.filter(file => fileName !== file.name));

  const setProgressBar = (progressEvent, fileName) => {
    const updatedProgress = files.map(file => {
      if (file.name === fileName)
        file.progress = Math.trunc((progressEvent.loaded / progressEvent.total) * 100);
      return file;
    });
    setFiles(updatedProgress);
  };
  // extending the form framework functionality with dropzone's features
  const mergedAttributes = Object.assign({}, fieldAttributes, getInputProps());
  delete mergedAttributes.style;

  const handleUpload = e => parentProps.onConfirm(e, setProgressBar);

  const blurHandler = e => fieldAttributes.onBlur(e);

  const showCropper = ({ name: fileName }, state) => {
    const updatedCropper = files.map(file => {
      if (file.name === fileName) file.cropper = state;
      return file;
    });
    setFiles(updatedCropper);
  };

  const handleCropper = file => showCropper(file, true);

  const handleApproveCrop = (croppedImage, file, img) => {
    const fileName = { name: file };
    showCropper(fileName, false);
    Object.assign(croppedImage, {
      preview: img,
      path: croppedImage.name,
      progress: null
    });
    const updatedFiles = [...files, croppedImage];
    setFiles(updatedFiles);
    console.log(updatedFiles);
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
      {file.cropper ? (
        <ImageCrop
          src={file.preview}
          fileName={file.name}
          onApproveCrop={handleApproveCrop}
          onCancelCrop={() => handleCropCanceled(file)}
        />
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
          <ProgressContainer className="progress">
            <ThumbInner
              className="progress-bar progress-bar-striped"
              role="progressbar"
              progress={file.progress}
              aria-valuenow={file.progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {file.progress && file.progress + "%"}
            </ThumbInner>
          </ProgressContainer>
        </Thumb>
      )}
    </React.Fragment>
  ));
  return (
    <>
      <section className="container">
        <div {...getRootProps({ className: "dropzone mb-2" })}>
          <ThumbsContainer>{thumbs}</ThumbsContainer>
        </div>
        <div className="form-actions custom-file mb-3">
          <input {...mergedAttributes} onClick={open} onBlur={blurHandler} />
          <label htmlFor={camelName} className="custom-file-label">
            {title}
          </label>
          <div className="invalid-feedback m-0" style={{ height: "0px" }}>
            {error}
          </div>
          {/* <div className="progress"> 
            <div 
              className="progress-bar progress-bar-striped"
              role="progressbar"
              style={{
                width: `${progress}%`,
                display: error ? "hide" : "block"
              }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progress && progress + "%"}
            </div>
          </div> */}
        </div>
        <input type="submit" value="Upload" className="btn btn-block mt-4" onClick={handleUpload} readOnly />
      </section>
    </>
  );
};
export default FileInput;

const ThumbsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 2rem;
  height: 16.25rem;
  border: 2px dashed #ced4da;
  border-radius: 0.25rem;
  padding: 0.5rem;
`;

const Thumb = styled.div`
  position: relative;
  display: inline-flex;
  border-radius: 2px;
  border: 1px solid #eaeaea;
  margin-bottom: 8px;
  margin-right: 8px;
  width: 100px;
  height: 116px;
  padding: 4px;
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
    top: 6px;
    padding: 0;
    margin: 0;
    width: 24px;
    height: 24px;
  }
  .left {
    left: 6px;
  }
  .right {
    right: 6px;
  }
`;

const ThumbInner = styled.div`
  display: flex;
  width: ${props => props.progress || "inherit"}%;
  min-width: 0;
  overflow: hidden;
`;

const ProgressContainer = styled.div`
  position: absolute;
  bottom: 4px;
  left: 4px;
  border-radius: 0.25rem;
  width: 90px;
`;
