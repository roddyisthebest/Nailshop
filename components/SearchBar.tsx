import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../navigation/Root';
import {Platform} from 'react-native';

const Container = styled.Pressable<{isItIos: boolean}>`
  background-color: #eeefef;
  height: ${props => (props.isItIos ? '85%' : '80%')};
  border-radius: 7.5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const ButtonText = styled.Text`
  flex: 1;
  padding: 0;
  font-size: 12.5px;
  color: #767677;
  margin-left: 8px;
`;

const Button = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 10px;
  flex-direction: row;
`;

// Home,Rank 페이지내에서 사용하는 컴포넌트입니다.
// 검색 페이지로 이동시키게 하는 컴포넌트입니다.

const SearchBar = ({width}: {width: number}) => {
  // console.log(Platform.OS);

  const navigation = useNavigation<
    NavigationProp<{
      Stacks: {
        screen: string;
      };
    }>
  >();

  return (
    <Container
      isItIos={Platform.OS === 'ios'}
      style={{width}}
      onPress={() => {
        navigation.navigate('Stacks', {screen: 'Search'});
      }}>
      <Button>
        <Icon name="search" size={12.5} color="#767677"></Icon>
        <ButtonText>검색하기</ButtonText>
      </Button>
    </Container>
  );
};

export default SearchBar;
