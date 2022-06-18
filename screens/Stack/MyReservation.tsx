import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RankColumn from '../../components/RankColumn';
import {getShopRanking} from '../../api/shop';
import {Reservation, Shop} from '../../types';
import {getReservationList} from '../../api/user';
import ReservationColumn from '../../components/ReservationColumn';
import getTokenAndRefresh from '../../util/getToken';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useDispatch} from 'react-redux';
import {reset} from '../../store/slice';

// 내가 예약한 리스트 열람 기능이 제공되는 페이지입니다.(페이징 처리)

const MyReservation = ({
  navigation: {setOptions},
}: {
  navigation: {setOptions: Function};
}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Reservation[]>([]);
  const [page, setPage] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(false);
  const renderItem = ({item, index}: {item: Reservation; index: number}) => (
    <ReservationColumn
      uri={`https://junggam.click/api/v1/shops/mainImage/${item.shop.shopMainImage.name}`}
      idx={item.shop.idx}
      name={item.shop.name}
      time={item.createdAt}
      type={item.type}></ReservationColumn>
  );

  const getData = async (isItFirst: boolean) => {
    if (!disabled) {
      try {
        const {data: reservation} = await getReservationList(page);
        if (isItFirst) {
          setLastPage(reservation.data.total_page);
        }
        setData(data.concat(reservation.data.contents));
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
        setLoading(false);
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
      const {data: reservation} = await getReservationList(0);
      setData(reservation.data.contents);
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
    getData(true);
    setOptions({
      title: '예약기록',
    });
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {loading ? (
        <View style={{flex: 1, alignItems: 'center', marginTop: 30}}>
          <ActivityIndicator color="black" size={50} />
        </View>
      ) : data.length !== 0 ? (
        <FlatList
          data={data}
          ItemSeparatorComponent={() => <View style={{height: 15}} />}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => {
            getData(true);
          }}
          refreshing={refreshing}
          onRefresh={_handleRefresh}
          contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 15}}
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', marginTop: 40}}>
          <Text>예약 기록이 없습니다.</Text>
        </View>
      )}
    </View>
  );
};

export default MyReservation;
