import {Pressable, Text, View} from 'react-native';
import React, {useCallback, useEffect, useId, useState} from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {initialStateProps, setDigit} from '../../store/slice';
import {changePhoneNumber} from '../../api/user';

const UserImageWrapper = styled.View`
  align-items: center;
  justify-content: center;
  height: 170px;
  border-bottom-color: #ececec;
  border-bottom-width: 1px;
`;

const UserInfoWrapper = styled.View`
  padding: 0 30px;
`;

const UserInfoColumn = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Key = styled.View`
  padding: 20px 0;
  flex: 1;
`;

const Value = styled.View`
  padding: 20px 0;
  flex: 2;
  border-bottom-color: #ececec;
  border-bottom-width: 1px;
`;

const UserInfoText = styled.Text<{editable: boolean}>`
  font-size: 15px;
  font-weight: 300;
  color: black;
`;
const Input = styled.TextInput`
  flex: 1;
  padding: 0;
  font-size: 15px;
`;

const Edit = ({
  navigation: {setOptions, goBack},
}: {
  navigation: {setOptions: Function; goBack: Function};
}) => {
  const dispatch = useDispatch();

  const [phone, setPhone] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);

  const {userInfo} = useSelector((state: initialStateProps) => ({
    userInfo: state.userInfo,
  }));

  const changePhone = useCallback(async (phone: string) => {
    try {
      await changePhoneNumber(phone);
      dispatch(setDigit(phone));
      goBack();
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    setOptions({
      headerRight: () =>
        !disabled ? (
          <Pressable
            disabled={disabled}
            onPress={() => {
              changePhone(phone);
            }}>
            <Text style={{color: '#63C7FF', fontSize: 15, fontWeight: '300'}}>
              완료
            </Text>
          </Pressable>
        ) : null,
    });
  }, [disabled]);

  useEffect(() => {
    setPhone(userInfo.phone);
  }, [userInfo]);

  useEffect(() => {
    console.log(phone.length);
    if (phone.length === 11 && userInfo.phone !== phone) {
      setDisabled(false);
    } else if (!disabled) {
      setDisabled(true);
    }
  }, [phone]);

  console.log(disabled);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <UserImageWrapper>
        <Icon name="person-circle-outline" size={80} color="black" />
      </UserImageWrapper>
      <UserInfoWrapper>
        <UserInfoColumn>
          <Key>
            <UserInfoText editable={false}>이메일</UserInfoText>
          </Key>
          <Value>
            <UserInfoText editable={false}>{userInfo.email}</UserInfoText>
          </Value>
        </UserInfoColumn>
        <UserInfoColumn>
          <Key>
            <UserInfoText editable={false}>전화번호</UserInfoText>
          </Key>
          <Value>
            <Input
              value={phone}
              onChangeText={(text: string) => {
                setPhone(text);
              }}></Input>
          </Value>
        </UserInfoColumn>
        <UserInfoColumn>
          <Key>
            <UserInfoText editable={false}>연결된 계정</UserInfoText>
          </Key>
          <Value>
            <UserInfoText editable={false}>{userInfo.oauth}</UserInfoText>
          </Value>
        </UserInfoColumn>
      </UserInfoWrapper>
    </View>
  );
};

export default Edit;
