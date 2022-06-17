import {Text, View, Pressable} from 'react-native';
import React from 'react';
import styled from 'styled-components/native';
import NavigationButton from '../../components/NavigateButton';
import {useDispatch} from 'react-redux';
import {login} from '../../store/slice';
const Section = styled.View<{isItLast: boolean}>`
  border-bottom-color: ${props => (!props.isItLast ? '#eeefef' : 'none')};
  border-bottom-width: ${props => (!props.isItLast ? '1px' : '0px')};
  padding: 20px;
`;

const HeaderText = styled.Text`
  color: black;
  font-weight: 900;
  font-size: 25px;
  margin-bottom: 15px;
`;

const LogoutText = styled.Text`
  color: red;
  font-size: 15px;
  font-weight: 500;
`;

const MyInfo = ({
  navigation: {navigate},
}: {
  navigation: {navigate: Function};
}) => {
  const dispatch = useDispatch();

  const goSomewhere = (screen: string) => {
    navigate('Stacks', {screen});
  };

  const logout = () => {
    dispatch(login(false));
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <Section isItLast={false}>
        <HeaderText>정보 관리</HeaderText>
        <NavigationButton
          marginBottom={true}
          text="회원정보 수정"
          func={goSomewhere}
          screen="Edit"></NavigationButton>
        <Pressable onPress={logout}>
          <LogoutText>로그아웃</LogoutText>
        </Pressable>
      </Section>
      <Section isItLast={false}>
        <HeaderText>찜하기</HeaderText>
        <NavigationButton
          marginBottom={true}
          text="내가 찜한 가게"
          func={goSomewhere}
          screen="MyStore"></NavigationButton>
        <NavigationButton
          marginBottom={false}
          text="내가 찜한 디자인"
          func={goSomewhere}
          screen="MyStyle"></NavigationButton>
      </Section>
      <Section isItLast={true}>
        <HeaderText>예약현황</HeaderText>
        <NavigationButton
          marginBottom={false}
          text="예약 기록"
          func={goSomewhere}
          screen="MyReservation"></NavigationButton>
      </Section>
    </View>
  );
};

export default MyInfo;
