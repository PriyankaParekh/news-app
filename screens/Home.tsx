//@ts-nocheck

import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Appbar, Chip, Button, useTheme, ProgressBar, MD3Colors } from "react-native-paper";
import { ComponentNavigationProps, NewsData } from "../utils/types";
import CardItem from "../components/cardItem";

const categories = ["Technology", "Sports", "Politics", "Health", "Business"];
const API_KEY = "pub_2261010b233a542d722bb696b1f81b0c188f9";

const Home = (props:ComponentNavigationProps) => {
  const [newsData, setNewsData] = useState<NewsData[]>([]);
  const [nextPage, setNextPage] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoadig, setIsLoadig] = useState(false);
  const handleSelect = (val: string) => {
    setSelectedCategories((prev: string[]) =>
      prev.find((p) => p === val)
        ? prev.filter((cat) => cat !== val)
        : [...prev, val]
    );
  };
  const handlepress = async () => {
    const URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&language=en${
      selectedCategories.length > 0
        ? `&category=${selectedCategories.join()}`
        : ""
    }${nextPage?.length>0?`&page=${nextPage}`:""}`;
    try {
      setIsLoadig(true)
      await fetch(URL)
        .then((res) => res.json())
        .then((data) => {
          setNewsData((prev)=>[...prev,...data.results]);
          setNextPage(data.nextPage);
        });
        setIsLoadig(false);
    } catch (err) {
      console.log(err);
    }
  };
  //console.log(Object.keys(newsData[0]));
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Home"></Appbar.Content>
      </Appbar.Header>

      <View style={styles.filterContainer}>
        {categories.map((cat) => (
          <Chip
            key={cat}
            mode="outlined"
            style={styles.chipItem}
            textStyle={{ fontWeight: "400", color: "white", padding: 1 }}
            selected={selectedCategories.find((c) => cat === c) ? true : false}
            onPress={() => handleSelect(cat)}
          >
            {cat}
          </Chip>
        ))}
        <Button
          mode="outlined"
          style={styles.button}
          labelStyle={{ fontSize: 14, margin: "auto" }}
          icon={"sync"}
          onPress={handlepress}
        >
          Refresh
        </Button>
        
      </View>
      <ProgressBar visible={isLoadig} indeterminate color={MD3Colors.error50}/>
      <FlatList
      keyExtractor={(item)=>item.title}
      onEndReached={()=>handlepress()}
          data={newsData}
          style={styles.flatlist}
          renderItem={({ item }) => (
            <CardItem 
            navigation={props.navigation}
            //category={item.category} 
            content={item.content} 
            //country={item.country}
            //creator={item.creator}
            description={item.description}
            image_url={item.image_url}
            //keywords={item.keywords}
            //language={item.language}
            //link={item.link}
            //pubDate={item.pubDate}
            //source_id={item.source_id}
            title={item.title}
            //video_url={item.video_url}
            />
          )}
        />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  chipItem: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  button: {
    maxWidth: 400,
    padding: 0,
    maxHeight: 40,
  },
  flatlist:{
    flex:1,
    height:"auto",

  }
});
