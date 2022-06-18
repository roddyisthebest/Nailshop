import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {searchShopList} from '../../api/shop';
import StoreBox from '../../components/StoreBox';
import {reset} from '../../store/slice';
import {Shop} from '../../types';
import getTokenAndRefresh from '../../util/getToken';

const SearchBar = styled.View`
  background-color: #eeefef;
  padding: 10px 15px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  align-items: center;
`;

const Input = styled.TextInput`
  flex: 1;
  padding: 0;
  font-size: 10px;
  padding-right: 10px;
`;

const Button = styled.Pressable`
  justify-content: center;
`;
const Popup = styled.View`
  align-items: center;
  z-index: 100;
  width: 100%;
  height: 100%;
  background-color: #0000005a;
  justify-content: center;
  position: absolute;
`;

const PopupButtonBoxWrapper = styled.View`
  width: 70%;
  background-color: white;
`;

const PopupButtonBox = styled.Pressable`
  width: 100%;
  height: 50px;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

// 특정 키워드로 특정 샵 검색 기능이 제공되는 페이지입니다. (페이징 처리)
// 이름, 위치, 태그대로 검색이 가능합니다.

const Search = ({
  navigation: {setOptions, goBack},
}: {
  navigation: {setOptions: Function; goBack: Function};
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>();
  const [searchKey, setSearchKey] = useState<string>('name');
  const [data, setData] = useState<Shop[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [popup, setPopup] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    setOptions({
      headerShown: false,
    });
  }, []);

  const getData = async () => {
    if (!disabled) {
      try {
        const {data: searchData} = await searchShopList(
          page,
          searchKey,
          keyword,
        );
        setData(data.concat(searchData.data.contents));
        setPage(page => page + 1);
      } catch (e: any) {
        if (e.response.status === 401 && e.response.data.code === 'A0002') {
          const data = await getTokenAndRefresh();
          if (!data) {
            await EncryptedStorage.clear();
            dispatch(reset());
          } else {
            getData();
          }
        } else {
          Alert.alert('에러입니다. 다시 로그인해주세요.');
        }
      }
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      setPage(0);
      const {data: searchData} = await searchShopList(0, searchKey, keyword);
      setLastPage(searchData.data.total_page);
      setPage(page => page + 1);
      setData(searchData.data.contents);
    } catch (e: any) {
      if (e.response.status === 401 && e.response.data.code === 'A0002') {
        const data = await getTokenAndRefresh();
        if (!data) {
          await EncryptedStorage.clear();
          dispatch(reset());
        } else {
          onSubmit();
        }
      } else {
        Alert.alert('에러입니다. 다시 로그인해주세요.');
      }
    } finally {
      setLoading(false);
    }
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
  useEffect(() => {
    if ((lastPage && lastPage < page) || (lastPage === 0 && page === 0)) {
      setDisabled(true);
    }
  }, [lastPage, page]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{paddingHorizontal: 15, paddingVertical: 10}}>
        <SearchBar>
          <Pressable
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              marginRight: 10,
              flexDirection: 'row',
              height: '100%',
            }}
            onPress={() => {
              setPopup(true);
            }}>
            <Icon
              name="caret-down"
              size={10}
              color="#767677"
              style={{marginRight: 5}}></Icon>
            <Text style={{fontSize: 10, color: 'black', paddingRight: 5}}>
              {searchKey}
            </Text>
          </Pressable>

          <View
            style={{
              width: 1,
              height: 13,
              backgroundColor: 'black',
              marginRight: 10,
            }}></View>
          <Input
            placeholder="검색"
            returnKeyType="search"
            onChangeText={text => setKeyword(text)}
            onSubmitEditing={onSubmit}></Input>
          <Button
            onPress={() => {
              goBack();
            }}>
            <Text style={{fontSize: 10, color: '#767677', paddingRight: 10}}>
              취소
            </Text>
          </Button>
        </SearchBar>
      </View>
      {loading ? (
        <View style={{flex: 1, alignItems: 'center', marginTop: 30}}>
          <ActivityIndicator color="black" size={50} />
        </View>
      ) : data.length === 0 ? (
        <View style={{flex: 1, alignItems: 'center', marginTop: 40}}>
          <Text>검색결과가 없습니다.</Text>
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={data}
            ItemSeparatorComponent={() => <View style={{height: 1}} />}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            onEndReached={() => {
              getData();
            }}
          />
        </SafeAreaView>
      )}
      {popup ? (
        <Popup style={{}}>
          <PopupButtonBoxWrapper>
            <PopupButtonBox
              onPress={() => {
                setSearchKey('name');
                setPopup(false);
              }}>
              <Text>이름</Text>
            </PopupButtonBox>
            <PopupButtonBox
              onPress={() => {
                setSearchKey('address');
                setPopup(false);
              }}>
              <Text>주소</Text>
            </PopupButtonBox>
            <PopupButtonBox
              onPress={() => {
                setSearchKey('tag');
                setPopup(false);
              }}>
              <Text>태그</Text>
            </PopupButtonBox>
          </PopupButtonBoxWrapper>
        </Popup>
      ) : null}
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
export default Search;
