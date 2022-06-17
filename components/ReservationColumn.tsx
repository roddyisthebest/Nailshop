import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../navigation/Root';
import {Image, Text, View} from 'react-native';
import moment from 'moment';

const Container = styled.View`
  width: 100%;
  height: 100px;
  flex-direction: row;
`;

const StoreImage = styled.Image`
  width: 100px;
  height: 100%;
  background-color: lightgray;
`;

const StoreInfo = styled.View`
  flex: 1;
`;

const StoreMainInfo = styled.View`
  flex: 3;
`;
const StoreDetailInfo = styled.View`
  flex: 1;
  align-items: flex-end;
  justify-content: flex-end;
`;
const StoreTitleText = styled.Text`
  font-size: 20px;
  font-weight: 800;
  color: black;
`;
const StoreMainInfoColumn = styled.View`
  align-items: center;
  flex-direction: row;
`;
const StoreDefaultText = styled.Text`
  font-size: 10px;
  font-weight: 300;
  color: black;
  margin-left: 6px;
`;
const StoreDetailButton = styled.Pressable`
  width: 85px;
  height: 22.5px;
  background-color: #eeefef;
  border-radius: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const ReservationColumn = ({
  uri,
  name,
  idx,
  time,
  type,
}: {
  uri: string;
  name: string;
  idx: number;
  time: any;
  type: 'MESSAGE' | 'PHONE' | 'KAKAO';
}) => {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  return (
    <Container>
      <StoreImage source={{uri}} />
      <View style={{height: '100%', width: 15}}></View>
      <StoreInfo>
        <StoreMainInfo>
          <StoreTitleText style={{marginBottom: 5}}>{name}</StoreTitleText>
          <StoreMainInfoColumn style={{marginBottom: 2.5}}>
            <Icon name="time-outline" size={15} color="black" />
            <StoreDefaultText>
              {moment(time).format('YYYY-MM-DD HH:MM')}
            </StoreDefaultText>
          </StoreMainInfoColumn>
          <StoreMainInfoColumn style={{marginBottom: 20}}>
            {type === 'PHONE' ? (
              <Icon name="call" size={15} color="black" />
            ) : null}
            {type === 'MESSAGE' ? (
              <Icon name="chatbubble" size={15} color="black" />
            ) : null}
            {type === 'KAKAO' ? (
              <Image
                style={{width: 15, height: 15}}
                source={require('../assets/img/KakaoTalk_logo.png')}></Image>
            ) : null}
            <StoreDefaultText>Using {type}</StoreDefaultText>
          </StoreMainInfoColumn>
        </StoreMainInfo>
        <StoreDetailInfo>
          <StoreDetailButton
            onPress={() => {
              navigation.navigate('Stacks', {screen: 'Detail', params: {idx}});
            }}>
            <Icon name="eye-outline" size={10} color="#6D6D6D" />
            <Text style={{color: '#6D6D6D', fontSize: 8.5}}>가게 상세정보</Text>
          </StoreDetailButton>
        </StoreDetailInfo>
      </StoreInfo>
    </Container>
  );
};

export default ReservationColumn;
