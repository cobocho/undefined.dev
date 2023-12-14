import { ThemeFlag } from '@/hooks/useThemeToggle';
import React, { memo } from 'react';
import styled from 'styled-components';

interface Props {
  currentTheme: ThemeFlag;
}

const ThemeButton = ({ currentTheme }: Props) => {
  return (
    <Container currentTheme={currentTheme}>
      <span>다크 모드 버튼</span>
    </Container>
  );
};

const Container = styled.button<Props>`
  position: absolute;

  width: 30px;
  height: 30px;

  border: none;
  border-radius: 50%;

  background-color: ${({ theme }) => theme.togglerButtonColor};

  box-shadow: ${({ theme }) => theme.togglerButtonShadow};

  transform: ${(props) => (props.currentTheme === ThemeFlag.dark ? 'translateX(30px)' : 'translateX(0)')};
  transition: all 0.3s;

  &:hover {
    cursor: pointer;
  }
`;

export default memo(ThemeButton);
