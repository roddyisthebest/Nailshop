import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../navigation/Root';

const Container = styled.TouchableOpacity`
  border: 2px solid #eeefef;
  border-radius: 15px;
  width: 100%;
  height: 70px;
  flex-direction: row;
`;

const RankWrapper = styled.View`
  flex: 1.9;
  align-items: center;
  justify-content: center;
`;

const RankText = styled.Text`
  font-size: 27px;
  font-weight: 600;
  color: #9c9a9f;
`;

const StoreImage = styled.Image`
  width: 70px;
  height: 100%;
`;

const LoveWrapper = styled.View`
  flex: 4;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const LoveText = styled.Text`
  font-size: 20px;
  font-weight: 400;
  color: #ff0000;
  margin-left: 20px;
`;

// Rank 페이지내에서 사용하는 컴포넌트입니다.
// 등수대로 Shop의 정보를 보여주는데 사용되는 하나의 Column 컴포넌트입니다.
// 매개변수로 idx를 받아 해당 컴포넌트를 클릭하면 해당 idx의 detail 페이지로 이동합니다.

const RankColumn = ({
  uri,
  rank,
  idx,
  likes,
}: {
  uri: string;
  rank: number;
  idx: number;
  likes: number;
}) => {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  return (
    <Container
      onPress={() => {
        navigation.navigate('Stacks', {screen: 'Detail', params: {idx}});
      }}>
      <RankWrapper>
        <RankText>{rank + 1}</RankText>
      </RankWrapper>
      <StoreImage source={{uri}} />
      <LoveWrapper>
        <Icon name="heart" size={20} color={'#ff0000'} />
        <LoveText>{likes}</LoveText>
      </LoveWrapper>
    </Container>
  );
};

export default RankColumn;
