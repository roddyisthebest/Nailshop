import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SearchBar from '../../components/SearchBar';
import RankColumn from '../../components/RankColumn';
import axios from 'axios';
import {getShopRanking} from '../../api/shop';
import {Shop} from '../../types';

type dateType = {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
};

const Rank = ({
  navigation: {setOptions},
}: {
  navigation: {setOptions: Function};
}) => {
  const [data, setData] = useState<Shop[]>([]);
  const [page, setPage] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(false);
  const renderItem = ({item, index}: {item: Shop; index: number}) => (
    <RankColumn
      uri={`https://junggam.click/api/v1/shops/mainImage/${item.shopMainImage.name}`}
      rank={index}
      idx={item.idx}
      likes={item.likes}></RankColumn>
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
    try {
      if (!isItFirst && lastPage === page) {
        return;
      }
      const {data: shopData} = await getShopRanking(page);
      if (isItFirst) {
        setLastPage(shopData.total_page);
      }
      setData(data.concat(shopData.data.contents));
      if (page === shopData.total_page) {
        setDisabled(true);
        return;
      }
      setPage(page + 1);
    } catch (e) {
      console.log(e);
    }
  };

  // console.log(page, lastPage);
  const _handleRefresh = async () => {
    try {
      setRefreshing(true);
      setPage(0);
      const {data: shopData} = await getShopRanking(0);
      setData(shopData.data.contents);
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
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
            if (!disabled) {
              getData(false);
            }
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
