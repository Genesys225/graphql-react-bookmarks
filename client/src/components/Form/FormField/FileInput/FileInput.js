/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import Thumbs from "./ImageInput/PreviewThumbs";
import ProgressBar from "../../../ProgressBar/ProgressBar";
import { State, Dispatch, fileInputActions, formActions } from "../../Store";
const { types } = fileInputActions;

const FileInput = props => {
  const { fieldAttributes, parentProps } = useMemo(() => props, [props]);

  const { title, error, camelName } = parentProps;

  const { files, progressState, dropzone, cropper, dispatch } = useFileInput({
    fieldAttributes
  });
  const [totalProgress, setProgressBar] = progressState;
  const [getRootProps, inputAttributes, open] = dropzone;

  const clickHandler = () => {
    open();
    dispatch({ type: formActions.types.setFirstBlur, payload: true });
  };
  const handleUpload = e => parentProps.onConfirm(e, setProgressBar);

  return (
    <>
      <section className="container">
        <div {...getRootProps({ className: "dropzone mb-2" })}>
          <Thumbs files={files} />
        </div>
        <div className="form-actions custom-file mb-3" onClick={clickHandler}>
          <input {...inputAttributes} onBlur={props.onBlur} />
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
    </>
  );
};
export default FileInput;

const useFileInput = ({ fieldAttributes }) => {
  /**@todo add fallback to Form framework context */
  // destructs fileInputState (state object) out of State context and renames it "state" (alias)
  const { fileInputState: state } = useContext(State);
  const dispatch = useContext(Dispatch);
  const { files, totalProgress, cropper } = state;
  const allowedImages = {
    mimeTypes: ["image/gif", "image/jpeg", "image/bmp", "image/png"],
    maxWeight: null
  };
  // dropzone plugin declaration
  const { getRootProps, getInputProps, open, inputRef } = useDropzone({
    accept: allowedImages.mimeTypes,
    onDrop: acceptedFiles => dispatch({ type: types.addFiles, payload: acceptedFiles }),
    noClick: true,
    noKeyboard: true
  });

  // this happens every time page loads and when files array is updated
  useEffect(// passing the dropzone change event to the form framework to validate and store
  () => {
    const { current } = inputRef;
    if (files.length > 0) {
      current.focus();
      current.Files = files;
      fieldAttributes.onChange({ target: current });
    } else dispatch({ type: types.clearProgress });
    // inputRef.current.Files && dispatch({ type: types.addFiles, payload: inputRef.current.Files });
  }, [files]);

  const setProgressBar = (progressEvent, fileName) => {
    const progress = Math.trunc((progressEvent.loaded / progressEvent.total) * 100);
    dispatch({ type: types.setProgress, progress, fileName });
  };

  // extending the form framework functionality with dropzone's features
  const inputAttributes = Object.assign({}, fieldAttributes, getInputProps());
  delete inputAttributes.style;

  return {
    files,
    progressState: [totalProgress, setProgressBar],
    dropzone: [getRootProps, inputAttributes, open],
    cropper,
    dispatch
  };
};
