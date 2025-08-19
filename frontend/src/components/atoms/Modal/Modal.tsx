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
    onBackdropClick?: () => void;
  }
> = ({ isShow, isShowFooter, onBackdropClick, titleModal, footer, closeText, confirmText, timeShowOverflowAuto, onClose, ...props }) => {
  useEffect(() => {
    if (isShow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      setTimeout(() => {
        document.body.style.overflow = "auto";
      }, timeShowOverflowAuto || 0);
    };
  }, [isShow, timeShowOverflowAuto]);

  console.log('ModalBase render - isShow:', isShow, 'props children:', props.children);
  
  return (
    <Modal
      show={isShow}
      onHide={onClose}
      size="lg"
      centered
      {...props}
      className="modal-base-container"
      style={{ zIndex: 9999 }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{typeof titleModal === "string" ? titleModal : titleModal ?? ""}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props?.children}</Modal.Body>
      {isShowFooter ? (
        <Modal.Footer>
          {footer ? (
            footer
          ) : (
            <>
              <Button variant="primary" onClick={onClose}>
                {confirmText ?? "Ok"}
              </Button>
              <Button variant="secondary" onClick={onClose}>
                {closeText ?? "Close"}
              </Button>
            </>
          )}
        </Modal.Footer>
      ) : null}
    </Modal>
  );
};

export default ModalBase;
