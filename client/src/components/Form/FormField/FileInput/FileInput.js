import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Thumbs from "./ImageInput/PreviewThumbs";
import ProgressBar from "../../../ProgressBar/ProgressBar";

const FileInput = ({ fieldAttributes, parentProps }) => {
  const { title, error, camelName } = parentProps;

  const { filesState, totalProgressState, dropzone } = useFileInput({ fieldAttributes });

  const [files, setFiles] = filesState;
  const [totalProgress, setProgressBar] = totalProgressState;
  const [getRootProps, inputAttributes, open, inputRef] = dropzone;

  const handleUpload = e => parentProps.onConfirm(e, setProgressBar);

  const blurHandler = () => fieldAttributes.onBlur({ target: inputRef.current });

  return (
    <>
      <section className="container">
        <div {...getRootProps({ className: "dropzone mb-2" })}>
          <Thumbs files={[files, setFiles]} />
        </div>
        <div className="form-actions custom-file mb-3">
          <input {...inputAttributes} onClick={open} onBlur={blurHandler} />
          <label htmlFor={camelName} className="custom-file-label">
            {title}
          </label>
          <div className="invalid-feedback m-0" style={{ height: "0px" }}>
            {error}
          </div>
          <ProgressBar error={error} progress={totalProgress} />
        </div>
        <input type="submit" value="Upload" className="btn btn-block mt-4" onClick={handleUpload} />
        {console.log(error)}
      </section>
    </>
  );
};
export default FileInput;

const useFileInput = ({ initialFiles = [], fieldAttributes }) => {
  const [files, setFiles] = useState(initialFiles);
  const [totalProgress, setTotalProgress] = useState(null);
  const allowedImages = {
    mimeTypes: ["image/gif", "image/jpeg", "image/bmp", "image/png"],
    maxWeight: null
  };
  // dropzone plugin declaration
  const { getRootProps, getInputProps, open, inputRef } = useDropzone({
    accept: allowedImages.mimeTypes,
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
  useEffect(// passing the dropzone change event to the form framework to validate and store
  () => {
    inputRef.current.focus();
    inputRef.current.Files = files;
    fieldAttributes.onChange({
      target: inputRef.current
    });
    console.log(files);
    if (files.length < 1) {
      inputRef.current.blur();
      setTotalProgress(null);
    }
  }, [files]);

  const setProgressBar = (progressEvent, fileName) => {
    const updatedProgress = files.map(file => {
      if (file.name === fileName)
        file.progress = Math.trunc((progressEvent.loaded / progressEvent.total) * 100);
      return file;
    });
    const updatedTotalProgress = Math.trunc(
      files.reduce((acc, curr) => acc + curr.progress, 0) / files.length
    );
    setTotalProgress(updatedTotalProgress);
    setFiles(updatedProgress);
  };

  // extending the form framework functionality with dropzone's features
  const inputAttributes = Object.assign({}, fieldAttributes, getInputProps());
  delete inputAttributes.style;

  return {
    filesState: [files, setFiles],
    totalProgressState: [totalProgress, setProgressBar],
    dropzone: [getRootProps, inputAttributes, open, inputRef]
  };
};
