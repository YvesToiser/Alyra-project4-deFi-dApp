import { useEffect, useState } from "react";
import styled from "@emotion/styled";

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-radius: 20px;
  transform: translate(-50%, -50%);
  background-color: white;
  overflow: hidden;
`;

const Modal = ({ children, isOpen, onClose, width, height }) => {
  const [isOpenState, setIsOpen] = useState(isOpen);

  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  if (isOpenState)
    return (
      <ModalContainer isOpen={isOpenState}>
        <ModalOverlay onClick={handleClose} />
        <ModalContent width={width} height={height}>
          {children}
        </ModalContent>
      </ModalContainer>
    );

  return null;
};

export default Modal;
