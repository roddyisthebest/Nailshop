import React, {useState} from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {initialStateProps, reset} from '../store/slice';
import {ActivityIndicator, Alert, Pressable} from 'react-native';
import {deleteReview} from '../api/shop';
import EncryptedStorage from 'react-native-encrypted-storage';
import getTokenAndRefresh from '../util/getToken';

const Container = styled.View<{isItLast: boolean}>`
  padding: 20px;
  background-color: white;
  border-bottom-color: ${props => (props.isItLast ? 'none' : '#f1f0f0')};
  border-bottom-width: ${props => (props.isItLast ? 0 : 2)};
`;

const NameText = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: black;
  margin-right: 10px;
`;
const DateText = styled.Text`
  font-size: 10px;
  color: #828282;
  font-weight: 500;
  margin: 0 10px;
`;

const RankText = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: black;
  margin-left: 5px;
`;
const TitleColumn = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;
const RankColumn = styled.View`
  margin: 15px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Contents = styled.View``;
const ContentText = styled.Text`
  color: #828282;
  font-size: 15px;
  font-weight: 300;
`;

const ReviewBox = ({
  name,
  score,
  content,
  userIdx,
  isItPre,
  isItLast,
  isItFirst,
  time,
  idx,
}: {
  name: string;
  score: number;
  content: string;
  userIdx: number;
  isItPre: boolean;
  isItFirst: boolean;
  isItLast: boolean;
  time: string;
  idx: number;
}) => {
  const dispatch = useDispatch();
  const {userInfo} = useSelector((state: initialStateProps) => ({
    userInfo: state.userInfo,
  }));

  const [del, setDel] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const delReview = async () => {
    setLoading(true);
    try {
      await deleteReview(idx);
      setDel(true);
    } catch (e: any) {
      if (e.response.status === 401 && e.response.data.code === 'A0002') {
        const data = await getTokenAndRefresh();
        if (!data) {
          await EncryptedStorage.clear();
          dispatch(reset());
        } else {
          delReview();
        }
      } else {
        Alert.alert('에러입니다. 다시 로그인해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return del ? null : (
    <Container
      isItLast={isItLast}
      style={{
        borderTopLeftRadius: isItFirst ? 10 : 0,
        borderTopRightRadius: isItFirst ? 10 : 0,
        borderBottomLeftRadius: isItLast ? 10 : 0,
        borderBottomRightRadius: isItLast ? 10 : 0,
      }}>
      <TitleColumn>
        <NameText>{name}</NameText>
        <DateText>{moment(time).format('YYYY-MM-DD HH:MM')}</DateText>
        {!isItPre && userIdx === userInfo.idx ? (
          <Pressable onPress={delReview} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="red" size={15} />
            ) : (
              <Icon name={'trash'} size={15} color="red" />
            )}
          </Pressable>
        ) : null}
      </TitleColumn>
      <RankColumn>
        <Icon name={'star'} size={15} color="#FFCC00" />
        <RankText>{score}</RankText>
      </RankColumn>
      <Contents>
        <ContentText>{content}</ContentText>
      </Contents>
    </Container>
  );
};

export default ReviewBox;
