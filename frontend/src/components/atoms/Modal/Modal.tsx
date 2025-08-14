import React, { useEffect } from "react";
import { Button, Modal, ModalProps } from "react-bootstrap";
import "./Modal.css";

const ModalBase: React.FC<
  ModalProps & {
    titleModal?: string | React.ReactNode;
    isShow?: boolean;
    footer?: React.ReactNode;
    closeText?: string;
    confirmText?: string;
    isShowFooter?: boolean;
    timeShowOverflowAuto?: number;
    onClose?: () => void;
  }
> = (props) => {
  useEffect(() => {
    if (props?.isShow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      setTimeout(() => {
        document.body.style.overflow = "auto";
      }, props?.timeShowOverflowAuto || 0);
    };
  }, [props?.isShow, props?.timeShowOverflowAuto]);

  return (
    <Modal
      show={props?.isShow}
      onHide={props?.onClose}
      size="lg"
      centered
      {...props}
      className="modal-base-container"
      onBackdropClick={props?.onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>{typeof props?.titleModal === "string" ? props.titleModal : props.titleModal ?? ""}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props?.children}</Modal.Body>
      {props?.isShowFooter ? (
        <Modal.Footer>
          {props?.footer ? (
            props?.footer
          ) : (
            <>
              <Button variant="primary" onClick={props?.onClose}>
                {props?.confirmText ?? "Ok"}
              </Button>
              <Button variant="secondary" onClick={props?.onClose}>
                {props?.closeText ?? "Close"}
              </Button>
            </>
          )}
        </Modal.Footer>
      ) : null}
    </Modal>
  );
};

export default ModalBase;
