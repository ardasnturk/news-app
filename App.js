import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";

import category from "./category";

const { width, height } = Dimensions.get("window");

export default function App() {
  const [news, setNews] = React.useState({});
  const [categorySelection, setCategorySelection] = React.useState("all");
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    newsFetch(categorySelection)
      .then((val) => {
        setNews(val.data);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [categorySelection]);

  const _handlePressButtonAsync = async (link) => {
    try {
      let result = await WebBrowser.openBrowserAsync(link, {
        readerMode: true,
      });
      setResult(result);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={news}
          pagingEnabled
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  width: width,
                  height: height,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={[{ width: height, height: height }]}
                  resizeMode="stretch"
                  resizeMethod="auto"
                />
                <BlurView
                  intensity={100}
                  style={{
                    width: height,
                    height: height,
                    position: "absolute",
                  }}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={[{ width: height, height: height }]}
                    resizeMode="contain"
                    resizeMethod="auto"
                  />
                </BlurView>
                <LinearGradient
                  colors={["transparent", "#000", "#000", "transparent"]}
                  style={{
                    position: "absolute",
                    width: width,
                    bottom: 75,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View style={{ paddingVertical: 20 }} />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      paddingHorizontal: 20,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      paddingVertical: 20,
                      paddingHorizontal: 20,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {item.content}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      paddingBottom: 5,
                      paddingHorizontal: 20,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {item.author}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      paddingBottom: 5,
                      paddingHorizontal: 20,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {item.date} - {item.time}
                  </Text>
                  {item.readMoreUrl && (
                    <TouchableOpacity
                      onPress={async () => {
                        console.log(item);
                        _handlePressButtonAsync(item.readMoreUrl.trim());
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          paddingVertical: 5,
                          paddingHorizontal: 20,
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Read More...
                      </Text>
                    </TouchableOpacity>
                  )}
                  <View style={{ paddingVertical: 20 }} />
                </LinearGradient>
              </View>
            );
          }}
        />
      )}

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{
          position: "absolute",
          top: 0,
          height: 95,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {category.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => setCategorySelection(item.searchName)}
                key={index}
                style={{
                  marginHorizontal: 15,
                  borderBottomWidth:
                    categorySelection == item.searchName ? 1 : 0,
                }}
              >
                <Text
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    fontSize: 17,
                  }}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const newsFetch = async (category) => {
  try {
    const response = await fetch(
      "https://inshortsapi.vercel.app/news?category=" + category
    );
    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
