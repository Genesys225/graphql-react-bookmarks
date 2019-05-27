import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const FileInput = ({ fieldAttributes, parentProps }) => {
  const [progress, setProgress] = useState(null);
  const { title, error, camelName } = parentProps;
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, open, inputRef } = useDropzone({
    accept: "image/*",
    onDrop: acceptedFiles => {
      const updatedFileList = [
        ...files,
        ...acceptedFiles.map(file => {
          return Object.assign(file, {
            preview: URL.createObjectURL(file)
          });
        })
      ];
      // passing the dropzone chnage event to the form framework to validate and store
      fieldAttributes.onChange({ target: inputRef.current }, updatedFileList);
      setFiles(updatedFileList);
      return;
    },
    noClick: true,
    noKeyboard: true
  });

  const handleChange = e => {
    getInputProps().onChange(e);
  };

  // extending the form framework functinality with dropzone's features
  const mergedAttributes = Object.assign({}, fieldAttributes, getInputProps());
  delete mergedAttributes.style;

  const handleUpload = e => {
    parentProps.onConfirm(e, setProgress);
  };

  const blurHandler = e => null; //(files.length > 1 ? fieldAttributes.onBlur(e) : null);

  useEffect(() => {
    // fieldAttributes.onChange({ target: inputRef.current }, files);
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img alt={file.name} src={file.preview} style={img} />
      </div>
    </div>
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
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped"
              role="progressbar"
              style={{ width: `${progress}%`, display: error ? "hide" : "block" }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progress && progress + "%"}
            </div>
          </div>
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
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: "2rem",
  height: "15rem",
  border: "2px dashed #ced4da",
  borderRadius: ".25rem",
  padding: "0.5rem"
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box"
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden"
};

const img = {
  display: "block",
  width: "auto",
  height: "100%"
};
