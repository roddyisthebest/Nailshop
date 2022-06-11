import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Text, Pressable} from 'react-native';

const Container = styled.View`
  background-color: #eeefef;
  padding: 10px 15px;
  width: 100%;
  height: 45px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  flex-direction: row;
`;

const Input = styled.TextInput`
  flex: 1;
  padding: 0;
`;

const Button = styled.TouchableOpacity`
  margin-right: 10px;
  justify-content: center;
`;

const SearchBar = () => {
  return (
    <Container>
      <Button>
        <Icon name="search" size={15} color="#767677"></Icon>
      </Button>
      <Input placeholder="검색"></Input>
      <Input></Input>
    </Container>
  );
};

export default SearchBar;
