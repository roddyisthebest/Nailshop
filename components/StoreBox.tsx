import React from 'react';
import {Dimensions, Image, TouchableOpacity} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../navigation/Root';

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
        style={{width: '100%', height: '100%'}}
        source={{
          uri,
        }}></Image>
    </TouchableOpacity>
  );
};

export default StoreBox;
