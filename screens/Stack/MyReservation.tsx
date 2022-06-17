import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RankColumn from '../../components/RankColumn';
import {getShopRanking} from '../../api/shop';
import {Reservation, Shop} from '../../types';
import {getReservationList} from '../../api/user';
import ReservationColumn from '../../components/ReservationColumn';

const MyReservation = ({
  navigation: {setOptions},
}: {
  navigation: {setOptions: Function};
}) => {
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
  // const _getData = async () => {
  //   try {
  //     const {data: imageData} = await axios.get(
  //       `https://jsonplaceholder.typicode.com/photos?_limit=13?_page=${page}`,
  //     );
  //     setData(data.concat(imageData));
  //     setPage(page + 1);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  const getData = async (isItFirst: boolean) => {
    if (!disabled) {
      try {
        const {data: reservation} = await getReservationList(page);
        if (isItFirst) {
          setLastPage(reservation.data.total_page);
        }
        setData(data.concat(reservation.data.contents));
        setPage(page => page + 1);
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (lastPage && lastPage < page) {
      setDisabled(true);
    }
  }, [lastPage, page]);

  const _handleRefresh = async () => {
    try {
      setRefreshing(true);
      setPage(0);
      const {data: reservation} = await getReservationList(0);
      setData(reservation.data.contents);
    } catch (e) {
      console.log(e);
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
      {data.length !== 0 ? (
        <FlatList
          data={data}
          ItemSeparatorComponent={() => <View style={{height: 15}} />}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => {
            getData(false);
          }}
          refreshing={refreshing}
          onRefresh={_handleRefresh}
          contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 15}}
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', marginTop: 30}}>
          <ActivityIndicator color="black" size={50} />
        </View>
      )}
    </View>
  );
};

export default MyReservation;
