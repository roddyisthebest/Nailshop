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

  const [accessToken, setAccessToken] = useState<string>();
  const [refreshToken, setRefreshToken] = useState<string>();

  const onWebViewMessage = (e: any) => {
    const jsonData = JSON.parse(e.nativeEvent.data);
    if (jsonData.data.accessToken && jsonData.data.refreshToken) {
      setAccessToken(jsonData.data.accessToken);
      setRefreshToken(jsonData.data.refreshToken);
    }
  };

  const setTokenInfo = async (access: string, refresh: string) => {
    await EncryptedStorage.setItem('refreshToken', refresh);
    await EncryptedStorage.setItem('accessToken', access);
    await setToken();
    dispatch(login(true));
  };
  useEffect(() => {
    if (accessToken && refreshToken) {
      setTokenInfo(accessToken, refreshToken);
    }
  }, [accessToken, refreshToken]);

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
