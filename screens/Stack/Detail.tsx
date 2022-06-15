import {
  Text,
  View,
  Dimensions,
  Image,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import DropShadow from 'react-native-drop-shadow';
import Icon from 'react-native-vector-icons/Ionicons';
import NaverMapView, {Marker} from 'react-native-nmap';
import {Shop} from '../../types';
import {getShopByIdx, postLikeByIdx, deleteLikeByIdx} from '../../api/shop';

const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
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
  font-size: 22px;
  font-weight: 900;
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
  font-weight: 900;
  color: black;
  margin-bottom: 20px;
`;

const KeyWordsText = styled.Text`
  font-size: 20px;
  font-weight: 300;
  color: black;
  margin-bottom: 5px;
`;

const MenuImage = styled.View`
  background-color: #eeefef;
  width: 100px;
  height: 100px;
`;

const ContactButton = styled.Pressable`
  width: 50px;
  height: 50px;
  border-radius: 60px;
  border: 3.5px solid black;
  align-items: center;
  justify-content: center;
`;

const Detail = ({
  route: {
    params: {idx},
  },
}: {
  route: {params: {idx: number}};
}) => {
  const [like, setLike] = useState<boolean>(false);
  const [data, setData] = useState<Shop>();
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  // const getImage = useCallback(async () => {
  //   try {
  //     const {data} =await axios.get(
  //       'https://gscaltexmediahub.com/wp-content/uploads/2018/04/campaign-advertisement-made-by-kids-180413-2.jpg',
  //     );
  //     setFetchImage(true);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, []);

  const getData = async () => {
    try {
      const {data: DetailData} = await getShopByIdx(idx);
      setData(DetailData.data);
    } catch (e) {
      console.log(e);
    }
  };

  const testMenuData = [
    {uri: '', id: 1},
    {uri: '', id: 2},
    {uri: '', id: 3},
    {uri: '', id: 4},
    {uri: '', id: 5},
    {uri: '', id: 6},
    {uri: '', id: 7},
    {uri: '', id: 8},
  ];

  const renderItem = ({item}: {item: any}) => <MenuImage />;

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
    } catch (e) {
      console.log(e);
    } finally {
      setLikeLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data) {
      setLike(data.liked);
    }
  }, [data]);

  return data ? (
    <Container>
      <DetailImage
        height={Dimensions.get('window').height / 4}
        source={{
          uri: 'https://ms-housing.kr/data/file/commercial_gallery/238359480_9WMSZO5G_bd5c18f2abe382fb72c35adeda10747fee1c6302.JPG',
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
              <DetailTitleText>{data.name}</DetailTitleText>
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
              <ShareButton>
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
              zoomControl={false}
              center={{
                zoom: 15,
                tilt: 0,
                latitude: 35.8666799,
                longitude: 128.7315022,
              }}>
              <Marker
                coordinate={{
                  latitude: 35.8666799,
                  longitude: 128.7315022,
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
              height: 200,
              marginTop: 10,
            }}>
            <Image
              style={{
                width: '100%',
                height: '100%',
              }}
              source={{
                uri: 'https://mblogthumb-phinf.pstatic.net/20130212_168/lulueyelash2_1360656212622FtqN5_JPEG/%C1%A9%B3%D7%C0%CF%BE%C6%C6%AE%B0%A1%B0%DD2.jpg?type=w2',
              }}></Image>
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
            <KeyWordsText># 친절해요</KeyWordsText>
            <KeyWordsText># 원하는 스타일로 잘해줘요</KeyWordsText>
            <KeyWordsText># 시술이 꼼꼼해요</KeyWordsText>
            <KeyWordsText># 관리법을 잘 알려줘요</KeyWordsText>
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
            <SafeAreaView style={{flex: 1}}>
              <FlatList
                data={testMenuData}
                ItemSeparatorComponent={() => <View style={{width: 10}} />}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
              />
            </SafeAreaView>
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
            <ContactButton>
              <Icon name="call" size={20} color="black" />
            </ContactButton>
            <ContactButton>
              <Icon name="chatbubble-ellipses" size={20} color="black" />
            </ContactButton>
            <ContactButton>
              <Image
                style={{width: '50%', height: '50%'}}
                source={require('../../assets/img/kakao_logo.png')}></Image>
            </ContactButton>
          </View>
        </Section>
      </DetailContent>
    </Container>
  ) : (
    <View style={{flex: 1, alignItems: 'center', marginTop: 30}}>
      <ActivityIndicator color="black" size={50} />
    </View>
  );
};

export default Detail;
