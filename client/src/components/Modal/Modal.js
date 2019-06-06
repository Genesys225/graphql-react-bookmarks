import React from "react";
import $ from "jquery";
const Modal = props => {
  const modalObj = $(`#${props.id}`);

  const showHide = state => {
    modalObj.modal(`${state ? "show" : "hide"}`);
  };

  modalObj.on("hide.bs.modal", () => {
    props.onCancel();
  });

  if (props.isOpen) showHide(true);
  else showHide(false);

  return (
    <>
      <div className={`modal fade`} id={props.id ? props.id : "defaultModal"} role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{props.title}</h5>
              <button type="button" className="close" aria-label="Close" onClick={props.onCancel}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body d-flex align-items-stretch flex-column">
              {props.isOpen && props.children}
            </div>
            {(props.canCancel || props.canConfirm) && (
              <div className="modal-footer mt-4">
                {props.canCancel && (
                  <button className="btn" onClick={props.onCancel}>
                    Cancel
                  </button>
                )}
                {props.canConfirm && (
                  <button className="btn" onClick={props.onConfirm}>
                    {props.confirmText}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
