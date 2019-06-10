import React, { useEffect, useReducer } from "react";
import { useDropzone } from "react-dropzone";
import Thumbs from "./ImageInput/PreviewThumbs";
import ProgressBar from "../../../ProgressBar/ProgressBar";
import fileInputReducer from "./fleInputReducer";
import formReducer from "../../formReducer";
const Context = formReducer;
const FileInput = ({ fieldAttributes, parentProps }) => {
  const { title, error, camelName } = parentProps;

  const { files, totalProgressState, dropzone, reducer, cropper } = useFileInput({
    fieldAttributes
  });
  const [totalProgress, setProgressBar] = totalProgressState;
  const [getRootProps, inputAttributes, open, inputRef] = dropzone;

  const handleUpload = e => parentProps.onConfirm(e, setProgressBar);

  const blurHandler = () => fieldAttributes.onBlur({ target: inputRef.current });

  return (
    <Context.Provider value={reducer}>
      <section className="container">
        <div {...getRootProps({ className: "dropzone mb-2" })}>
          <Thumbs files={files} />
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
        {!cropper && (
          <input
            type="submit"
            value="Upload"
            className="btn btn-block mt-4"
            onClick={handleUpload}
          />
        )}
      </section>
    </Context.Provider>
  );
};
export default FileInput;
const useFileInput = ({ initialFiles = [], fieldAttributes }) => {
  const initialState = { files: initialFiles, totalProgress: null, cropper: false, blobsList: [] };
  const [state, dispatch] = useReducer(fileInputReducer, initialState);
  const { files, totalProgress, cropper, blobsList } = state;
  const allowedImages = {
    mimeTypes: ["image/gif", "image/jpeg", "image/bmp", "image/png"],
    maxWeight: null
  };

  // dropzone plugin declaration
  const { getRootProps, getInputProps, open, inputRef } = useDropzone({
    accept: allowedImages.mimeTypes,
    onDrop: acceptedFiles => dispatch({ type: "addFiles", payload: acceptedFiles }),
    noClick: true,
    noKeyboard: true
  });

  // this happens every time page loads and when files array is updated
  useEffect(// passing the dropzone change event to the form framework to validate and store
  () => {
    console.log(blobsList);
    inputRef.current.focus();
    inputRef.current.Files = files;
    fieldAttributes.onChange({
      target: inputRef.current
    });
    if (files.length < 1) {
      inputRef.current.blur();
      dispatch({ type: "clearTotalProgress" });
    }
  }, [files]);

  const setProgressBar = (progressEvent, fileName) => {
    const progress = Math.trunc((progressEvent.loaded / progressEvent.total) * 100);
    dispatch({ type: "setProgress", progress, fileName });
  };

  // extending the form framework functionality with dropzone's features
  const inputAttributes = Object.assign({}, fieldAttributes, getInputProps());
  delete inputAttributes.style;

  return {
    files,
    totalProgressState: [totalProgress, setProgressBar],
    dropzone: [getRootProps, inputAttributes, open, inputRef],
    reducer: [state, dispatch],
    cropper
  };
};
