import React from "react";
import styled from "styled-components";

const ProgressBar = ({ progress, error = false }) => {
  return (
    <ProgressContainer className="progress" error={error}>
      <Progress
        className="progress-bar progress-bar-striped"
        role="progressbar"
        progress={progress}
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {progress && progress + "%"}
      </Progress>
    </ProgressContainer>
  );
};

export default ProgressBar;

const Progress = styled.div`
  width: ${props => props.progress}%;
`;

const ProgressContainer = styled.div`
  visibility: ${props => (props.error ? "hidden" : "unset")};
`;
