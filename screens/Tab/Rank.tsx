import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SearchBar from '../../components/SearchBar';
import RankColumn from '../../components/RankColumn';
import {getShopRanking} from '../../api/shop';
import {Shop} from '../../types';
import getTokenAndRefresh from '../../util/getToken';
import EncryptedStorage from 'react-native-encrypted-storage';
import {reset} from '../../store/slice';
import {useDispatch} from 'react-redux';

// 찜이 많은 순서대로 샵 정보들이 제공되는 페이지입니다.(페이징 처리)
// 샵들의 랭크정보를 확인할 수 있습니다.

const Rank = ({
  navigation: {setOptions},
}: {
  navigation: {setOptions: Function};
}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState<Shop[]>([]);
  const [page, setPage] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(false);
  const renderItem = ({item, index}: {item: Shop; index: number}) => (
    <RankColumn
      uri={`https://junggam.click/api/v1/shops/mainImage/${item.shopMainImage.name}`}
      rank={index}
      idx={item.idx}
      likes={item.likes}></RankColumn>
  );

  const getData = async (isItFirst: boolean) => {
    if (!disabled) {
      try {
        const {data: shopData} = await getShopRanking(page);
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
      const {data: shopData} = await getShopRanking(0);
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
    getData(true);
    setOptions({
      headerTitle: () => (
        <View style={{paddingHorizontal: 0}}>
          <SearchBar width={Dimensions.get('window').width - 30}></SearchBar>
        </View>
      ),
      title: '',
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

export default Rank;
