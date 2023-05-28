import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Appbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CompositeNavigationProp, useIsFocused } from "@react-navigation/native";
import { ComponentNavigationProps, NewsData } from "../utils/types";
import CardItem from "../components/cardItem";

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem("@newsData");
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    // error reading value
    alert("something wrong");
    return;
  }
};

const storeData = async (value:string) => {
  const data:NewsData[]=await getData()||[];
  const filtered=data.filter((news)=>news.title!==value)
  try {
    const jsonValue = JSON.stringify(filtered)
    await AsyncStorage.setItem('@newsData', jsonValue)
  } catch (e) {
    return alert("something went wrong to store data");
  }
}

const Saved = (props:ComponentNavigationProps) => {
  const focused = useIsFocused();
  const [savedNews, setSavedNews] = useState([]);
  const delHandler=async(val:string)=>{
    await storeData(val);
      }
  useEffect(() => {
    getData()
      .then((data) => setSavedNews(data))
      .catch(() => alert("Error Occured"));
  }, [focused,delHandler]);

  

  return (
    <ScrollView>
      <Appbar.Header>
        <Appbar.Content title="Saved"></Appbar.Content>
      </Appbar.Header>
      {savedNews &&
        savedNews.length > 0 &&
        savedNews.map((data: NewsData) => <CardItem handleDelete={delHandler} description={data.description || ""} content={data.content} key={data.title} title={data.title} image_url={data.image_url} navigation={props.navigation}/>)}
    </ScrollView>
  );
};

export default Saved;

const styles = StyleSheet.create({});
