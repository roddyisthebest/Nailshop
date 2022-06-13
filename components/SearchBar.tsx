import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Container = styled.View`
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

const SearchBar = ({width}: {width: number}) => {
  const onSubmit = () => {};

  return (
    <Container style={{width}}>
      <Button>
        <Icon name="search" size={13} color="#767677"></Icon>
      </Button>
      <Input
        placeholder="검색"
        returnKeyType="search"
        onSubmitEditing={onSubmit}></Input>
    </Container>
  );
};

export default SearchBar;
