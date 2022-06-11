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
