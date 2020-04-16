import styled from 'styled-components';

const Item = styled.div`
  background: white;
  border: 1px solid ${(props) => props.theme.offWhite};
  box-shadow: ${(props) => props.theme.bs};
  position: relative;
  display: flex;
  flex-direction: column;
  position: relative;
  &:hover {
    /* cursor: pointer; */
    img {
      filter: blur(2px);
    }
    .buttonList {
      display: grid;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
    }
  }
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    transition: filter 0.3s ease-in-out;
  }
  p {
    line-height: 2;
    font-weight: 300;
    flex-grow: 1;
    padding: 0 3rem;
    font-size: 1.5rem;
  }
  .buttonList {
    display: none;
    width: 100%;
    border: 2px solid ${(props) => props.theme.lightgrey};
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-gap: 1px;
    background: ${(props) => props.theme.lightgrey};
    & > * {
      background: white;
      border: 0;
      font-size: 1.2rem;
      padding: 1rem;
      color: ${(props) => props.theme.black};
      font-weight: 600;
      transition: color 0.3s ease-in-out;
      &:hover {
        color: ${(props) => props.theme.red};
      }
    }
  }
`;

export default Item;
