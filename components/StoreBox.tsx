import React from 'react';
import {Dimensions, Image, TouchableOpacity} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../navigation/Root';

// MyStore, MyStyle, Home, Search 페이지내에서 사용하는 컴포넌트입니다.
// 특정 샵의 디테일 페이지로 이동시키케 하는 버튼 컴포넌트입니다.
// 매개변수로 샵의 idx를 받아 특정 샵의 디테일 페이지로 이동합니다.

const StoreBox = ({
  isItCenter,
  isItLeft,
  isItRight,
  uri,
  idx,
}: {
  isItCenter: boolean;
  isItLeft: boolean;
  isItRight: boolean;
  uri: string;
  idx: number;
}) => {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  return (
    <TouchableOpacity
      style={{
        marginRight: isItCenter || isItLeft ? 0.5 : 0,
        marginLeft: isItCenter || isItRight ? 0.5 : 0,
        height: Dimensions.get('window').width / 3,
        flex: 1 / 3,
      }}
      onPress={() => {
        navigation.navigate('Stacks', {screen: 'Detail', params: {idx}});
      }}>
      <Image
        style={{width: '100%', height: '100%', backgroundColor: '#eeefef'}}
        source={{
          uri,
        }}></Image>
    </TouchableOpacity>
  );
};

export default StoreBox;
