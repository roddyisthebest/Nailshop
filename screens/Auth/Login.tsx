import {Text, View, Dimensions, Linking, Alert} from 'react-native';
import React, {useCallback} from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import {login} from '../../store/slice';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-evenly;
  background-color: white;
`;

const LogoImage = styled.Image<{width: number; height: number}>`
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
`;

const Button = styled.Pressable<{backColor: string}>`
  height: 50px;
  background-color: ${props => props.backColor};
  flex-direction: row;
  margin-bottom: 10px;
`;

const ButtonLogoWrapper = styled.View`
  flex: 1;
  border-right-color: #0000002d;
  border-right-width: 1px;
  align-items: center;
  justify-content: center;
`;
const ButtonNameWrapper = styled.View`
  flex: 4;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text<{color: string}>`
  font-size: 15px;
  font-weight: 500;
  color: ${props => props.color};
`;
const Login = ({
  navigation: {navigate},
}: {
  navigation: {navigate: Function};
}) => {
  return (
    <Container>
      <LogoImage
        width={120}
        height={120}
        source={require('../../assets/img/nailShopLogo.png')}
      />
      <View>
        <Button
          backColor="#D15442"
          style={{width: Dimensions.get('window').width / 1.5}}
          onPress={() => {
            navigate('Auth', {
              screen: 'SnsLogin',
              params: {
                url: 'https://junggam.click/oauth2/authorization/google',
              },
            });
          }}>
          <ButtonLogoWrapper>
            <Icon name="logo-google" size={20} color="white" />
          </ButtonLogoWrapper>
          <ButtonNameWrapper>
            <ButtonText color="white">구글 아이디 로그인</ButtonText>
          </ButtonNameWrapper>
        </Button>
        <Button
          onPress={() => {
            navigate('Auth', {
              screen: 'SnsLogin',
              params: {
                url: 'https://junggam.click/oauth2/authorization/facebook',
              },
            });
          }}
          backColor="#3b5998"
          style={{width: Dimensions.get('window').width / 1.5}}>
          <ButtonLogoWrapper>
            <Icon name="logo-facebook" size={20} color="white" />
          </ButtonLogoWrapper>
          <ButtonNameWrapper>
            <ButtonText color="white">페이스북 아이디 로그인</ButtonText>
          </ButtonNameWrapper>
        </Button>
        <Button
          backColor="#FBE950"
          style={{width: Dimensions.get('window').width / 1.5}}
          onPress={() => {
            navigate('Auth', {
              screen: 'SnsLogin',
              params: {
                url: 'https://kauth.kakao.com/oauth/authorize?client_id=156355b45fae0e4d87fb007e4d5d3ef7&redirect_uri=https://junggam.click/api/v1/oauth/kakao&response_type=code',
              },
            });
          }}>
          <ButtonLogoWrapper>
            <LogoImage
              width={26}
              height={26}
              source={require('../../assets/img/KakaoTalk_logo.png')}
            />
          </ButtonLogoWrapper>
          <ButtonNameWrapper>
            <ButtonText color="#372929">카카오 아이디 로그인</ButtonText>
          </ButtonNameWrapper>
        </Button>
      </View>
    </Container>
  );
};

export default Login;
