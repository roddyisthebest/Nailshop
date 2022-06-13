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
import {getMyInfo} from '../../api/user';
import {getShopList} from '../../api/shop';
import {Shop} from '../../types/index';
type dateType = {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
};

const Home = ({
  navigation: {navigate, setOptions},
}: {
  navigation: {navigate: Function; setOptions: Function};
}) => {
  const [data, setData] = useState<Shop[]>([]);
  const [page, setPage] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(false);

  const renderItem = ({item, index}: {item: Shop; index: number}) => (
    <StoreBox
      isItCenter={index % 3 === 1}
      isItLeft={index % 3 === 0}
      isItRight={index % 3 === 2}
      uri={`https://junggam.click/api/v1/shops/mainImage/${item.shopMainImage.name}`}
      idx={index}
    />
  );

  const getData = async (isItFirst: boolean) => {
    try {
      if (!isItFirst && lastPage === page) {
        return;
      }
      const {data: shopData} = await getShopList(page);
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

  const _handleRefresh = async () => {
    try {
      setRefreshing(true);
      setPage(0);
      const {data: shopData} = await getShopList(page);
      setData(shopData.data.contents);
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };
  const get = async () => {
    try {
      const {data} = await getMyInfo();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // _getData();
    getData(true);
    setOptions({
      headerTitle: () => (
        <View style={{paddingHorizontal: 0}}>
          <SearchBar width={Dimensions.get('window').width - 30}></SearchBar>
        </View>
      ),
      title: '',
    });
    get();
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
            onEndReached={() => {
              if (!disabled) {
                getData(false);
              }
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
