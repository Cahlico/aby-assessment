import styled from "styled-components";

export const StyledButton = styled.button`
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #111;
  color: white;
  font-size: 14px;
  transition: background 0.2s ease;

  &:hover {
    background: #333;
  }
`;
