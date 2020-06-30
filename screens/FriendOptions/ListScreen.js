import React from "react";
import {
  SafeAreaView,
  Dimensions,
  Image,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import User from "../../User";
import firebase from "firebase";
import { ListItem } from "react-native-elements";

export default class ListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Danh Sách bạn bè",
    };
  };
  state = {
    users: [],
    dbRef: firebase.database().ref("users"),
    //dbRefMess: firebase.database().ref("messages"),
    //messageLast: [],
  };
  getUSer = () => {
    this.state.dbRef.on("child_added", (val) => {
      let person = val.val();
      person.username = val.key;
      if (person.username === User.username) {
        User.name = person.name;
      } else {
        this.setState((prevState) => {
          return {
            users: [...prevState.users, person],
          };
        });
      }
    });
  };
  componentWillMount() {
    //this.getListMessLast();
    this.getUSer();
  }
  componentWillUnmount() {
    this.state.dbRef.off();
  }
  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => this.props.navigation.navigate("Chat", item)}
      style={{ borderBottomColor: "#ccc" }}
    >
      <ListItem
        title={item.name}
        //subtitle={this.getMess(item)}
        leftAvatar={{ source: { uri: item.avatar } }}
        bottomDivider
        chevron
      />
    </TouchableOpacity>
  );
  render() {
    const { height } = Dimensions.get("window");
    return (
      <SafeAreaView>
        <FlatList
          data={this.state.users}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.username}
        />
      </SafeAreaView>
    );
  }
}
