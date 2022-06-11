import {
  Text,
  View,
  Pressable,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

type dateType = {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
};

const Item = ({
  isItCenter,
  isItLeft,
  isItRight,
  uri,
}: {
  isItCenter: boolean;
  isItLeft: boolean;
  isItRight: boolean;
  uri: string;
}) => (
  <Image
    style={{
      backgroundColor: '#EEEFEF',
      marginRight: isItCenter || isItLeft ? 0.5 : 0,
      marginLeft: isItCenter || isItRight ? 0.5 : 0,
      height: Dimensions.get('window').width / 3,
      flex: 1 / 3,
    }}
    source={{
      uri,
    }}></Image>
);
const Home = ({navigation: {navigate}}: {navigation: {navigate: Function}}) => {
  const [data, setData] = useState<dateType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const renderItem = ({item, index}: {item: dateType; index: number}) => (
    <Item
      isItCenter={index % 3 === 1}
      isItLeft={index % 3 === 0}
      isItRight={index % 3 === 2}
      uri={item.url}
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
        <Text>Loading</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#EEEFEF',
    marginVertical: 1.5,
    // width: Dimensions.get('window').width / 3.05,
    height: Dimensions.get('window').width / 3,
    flex: 1 / 3,
  },
  title: {
    fontSize: 32,
  },
});
export default Home;
