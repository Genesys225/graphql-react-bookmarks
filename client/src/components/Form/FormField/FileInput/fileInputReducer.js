import { fileInputActions } from "../../Store/actionTypes";

const { types } = fileInputActions;

const init = initialState => Object.assign({}, fileInputInitialState, initialState);

export const fileInputInitialState = {
  files: [],
  totalProgress: null,
  cropper: false,
  blobsList: []
};

const fileInputReducer = (state, action) => {
  switch (action.type) {
    case types.removeFile:
      const filteredFiles = state.files.filter(file => action.fileName !== file.name);
      return {
        ...state,
        files: filteredFiles
      };
    case types.addFiles:
      let updatedFiles = action.payload.filter(
        file => !state.files.some(stateFile => stateFile.name === file.name)
      );
      let addedTempBlobs = state.blobsList;
      updatedFiles = [
        ...state.files,
        ...updatedFiles.map(file => {
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
    case types.setProgress:
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
    case types.clearProgress:
      const { files } = state;
      const clearedProgress =
        files.length < 1
          ? files
          : files.map(file => {
              file.cropper = null;
              return file;
            });
      return {
        ...state,
        files: clearedProgress,
        totalProgress: null
      };
    case types.setCropper:
      const updatedCropper = state.files.map(file => {
        if (file.name === action.fileName) file.cropper = action.payload;
        return file;
      });
      return {
        ...state,
        updatedCropper,
        cropper: action.payload
      };
    case types.revokeObjectURLs:
      let clearSuccessful = false;
      try {
        state.blobsList.forEach(blob => URL.revokeObjectURL(blob));
        clearSuccessful = true;
      } catch (error) {
        console.log(error);
        clearSuccessful = false;
      }
      return {
        ...state,
        blobsList: clearSuccessful ? [] : state.blobsList,
        files: []
      };
    case types.initState:
      return init(action.payload);
    default:
      return state;
  }
};
export default fileInputReducer;
