import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Container = styled.Pressable`
  align-items: center;
  flex-direction: row;
`;

const ButtonText = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: black;
  margin-right: 10px;
`;

// MyInfo 페이지내에서 사용되는 네비게이션 버튼 컴포넌트입니다.
// 매개변수로 navigate의 코드를 실행하는 함수 , 이동하고싶은 페이지명을 받아 페이지 이동을 가능캐 합니다.

const NavigationButton = ({
  text,
  func,
  screen,
  marginBottom,
}: {
  text: string;
  func: Function;
  screen: string;
  marginBottom: boolean;
}) => {
  return (
    <Container
      style={{marginBottom: marginBottom ? 8 : 0}}
      onPress={() => {
        func(screen);
      }}>
      <ButtonText>{text}</ButtonText>
      <Icon name="chevron-forward" color="black" size={15}></Icon>
    </Container>
  );
};

export default NavigationButton;
