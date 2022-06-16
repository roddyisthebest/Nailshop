import {Text, View} from 'react-native';
import React from 'react';
import styled from 'styled-components/native';

const ImageViewer = styled.Image``;

const LikeStyle = ({
  route: {
    params: {styleIdx, liked},
  },
}: {
  route: {params: {styleIdx: number; liked: boolean}};
}) => {
  return (
    <View style={{flex: 1}}>
      <Text>{styleIdx}</Text>
    </View>
  );
};

export default LikeStyle;
