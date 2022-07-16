import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SearchBar from '../../components/SearchBar';
import StoreBox from '../../components/StoreBox';
import {getShopList} from '../../api/shop';
import {Shop} from '../../types/index';
import Geolocation from '@react-native-community/geolocation';
import getTokenAndRefresh from '../../util/getToken';
import EncryptedStorage from 'react-native-encrypted-storage';

import {useDispatch} from 'react-redux';
import {reset} from '../../store/slice';

// 유저의 위치에 기끼운 순서대로 샵의 리스트들이 제공되는 페이지입니다. (페이징 처리)
// 위치권한을 허용하면 유저의 위치를 기반으로 샵 리스트들의 정보를 가져다줍니다.
// 권한을 허용하지 않으면 서울시 시청을 기반으로 샵 리스트들의 정보를 가져다줍니다.

const Home = ({
  navigation: {navigate, setOptions},
}: {
  navigation: {navigate: Function; setOptions: Function};
}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState<Shop[]>([]);
  const [page, setPage] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(false);

  const [latitude, setLatitude] = useState<number | any>(null);
  const [longitude, setLongitude] = useState<number | any>(null);

  const geoLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        const latitude = JSON.stringify(position.coords.latitude);
        const longitude = JSON.stringify(position.coords.longitude);

        setLatitude(latitude);
        setLongitude(longitude);
      },
      error => {
        setLatitude(37.5666805);
        setLongitude(126.9784147);
        Alert.alert('서울시 시청 위치 기준으로 샵 정보를 가져옵니다.');
      },
      {enableHighAccuracy: false, timeout: 15000},
    );
  };

  const renderItem = ({item, index}: {item: Shop; index: number}) => (
    <StoreBox
      isItCenter={index % 3 === 1}
      isItLeft={index % 3 === 0}
      isItRight={index % 3 === 2}
      uri={`https://junggam.click/api/v1/shops/mainImage/${item.shopMainImage.name}`}
      idx={item.idx}
    />
  );

  const getData = async (isItFirst: boolean) => {
    if (!disabled) {
      try {
        const {data: shopData} = await getShopList(
          page,
          false,
          true,
          longitude,
          latitude,
        );
        console.log(shopData);
        if (isItFirst) {
          setLastPage(shopData.data.total_page);
        }
        setData(data.concat(shopData.data.contents));
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
      }
    }
  };

  useEffect(() => {
    if ((lastPage && lastPage < page) || (lastPage === 0 && page === 0)) {
      setDisabled(true);
    }
  }, [lastPage, page]);

  const _handleRefresh = async () => {
    try {
      setRefreshing(true);
      setPage(0);
      const {data: shopData} = await getShopList(
        0,
        false,
        true,
        longitude,
        latitude,
      );
      setData(shopData.data.contents);
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

  useEffect(() => {
    setOptions({
      headerTitle: () => (
        <View style={{paddingHorizontal: 0, justifyContent: 'center'}}>
          <SearchBar width={Dimensions.get('window').width - 30}></SearchBar>
        </View>
      ),
      title: '',
    });

    geoLocation();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      getData(true);
    }
  }, [latitude, longitude]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* <Text>Home</Text>
      <Pressable
        onPress={() => {
          navigate('Stacks', {screen: 'Detail'});
        }}>
        <Text>Go stack</Text>
      </Pressable> */}

      {data.length !== 0 && latitude && longitude ? (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={data}
            ItemSeparatorComponent={() => <View style={{height: 1}} />}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            onEndReached={() => {
              getData(false);
            }}
            refreshing={refreshing}
            onRefresh={_handleRefresh}
          />
        </SafeAreaView>
      ) : (
        <View style={{flex: 1, alignItems: 'center', marginTop: 30}}>
          <ActivityIndicator color="black" size={50} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
  },
});
export default Home;
