const fileInputReducer = (state, action) => {
  switch (action.type) {
    case "removeFile":
      const filteredFiles = state.files.filter(file => action.fileName !== file.name);
      return {
        ...state,
        files: filteredFiles
      };
    case "addFiles":
      const filterFiles = action.payload.filter(
        file => !state.files.some(stateFile => stateFile.name === file.name)
      );
      let addedTempBlobs = state.blobsList;
      const updatedFiles = [
        ...state.files,
        ...filterFiles.map(file => {
          if (action.path) file.path = action.path;
          Object.assign(file, {
            preview: action.preview ? action.preview : URL.createObjectURL(file),
            progress: null
          });
          file.preview && addedTempBlobs.push(file.preview);
          return file;
        })
      ];

      return {
        ...state,
        files: updatedFiles,
        blobsList: addedTempBlobs
      };
    case "setProgress":
      const updatedProgress = state.files.map(file => {
        if (file.name === action.fileName) file.progress = action.progress;
        return file;
      });
      const updatedTotalProgress = Math.trunc(
        state.files.reduce((acc, curr) => acc + curr.progress, 0) / state.files.length
      );
      return {
        ...state,
        files: updatedProgress,
        totalProgress: updatedTotalProgress
      };
    case "setCropper":
      const updatedCropper = state.files.map(file => {
        if (file.name === action.fileName) file.cropper = action.payload;
        return file;
      });
      return {
        ...state,
        files: updatedCropper,
        cropper: action.payload
      };

    default:
      return state;
  }
};
export default fileInputReducer;
