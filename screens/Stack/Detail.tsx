import {
  Text,
  View,
  Dimensions,
  Image,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  Share,
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import styled from 'styled-components/native';
import DropShadow from 'react-native-drop-shadow';
import Icon from 'react-native-vector-icons/Ionicons';
import NaverMapView, {Marker} from 'react-native-nmap';
import {ReviewType, Shop, Style} from '../../types';
import {
  getShopByIdx,
  postLikeByIdx,
  deleteLikeByIdx,
  postReservation,
  postShopLike,
  deleteShopLike,
  getReviews,
} from '../../api/shop';
import getTokenAndRefresh from '../../util/getToken';
import EncryptedStorage from 'react-native-encrypted-storage';
import {reset} from '../../store/slice';
import {useDispatch} from 'react-redux';
import ReviewBox from '../../components/ReviewBox';

const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
  position: relative;
`;

const Popup = styled.View`
  align-items: center;
  z-index: 100;
  width: 100%;
  height: 100%;
  background-color: black;
  justify-content: center;
`;

const PopupButtonColumn = styled.View`
  height: 80px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 5px;
  position: absolute;
  width: 100%;
  top: 0;
`;

const PopupupButton = styled.Pressable`
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
`;

const PopupImage = styled.ImageBackground<{width: number}>`
  width: 100%;
  height: ${props => `${props.width}px`};
`;

const DetailImage = styled.Image<{height: number}>`
  width: 100%;
  height: ${props => `${props.height}px`};
  background-color: #eeefef;
`;

const DetailContent = styled.View`
  transform: translateY(-50px);
  padding: 10px 25px 0 25px;
  width: 100%;
`;

const DetailTitleWrapper = styled.View`
  width: 100%;
  padding: 20px;
  background-color: white;
`;

const DetailTitle = styled.View`
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const DetailTitleText = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: black;
`;

const LoveButton = styled.Pressable<{backgroundColor: string}>`
  width: 60px;
  height: 18px;
  background-color: ${props => props.backgroundColor};
  border-width: 1px;
  border-color: ${props =>
    props.backgroundColor === 'white' ? '#eeefef' : 'transparent'};
  margin: 0 7px;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const LoveButtonText = styled.Text<{color: string}>`
  font-size: 8px;
  font-weight: 300;
  color: ${props => props.color};
`;

const ShareButton = styled.Pressable`
  height: 18px;
  width: 18px;
  background-color: white;
  border: 1px solid #eeefef;
  align-items: center;
  justify-content: center;
`;

const Information = styled.View`
  align-items: center;
  flex-direction: row;
`;

const Section = styled.View`
  margin: 30px 0;
  width: 100%;
`;

const SectionBar = styled.View`
  width: 100%;
  height: 2px;
  background-color: #eeefef;
`;
const SectionText = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: black;
  margin-bottom: 20px;
`;

const KeyWordsText = styled.Text`
  font-size: 20px;
  font-weight: 300;
  color: black;
  margin-bottom: 5px;
`;

const MenuButton = styled.TouchableOpacity`
  width: 150px;
  height: 150px;
`;

const MenuImage = styled.Image`
  background-color: #eeefef;
  width: 100%;
  height: 100%;
`;

const ContactButton = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  border-radius: 60px;
  border: 3.5px solid black;
  align-items: center;
  justify-content: center;
`;

// 특정 샵의 디테일 페이지입니다.
// 정보들을 열람할 수 있고 샵 찜하기, 스타일찜하기, 예약하기 기능들이 제공됩니다.

const Detail = ({
  navigation: {navigate},
  route: {
    params: {idx},
  },
}: {
  route: {params: {idx: number}};
  navigation: {navigate: Function};
}) => {
  const dispatch = useDispatch();

  const [like, setLike] = useState<boolean>(false);
  const [data, setData] = useState<Shop>();
  const [phone, setPhone] = useState<string>();
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);

  const [style, setStyle] = useState<Style[]>([]);
  const [styleIndex, setStyleIndex] = useState<number>(0);
  const [render, setRender] = useState<boolean>(false);

  const [review, setReview] = useState<ReviewType[]>();
  const [bookedBefore, setBookedBofore] = useState<boolean>(false);
  const shareShop = useCallback(async (name: string, url: string) => {
    try {
      await Share.share({
        message: url,
        title: name,
      });
    } catch (e) {
      Alert.alert('모종의 이유로 공유가 불가합니다.');
    }
  }, []);

  const setStyleLike = async (liked: boolean, idx: string) => {
    try {
      if (!liked) {
        await postShopLike(parseInt(idx));
        style.splice(styleIndex, 1, {...style[styleIndex], liked: !liked});
        setRender(!render);
      } else {
        await deleteShopLike(parseInt(idx));
        style.splice(styleIndex, 1, {...style[styleIndex], liked: !like});
        setRender(!render);
      }
    } catch (e: any) {
      if (e.response.status === 401 && e.response.data.code === 'A0002') {
        const data = await getTokenAndRefresh();
        if (!data) {
          await EncryptedStorage.clear();
          dispatch(reset());
        } else {
          setStyleLike(liked, idx);
        }
      } else {
        Alert.alert('에러입니다. 다시 로그인해주세요.');
      }
    }
  };

  const getData = async () => {
    try {
      const {data: DetailData} = await getShopByIdx(idx);
      setData(DetailData.data);
    } catch (e: any) {
      if (e.response.status === 401 && e.response.data.code === 'A0002') {
        const data = await getTokenAndRefresh();

        if (!data) {
          await EncryptedStorage.clear();
          dispatch(reset());
        } else {
          getData();
        }
      } else {
        Alert.alert('에러입니다. 다시 로그인해주세요.');
      }
    }
  };
  // https://junggam.click/api/v1/shops/styles/images/
  const renderItem = ({index, item}: {index: number; item: Style}) => (
    <MenuButton
      onPress={() => {
        setStyleIndex(index);
        setPopup(true);
      }}>
      <MenuImage
        source={{
          uri: `https://junggam.click/api/v1/shops/styles/images/${item.images[0].name}`,
        }}
      />
    </MenuButton>
  );

  const toggleLike = async () => {
    try {
      setLikeLoading(true);
      if (!like) {
        const {data} = await postLikeByIdx(idx);
        console.log(data);
        setLike(true);
      } else {
        const {data} = await deleteLikeByIdx(idx);
        console.log(data);
        setLike(false);
      }
    } catch (e: any) {
      if (e.response.status === 401 && e.response.data.code === 'A0002') {
        const data = await getTokenAndRefresh();
        if (!data) {
          await EncryptedStorage.clear();
          dispatch(reset());
        } else {
          toggleLike();
        }
      } else {
        Alert.alert('에러입니다. 다시 로그인해주세요.');
      }
    } finally {
      setLikeLoading(false);
    }
  };

  const makeReservation = useCallback(
    async (type: 'KAKAO' | 'PHONE' | 'MESSAGE') => {
      try {
        const {data} = await postReservation(idx, type);
        console.log(data);
      } catch (e: any) {
        if (e.response.status === 401 && e.response.data.code === 'A0002') {
          const data = await getTokenAndRefresh();
          if (!data) {
            await EncryptedStorage.clear();
            dispatch(reset());
          } else {
            makeReservation(type);
          }
        } else {
          Alert.alert('에러입니다. 다시 로그인해주세요.');
        }
      }
    },
    [],
  );

  const getReviewData = useCallback(async () => {
    try {
      const {data} = await getReviews(0, 2, idx);
      setReview(data.data.contents);
    } catch (e: any) {
      if (e.response.status === 401 && e.response.data.code === 'A0002') {
        const data = await getTokenAndRefresh();
        if (!data) {
          await EncryptedStorage.clear();
          dispatch(reset());
        } else {
          getReviewData();
        }
      } else {
        Alert.alert('에러입니다. 다시 로그인해주세요.');
      }
    }
  }, []);

  const doReservatation = async (type: 'KAKAO' | 'PHONE' | 'MESSAGE') => {
    try {
      await makeReservation(type);

      setBookedBofore(true);
      if (type === 'KAKAO') {
        Linking.openURL(`https://open.kakao.com/o/sP3g8xLd`);
      } else if (type === 'PHONE') {
        Linking.openURL(`tel:${phone}`);
      } else if (type === 'MESSAGE') {
        Linking.openURL(`sms:${phone}`);
      }

      setTimeout(() => {
        Alert.alert(`${type} 이용한 예약이 완료되었습니다.`);
      }, 1);
    } catch (e: any) {
      if (e.response.status === 401 && e.response.data.code === 'A0002') {
        const data = await getTokenAndRefresh();
        if (!data) {
          await EncryptedStorage.clear();
          dispatch(reset());
        } else {
          doReservatation(type);
        }
      } else {
        Alert.alert('에러입니다. 다시 로그인해주세요.');
      }
    }
  };

  useEffect(() => {
    getData();
    getReviewData();
  }, []);

  useEffect(() => {
    if (data) {
      setLike(data.liked);
      if (data.phone) {
        const editedPhone = data.phone.replace(/-/gi, '');
        setPhone(editedPhone);
      }
      if (data.styles) {
        setStyle(data.styles);
      }
      if (data.bookedBefore) {
        setBookedBofore(data.bookedBefore);
      }
    }
  }, [data]);

  return data && review ? (
    <View style={{flex: 1}}>
      <Container>
        <DetailImage
          height={Dimensions.get('window').height / 4}
          source={{
            uri: `https://junggam.click/api/v1/shops/mainImage/${data.shopMainImage.name}`,
          }}></DetailImage>
        <DetailContent>
          <DropShadow
            style={{
              shadowColor: '#171717',
              shadowOffset: {width: 0, height: 3},
              shadowOpacity: 0.25,
              shadowRadius: 2,
            }}>
            <DetailTitleWrapper>
              <DetailTitle>
                <DetailTitleText>
                  {data.name.length < 10
                    ? data.name
                    : data.name.slice(0, 10) + '...'}
                </DetailTitleText>
                <LoveButton
                  disabled={likeLoading}
                  backgroundColor={like ? 'white' : 'red'}
                  onPress={toggleLike}>
                  {likeLoading ? (
                    <ActivityIndicator
                      color={like ? 'black' : 'white'}
                      size={10}
                    />
                  ) : (
                    <>
                      <Icon
                        name={'heart'}
                        size={8}
                        color={like ? 'black' : 'white'}
                      />
                      <LoveButtonText color={like ? 'black' : 'white'}>
                        {like ? '찜 해제' : '찜하기'}
                      </LoveButtonText>
                    </>
                  )}
                </LoveButton>
                <ShareButton
                  onPress={() => {
                    shareShop(
                      data.name,
                      'https://store.coupang.com/vm/vendors/A00520341/products?sourceType=CUSTOM_LINK',
                    );
                  }}>
                  <Icon name="share-social" size={10} color="black"></Icon>
                </ShareButton>
              </DetailTitle>
              <Information style={{marginBottom: 5}}>
                <Icon name={'navigate'} size={15} color="black" />
                <Text style={{fontSize: 10, color: 'black', marginLeft: 10}}>
                  {data.address}
                </Text>
              </Information>
              <Information style={{marginBottom: 5}}>
                <Icon name={'time-outline'} size={15} color="black" />
                <Text style={{fontSize: 10, color: 'black', marginLeft: 10}}>
                  {data.businessHours
                    ? data.businessHours?.toString().includes('영업시간')
                      ? data.businessHours.toString().substring(5)
                      : data.businessHours
                    : '데이터가 없습니다.'}
                </Text>
              </Information>
              <Information>
                <Icon name={'call-outline'} size={15} color="black" />
                <Text style={{fontSize: 10, color: 'black', marginLeft: 10}}>
                  {data.phone ? data.phone : '데이터가 없습니다.'}
                </Text>
              </Information>
            </DetailTitleWrapper>
          </DropShadow>
          <Section>
            <SectionText>위치</SectionText>
            <View
              style={{
                width: '100%',
                height: 200,
                marginTop: 10,
              }}>
              <NaverMapView
                style={{width: '100%', height: '100%'}}
                zoomControl={true}
                center={{
                  zoom: 15,
                  tilt: 0,
                  latitude: data.latitude,
                  longitude: data.longitude,
                }}
                useTextureView={true}>
                <Marker
                  coordinate={{
                    latitude: data.latitude,
                    longitude: data.longitude,
                  }}
                  pinColor="green"
                />
              </NaverMapView>
            </View>
          </Section>
          <SectionBar />
          <Section>
            <SectionText>가격표</SectionText>
            <View
              style={{
                width: '100%',

                marginTop: 10,
              }}>
              {data.images.length === 0 ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 100,
                  }}>
                  <Text>가격표 이미지 데이터가 없습니다.</Text>
                </View>
              ) : (
                <ImageBackground
                  style={{
                    width: '100%',
                    height: 200,
                  }}
                  source={{
                    uri: `https://junggam.click/api/v1/shops/images/${data.images[0].name}`,
                  }}
                  resizeMode="contain"></ImageBackground>
              )}
            </View>
          </Section>
          <SectionBar />
          <Section>
            <SectionText>키워드</SectionText>
            <View
              style={{
                width: '100%',

                marginTop: 10,
              }}>
              {data.tags?.length !== 0 ? (
                data.tags?.map(e => (
                  <KeyWordsText key={e.idx}># {e.name}</KeyWordsText>
                ))
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 100,
                  }}>
                  <Text>키워드 데이터가 없습니다.</Text>
                </View>
              )}
            </View>
          </Section>
          <SectionBar />
          <Section>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: 15,
              }}>
              <SectionText style={{marginBottom: 0}}> 리뷰</SectionText>
              <Pressable
                onPress={() => {
                  navigate('Stacks', {
                    screen: 'Review',
                    params: {idx, bookedBefore},
                  });
                }}>
                <Text style={{fontSize: 10}}>더보기</Text>
              </Pressable>
            </View>
            <View
              style={{
                width: '100%',
                marginTop: 10,
              }}>
              <DropShadow
                style={{
                  shadowColor: '#171717',
                  shadowOffset: {width: 0, height: 5},
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                }}>
                {review.length !== 0 ? (
                  <View style={styles.reviewConainer}>
                    {review.map((e, index) => {
                      return (
                        <ReviewBox
                          key={index}
                          name={e.user.email}
                          score={e.score}
                          content={e.content}
                          idx={e.idx}
                          userIdx={e.idx}
                          isItPre={true}
                          time={e.createdAt}
                          isItLast={index + 1 === review.length}
                          isItFirst={index === 0}></ReviewBox>
                      );
                    })}
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 100,
                    }}>
                    <Text>등록된 리뷰가 없습니다.</Text>
                  </View>
                )}
              </DropShadow>
            </View>
          </Section>
          <SectionBar />
          <Section>
            <SectionText>디자인 목록</SectionText>
            <View
              style={{
                width: '100%',
                marginTop: 10,
              }}>
              {data.styles.length === 0 ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 100,
                  }}>
                  <Text>스타일 데이터가 없습니다.</Text>
                </View>
              ) : (
                <SafeAreaView style={{flex: 1}}>
                  <FlatList
                    data={data.styles}
                    ItemSeparatorComponent={() => <View style={{width: 10}} />}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                  />
                </SafeAreaView>
              )}
            </View>
          </Section>
          <SectionBar />

          <Section>
            <SectionText>Contact</SectionText>
            <View
              style={{
                width: '100%',
                marginTop: 10,
                height: 100,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              {phone ? (
                <>
                  <ContactButton
                    onPress={async () => {
                      doReservatation('PHONE');
                    }}>
                    <Icon name="call" size={20} color="black" />
                  </ContactButton>
                  <ContactButton
                    onPress={async () => {
                      doReservatation('MESSAGE');
                    }}>
                    <Icon name="chatbubble-ellipses" size={20} color="black" />
                  </ContactButton>
                </>
              ) : null}

              <ContactButton
                onPress={async () => {
                  doReservatation('KAKAO');
                }}>
                <Image
                  style={{width: '50%', height: '50%'}}
                  source={require('../../assets/img/kakao_logo.png')}></Image>
              </ContactButton>
            </View>
          </Section>
        </DetailContent>
      </Container>
      {popup ? (
        <Popup>
          <PopupButtonColumn>
            <PopupupButton
              onPress={() => {
                setPopup(false);
              }}>
              <Icon name={'close-outline'} size={30} color="white" />
            </PopupupButton>
            <PopupupButton
              onPress={() => {
                // console.log(style[styleIndex].liked);
                setStyleLike(style[styleIndex].liked, style[styleIndex].idx);
              }}>
              <Icon
                name={style[styleIndex].liked ? 'heart' : 'heart-outline'}
                size={25}
                color="white"
              />
            </PopupupButton>
          </PopupButtonColumn>
          <PopupImage
            source={{
              uri: `https://junggam.click/api/v1/shops/styles/images/${style[styleIndex].images[0].name}`,
            }}
            width={Dimensions.get('window').width}
            resizeMode="contain"></PopupImage>
        </Popup>
      ) : null}
    </View>
  ) : (
    <View style={{flex: 1, alignItems: 'center', marginTop: 30}}>
      <ActivityIndicator color="black" size={50} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reviewConainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#F3F3F3',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
  },
});

export default Detail;
