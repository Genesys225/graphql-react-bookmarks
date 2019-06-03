import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ImageCrop from "./Image/ImageCrop";

const FileInput = ({ fieldAttributes, parentProps }) => {
  const { title, error, camelName } = parentProps;
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, open, inputRef } = useDropzone({
    accept: "image/*",
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
      // passing the dropzone change event to the form framework to validate and store
      fieldAttributes.onChange({ target: inputRef.current }, updatedFileList);
      setFiles(updatedFileList);
      return;
    },
    noClick: true,
    noKeyboard: true
  });

  const handleRemoveImg = ({ name: fileName }) =>
    setFiles(files.filter(file => fileName !== file.name));

  const handleChange = e => getInputProps().onChange(e);

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

  const handleCropper = ({ name: fileName }) => {
    console.log(fileName);
    const updatedCropper = files.map(file => {
      if (file.name === fileName) file.cropper = true;
      return file;
    });
    console.log(updatedCropper);
    setFiles(updatedCropper);
  };

  const handleCropApproved = croppedImage => {
    console.log(croppedImage);
  };

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, []);

  const thumbs = files.map(file => (
    <>
      {file.cropper ? (
        <ImageCrop src={file.preview} onCropApproved={handleCropApproved} />
      ) : (
        <div style={thumb} key={file.name}>
          <div style={thumbInner}>
            <img alt={file.name} src={file.preview} style={img} />
            <div className="container justify-content-start">
              <button
                className="btn btn-warn"
                style={{ ...containerBtn, left: 6 }}
                onClick={() => console.log("blah bllah")}
              >
                <span role="img" aria-label="crop">
                  ✂️
                </span>
              </button>
              <button
                className="btn btn-warn"
                style={{ ...containerBtn, right: 6 }}
                onClick={() => handleRemoveImg(file)}
              >
                <span role="img" aria-label="remove">
                  ❌
                </span>
              </button>
            </div>
          </div>
          <div className="progress" style={progressContainer}>
            <div
              className="progress-bar progress-bar-striped"
              role="progressbar"
              style={{
                width: `${file.progress}%`,
                ...thumbInner
              }}
              aria-valuenow={file.progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {file.progress && file.progress + "%"}
            </div>
          </div>
        </div>
      )}
    </>
  ));
  return (
    <>
      <section className="container">
        <div {...getRootProps({ className: "dropzone mb-2" })}>
          <aside style={thumbsContainer}>{thumbs}</aside>
        </div>
        <div className="form-actions custom-file mb-3">
          <input
            {...mergedAttributes}
            onChange={e => handleChange(e)}
            onClick={open}
            onBlur={blurHandler}
          />
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
        <input
          type="submit"
          value="Upload"
          className="btn btn-block mt-4"
          onClick={handleUpload}
          readOnly
        />
      </section>
    </>
  );
};

export default FileInput;

const thumbsContainer = {
  position: "relative",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: "2rem",
  height: "16.25rem",
  border: "2px dashed #ced4da",
  borderRadius: ".25rem",
  padding: "0.5rem"
};

const thumb = {
  position: "relative",
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 116,
  padding: 4,
  paddingBottom: 20,
  boxSizing: "border-box"
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden"
};

const img = {
  width: "auto",
  height: "100%"
};
const containerBtn = {
  position: "absolute",
  background: "unset",
  border: "unset",
  top: 6,
  padding: 0,
  margin: 0,
  width: 24,
  height: 24,
  fontSize: "10"
};

const progressContainer = {
  position: "absolute",
  bottom: 4,
  left: 4,
  borderRadius: ".25rem",
  width: 90
};
