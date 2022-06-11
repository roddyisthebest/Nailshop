import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import SearchBar from '../../components/SearchBar';
import StoreBox from '../../components/StoreBox';
type dateType = {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
};

const Home = ({navigation: {navigate}}: {navigation: {navigate: Function}}) => {
  const [data, setData] = useState<dateType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const renderItem = ({item, index}: {item: dateType; index: number}) => (
    <StoreBox
      isItCenter={index % 3 === 1}
      isItLeft={index % 3 === 0}
      isItRight={index % 3 === 2}
      uri={item.url}
      idx={index}
    />
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
      {/* <Text>Home</Text>
      <Pressable
        onPress={() => {
          navigate('Stacks', {screen: 'Detail'});
        }}>
        <Text>Go stack</Text>
      </Pressable> */}
      <View style={{paddingVertical: 13, paddingHorizontal: 20}}>
        <SearchBar></SearchBar>
      </View>
      {data.length !== 0 ? (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={data}
            ItemSeparatorComponent={() => <View style={{height: 1}} />}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            onEndReached={_getData}
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
