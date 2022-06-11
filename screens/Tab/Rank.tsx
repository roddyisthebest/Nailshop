import {FlatList, Text, View, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import SearchBar from '../../components/SearchBar';
import RankColumn from '../../components/RankColumn';
import axios from 'axios';

type dateType = {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
};

const Rank = () => {
  const [data, setData] = useState<dateType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const renderItem = ({item, index}: {item: dateType; index: number}) => (
    <RankColumn uri={item.url} rank={index} idx={index}></RankColumn>
  );
  const _getData = async () => {
    try {
      const {data: imageData} = await axios.get(
        `https://jsonplaceholder.typicode.com/photos?_limit=13?_page=${page}`,
      );
      setData(data.concat(imageData));
      setPage(page + 1);
    } catch (e) {
      console.log(e);
    }
  };

  const _handleRefresh = async () => {
    try {
      setRefreshing(true);
      setPage(0);
      const {data: imageData} = await axios.get(
        `https://jsonplaceholder.typicode.com/photos?_limit=13?_page=${page}`,
      );
      setData(imageData);
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    _getData();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{paddingVertical: 13, paddingHorizontal: 15}}>
        <SearchBar></SearchBar>
      </View>
      {data.length !== 0 ? (
        <FlatList
          data={data}
          ItemSeparatorComponent={() => <View style={{height: 15}} />}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={_getData}
          refreshing={refreshing}
          onRefresh={_handleRefresh}
          contentContainerStyle={{paddingHorizontal: 15}}
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
