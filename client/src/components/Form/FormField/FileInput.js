import React from "react";

const FileInput = props => {
  console.log(props);
  const newProps = {
    ...props,
    classname: `${props.className} custom-file-input`
  };
  return (
    <>
      <div className="form-actions custom-file">
        <input {...newProps} />
        <label htmlFor="fileUpload" className="custom-file-label">
          Somthing...........
        </label>
      </div>
      <input type="submit" value="Upload" className="btn btn-block mt-4" />
    </>
  );
};

export default FileInput;
