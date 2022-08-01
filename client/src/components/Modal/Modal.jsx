import styled from "@emotion/styled";

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 300;
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
  if (!isOpen) return;

  return (
    <ModalContainer isOpen={isOpen}>
      <ModalOverlay onClick={onClose} />
      <ModalContent width={width} height={height}>
        {children}
      </ModalContent>
    </ModalContainer>
  );
};

export default Modal;
