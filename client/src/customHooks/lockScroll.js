const lockScroll = () => {
  const modalElement = document.getElementsByClassName("modal show")[0];

  const enableScrollLock = () => {
    modalElement.style.overflowY = "hidden";
  };
  const disbleScrollLock = () => {
    modalElement.style.overflowY = "overlay";
  };

  return {
    onMouseEnter: enableScrollLock,
    onMouseLeave: disbleScrollLock
  };
};

export default lockScroll;
