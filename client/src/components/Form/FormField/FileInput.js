import React, { useState } from "react";

const FileInput = ({ fieldAttributes, parentProps }) => {
  const [progress, setProgress] = useState();
  console.log(fieldAttributes, parentProps);
  const { title, error, camelName } = parentProps;

  return (
    <>
      <div className="form-actions custom-file mb-3">
        <input {...fieldAttributes} />
        <label htmlFor={camelName} className="custom-file-label">
          {title}
        </label>
        <div className="invalid-feedback m-0" style={{ height: "0px" }}>
          {error}
        </div>
        <input
          type="submit"
          value="Upload"
          className="btn btn-block mt-4"
          onClick={parentProps.onConfirm}
        />
      </div>
    </>
  );
};

export default FileInput;
