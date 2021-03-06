import styled from "styled-components";

const CloseButton = styled.button`
  background: black;
  color: white;
  font-size: 3rem;
  border: 2px solid ${(props) => props.theme.black};
  position: absolute;
  z-index: 2;
  right: 0;
`;

export default CloseButton;
