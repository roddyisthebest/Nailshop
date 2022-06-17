import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import StoreBox from '../../components/StoreBox';
import {getShopList, getStyleList} from '../../api/shop';
import {Shop, Style} from '../../types/index';

const MyStyle = ({
  navigation: {navigate, setOptions},
}: {
  navigation: {navigate: Function; setOptions: Function};
}) => {
  const [data, setData] = useState<Style[]>([]);
  const [page, setPage] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(false);

  const renderItem = ({item, index}: {item: Style; index: number}) => (
    <StoreBox
      isItCenter={index % 3 === 1}
      isItLeft={index % 3 === 0}
      isItRight={index % 3 === 2}
      uri={`https://junggam.click/api/v1/shops/styles/images/${item.images[0].name}`}
      idx={item.shop.idx}
    />
  );

  const getData = async (isItFirst: boolean) => {
    if (!disabled) {
      try {
        const {data: styleData} = await getStyleList(page);
        if (isItFirst) {
          setLastPage(styleData.data.total_page);
        }
        setData(data.concat(styleData.data.contents));
        setPage(page => page + 1);
      } catch (e) {
        console.log(e);
      }
    }
  };

  console.log(data);
  useEffect(() => {
    if (lastPage && lastPage < page) {
      setDisabled(true);
    }
  }, [lastPage, page]);

  const _handleRefresh = async () => {
    try {
      setRefreshing(true);
      setPage(0);
      const {data: styleData} = await getStyleList(0);
      setData(styleData.data.contents);
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
      title: '내가 찜한 스타일',
    });
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
export default MyStyle;
