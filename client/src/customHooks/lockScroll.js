const lockScroll = () => {
  const modalElement = document.getElementsByClassName("modal show")[0];
  const defaultScrollElement = modalElement ? modalElement : window;
  const enableScrollLock = () => {
    defaultScrollElement.style.overflowY = "hidden";
  };
  const disbleScrollLock = () => {
    defaultScrollElement.style.overflowY = "overlay";
  };

  return {
    onMouseEnter: enableScrollLock,
    onMouseLeave: disbleScrollLock
  };
};
export default lockScroll;
