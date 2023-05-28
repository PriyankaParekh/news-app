import { Button, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {ComponentNavigationProps, NewsData} from '../utils/types'
import DetailsCard from '../components/DetailsCard';
import {Appbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@newsData')
    if(value !== null) {
      return JSON.parse(value);
    }
  } catch(e) {
    // error reading value
    alert("something wrong");
    return;
  }
}

const storeData = async (value:NewsData) => {
  const data:NewsData[]=await getData()||[];
  //const parsedValue=JSON.parse(value);
  !data.find((d)=>d.title===value.title)?data.push(value):data;
  try {
    const jsonValue = JSON.stringify(data)
    await AsyncStorage.setItem('@newsData', jsonValue)
  } catch (e) {
    return alert("something went wrong to store data");
  }
}

const NewsOverview = (props:ComponentNavigationProps) => {
  const {title,content,image_url}=props?.route?.params as NewsData;
  return (
    <ScrollView>
    <Appbar.Header>
        <Appbar.Content title="NewsOverView"></Appbar.Content>
        <Button title="Save" onPress={()=>storeData({title,content,image_url})}></Button>
      </Appbar.Header>
    <DetailsCard content={content} image_url={image_url} title={title} />
    </ScrollView>
  )
}

export default NewsOverview

const styles = StyleSheet.create({})
