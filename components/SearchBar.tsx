import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../navigation/Root';

const Container = styled.Pressable`
  background-color: #eeefef;
  padding: 10px 15px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  flex-direction: row;
`;

const Input = styled.TextInput`
  flex: 1;
  padding: 0;
  font-size: 13px;
`;

const Button = styled.Pressable`
  margin-right: 10px;
  justify-content: center;
`;

// Home,Rank 페이지내에서 사용하는 컴포넌트입니다.
// 검색 페이지로 이동시키게 하는 컴포넌트입니다.

const SearchBar = ({width}: {width: number}) => {
  const onSubmit = () => {};
  const navigation = useNavigation<
    NavigationProp<{
      Stacks: {
        screen: string;
      };
    }>
  >();

  return (
    <Container
      style={{width}}
      onPress={() => {
        navigation.navigate('Stacks', {screen: 'Search'});
      }}>
      <Button>
        <Icon name="search" size={13} color="#767677"></Icon>
      </Button>
      <Input
        placeholder="검색"
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        editable={false}></Input>
    </Container>
  );
};

export default SearchBar;
