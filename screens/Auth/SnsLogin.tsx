import {Alert, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import EncryptedStorage from 'react-native-encrypted-storage';
import {setToken} from '../../api';
import {useDispatch} from 'react-redux';
import {login} from '../../store/slice';
const Record = ({
  route: {
    params: {url},
  },
}: {
  route: {params: {url: string}};
}) => {
  const dispatch = useDispatch();

  const IJECTED_JAVASCRIPT = `
  const element = document.getElementsByTagName("pre");
  window.ReactNativeWebView.postMessage(element[0].innerHTML);
  `;

  const [jwt, setJwt] = useState<string>();

  const onWebViewMessage = (e: any) => {
    const jsonData = JSON.parse(e.nativeEvent.data);
    if (jsonData.data.jwt) {
      setJwt(jsonData.data.jwt);
    }
  };

  const setTokenInfo = async (jwt: string) => {
    await EncryptedStorage.setItem('accessToken', jwt);
    await setToken();
    dispatch(login(true));
  };
  useEffect(() => {
    if (jwt) {
      setTokenInfo(jwt);
    }
  }, [jwt]);

  return (
    <View style={{flex: 1}}>
      <WebView
        source={{uri: url}}
        onMessage={onWebViewMessage}
        javaScriptEnabled={true}
        injectedJavaScript={IJECTED_JAVASCRIPT}></WebView>
    </View>
  );
};

export default Record;
