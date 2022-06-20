import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Rating} from 'react-native-ratings';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {getReviews, postReview} from '../../api/shop';
import ReviewBox from '../../components/ReviewBox';
import {reset} from '../../store/slice';
import {ReviewType} from '../../types';
import getTokenAndRefresh from '../../util/getToken';

const ReviewInput = styled.View`
  width: 100%;
  padding: 40px 25px;
  background-color: white;
  margin-bottom: 15px;
  border-radius: 10px;
  justify-content: center;
`;

const ReviewTitleWrapper = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 25px;
  margin-bottom: 20px;
`;

const ReviewTitle = styled.Text`
  font-size: 18px;
  color: black;
  font-weight: 600;
`;

const ReviewTextArea = styled.TextInput`
  border: 1px solid #cdcaca;
  width: 100%;
  height: 150px;
  background-color: white;
  color: black;
  border-radius: 15px;
  padding: 20px;
`;

const EnrollButton = styled.Pressable<{dis: boolean}>`
  width: 100%;
  height: 50px;
  background-color: #00cf72;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  opacity: ${props => (props.dis ? 0.3 : 1)};
`;

const ErollmentText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;
const Review = ({
  route: {
    params: {idx, bookedBefore},
  },
}: {
  route: {params: {idx: number; bookedBefore: boolean}};
}) => {
  const dispatch = useDispatch();

  const [data, setData] = useState<ReviewType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [lastPage, setLastpage] = useState<number>();
  const [reviewText, setReviewText] = useState<string>('');
  const [score, setScore] = useState<number>(2.5);
  const [loading, setLoading] = useState<boolean>(false);
  const [send, setSend] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const postData = useCallback(async () => {
    try {
      setLoading(true);
      await postReview(idx, reviewText, score);
      setSend(true);
      setRefreshing(true);
      _handleRefresh();
    } catch (e: any) {
      if (e.response.status === 401 && e.response.data.code === 'A0002') {
        const data = await getTokenAndRefresh();
        if (!data) {
          await EncryptedStorage.clear();
          dispatch(reset());
        } else {
          postData();
        }
      } else {
        Alert.alert('에러입니다. 다시 로그인해주세요.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [idx, reviewText, score]);

  const getData = async (isItFirst: boolean) => {
    if (!disabled) {
      try {
        const {data: reviewData} = await getReviews(page, 5, idx);
        if (isItFirst) {
          setLastpage(reviewData.data.total_page);
        }
        setData(data.concat(reviewData.data.contents));
        setPage(page => page + 1);
      } catch (e: any) {
        if (e.response.status === 401 && e.response.data.code === 'A0002') {
          const data = await getTokenAndRefresh();
          if (!data) {
            await EncryptedStorage.clear();
            dispatch(reset());
          } else {
            getData(true);
          }
        } else {
          Alert.alert('에러입니다. 다시 로그인해주세요.');
        }
      } finally {
        setDataLoading(false);
      }
    }
  };

  useEffect(() => {
    getData(true);
  }, []);

  useEffect(() => {
    if ((lastPage && lastPage < page) || (lastPage === 0 && page === 0)) {
      setDisabled(true);
    }
  }, [lastPage, page]);

  useEffect(() => {
    console.log(disabled);
  }, [disabled]);

  const _handleRefresh = async () => {
    try {
      setRefreshing(true);
      setPage(0);
      const {data: reviewData} = await getReviews(0, 5, idx);
      setData(reviewData.data.contents);
    } catch (e: any) {
      if (e.response.status === 401 && e.response.data.code === 'A0002') {
        const data = await getTokenAndRefresh();
        if (!data) {
          await EncryptedStorage.clear();
          dispatch(reset());
        } else {
          _handleRefresh();
        }
      } else {
        Alert.alert('에러입니다. 다시 로그인해주세요.');
      }
    } finally {
      setRefreshing(false);
      setDisabled(false);
      setPage(page => page + 1);
    }
  };

  const renderItem = ({item, index}: {item: ReviewType; index: number}) => (
    <ReviewBox
      name={item.user.email}
      score={item.score}
      content={item.content}
      userIdx={item.user.idx}
      idx={item.idx}
      isItPre={false}
      isItLast={index + 1 === data?.length}
      isItFirst={index === 0}
      time={item.createdAt}></ReviewBox>
  );
  return (
    <View style={{flex: 1, backgroundColor: '#F1F0F0'}}>
      {!dataLoading ? (
        data.length !== 0 ? (
          <SafeAreaView style={{flex: 1}}>
            <FlatList
              ListHeaderComponent={
                bookedBefore ? (
                  <ReviewInput>
                    {send ? (
                      <ReviewTitleWrapper style={{marginBottom: 0}}>
                        <ReviewTitle>회원님의 소중한 리뷰가</ReviewTitle>
                        <ReviewTitle>성공적으로 등록 되었습니다. </ReviewTitle>
                      </ReviewTitleWrapper>
                    ) : (
                      <>
                        <ReviewTitleWrapper>
                          <ReviewTitle>이 네일샵을 추천하시겠어요?</ReviewTitle>
                        </ReviewTitleWrapper>
                        <View>
                          <Rating
                            type="star"
                            ratingColor="#FFCC00"
                            ratingBackgroundColor="#c8c7c8"
                            ratingCount={5}
                            onFinishRating={(value: number) => {
                              setScore(value);
                            }}
                            style={{paddingVertical: 10}}
                            showRating={true}
                            fractions={1}
                          />
                        </View>
                        <View
                          style={{
                            height: 1,
                            width: '100%',
                            backgroundColor: '#F3F3F3',
                            marginVertical: 25,
                          }}></View>
                        <View>
                          <ReviewTextArea
                            placeholder="리뷰를 작성해보세요."
                            multiline={true}
                            onChangeText={(text: string) => {
                              setReviewText(text);
                            }}
                            value={reviewText}
                            style={{textAlignVertical: 'top'}}></ReviewTextArea>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            height: 50,
                          }}>
                          <Text>{`${reviewText.length}/500`}</Text>
                        </View>
                        <EnrollButton
                          disabled={
                            reviewText.length > 500 ||
                            reviewText.length === 0 ||
                            loading
                          }
                          dis={
                            reviewText.length > 500 ||
                            reviewText.length === 0 ||
                            loading
                          }
                          onPress={postData}>
                          {loading ? (
                            <ActivityIndicator color="white" size={18} />
                          ) : (
                            <ErollmentText>등록 완료</ErollmentText>
                          )}
                        </EnrollButton>
                      </>
                    )}
                  </ReviewInput>
                ) : null
              }
              data={data}
              // ItemSeparatorComponent={() => <View style={{height: 15}} />}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={() => {
                getData(false);
              }}
              refreshing={refreshing}
              onRefresh={_handleRefresh}
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingVertical: 15,
              }}
            />
          </SafeAreaView>
        ) : bookedBefore ? (
          <View style={{alignItems: 'center'}}>
            <ReviewInput style={{width: '90%', marginTop: 15}}>
              {send ? (
                <ReviewTitleWrapper style={{marginBottom: 0}}>
                  <ReviewTitle>회원님의 소중한 리뷰가</ReviewTitle>
                  <ReviewTitle>성공적으로 등록 되었습니다. </ReviewTitle>
                </ReviewTitleWrapper>
              ) : (
                <View>
                  <ReviewTitleWrapper>
                    <ReviewTitle>이 네일샵을 추천하시겠어요?</ReviewTitle>
                  </ReviewTitleWrapper>
                  <View>
                    <Rating
                      type="star"
                      ratingColor="#FFCC00"
                      ratingBackgroundColor="#c8c7c8"
                      ratingCount={5}
                      onFinishRating={(value: number) => {
                        setScore(value);
                      }}
                      style={{paddingVertical: 10}}
                      showRating={true}
                      fractions={1}
                    />
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: '100%',
                      backgroundColor: '#F3F3F3',
                      marginVertical: 25,
                    }}></View>
                  <View>
                    <ReviewTextArea
                      placeholder="리뷰를 작성해보세요."
                      multiline={true}
                      onChangeText={(text: string) => {
                        setReviewText(text);
                      }}
                      value={reviewText}
                      style={{textAlignVertical: 'top'}}></ReviewTextArea>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      height: 50,
                    }}>
                    <Text>{`${reviewText.length}/500`}</Text>
                  </View>
                  <EnrollButton
                    disabled={
                      reviewText.length > 500 ||
                      reviewText.length === 0 ||
                      loading
                    }
                    dis={
                      reviewText.length > 500 ||
                      reviewText.length === 0 ||
                      loading
                    }
                    onPress={postData}>
                    {loading ? (
                      <ActivityIndicator color="white" size={18} />
                    ) : (
                      <ErollmentText>등록 완료</ErollmentText>
                    )}
                  </EnrollButton>
                </View>
              )}
            </ReviewInput>
          </View>
        ) : (
          <View style={{flex: 1, backgroundColor: 'white'}}>
            <ReviewTitleWrapper style={{marginTop: 30}}>
              <ReviewTitle>등록된 리뷰가 없습니다.</ReviewTitle>
            </ReviewTitleWrapper>
          </View>
        )
      ) : (
        <View style={{flex: 1, alignItems: 'center', marginTop: 30}}>
          <ActivityIndicator color="black" size={50} />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  reviewConainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#F3F3F3',
    borderRadius: 10,
  },
});
export default Review;
