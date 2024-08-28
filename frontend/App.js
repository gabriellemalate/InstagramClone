import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'expo-asset';
import * as firebase from 'firebase';
import _ from 'lodash';
import React, { Component } from 'react';
import { Image, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import LoginScreen from './components/auth/Login';
import RegisterScreen from './components/auth/Register';
import MainScreen from './components/Main';
import SaveScreen from './components/main/add/Save';
import ChatScreen from './components/main/chat/Chat';
import ChatListScreen from './components/main/chat/List';
import CommentScreen from './components/main/post/Comment';
import PostScreen from './components/main/post/Post';
import EditScreen from './components/main/profile/Edit';
import ProfileScreen from './components/main/profile/Profile';
import BlockedScreen from './components/main/random/Blocked';
import { container } from './components/styles';
import rootReducer from './redux/reducers';

const store = createStore(rootReducer, applyMiddleware(thunk));

LogBox.ignoreLogs(['Setting a timer']);
const _console = _.clone(console);
console.warn = (message) => {
  if (!message.includes('Setting a timer')) {
    _console.warn(message);
  }
};

const firebaseConfig = {
  apiKey: "****",
  authDomain: "****",
  databaseURL: "****",
  projectId: "****",
  storageBucket: "****",
  messagingSenderId: "****",
  appId: "****",
  measurementId: "****"
};

const logo = require('./assets/logo.png');

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

class App extends Component {
  state = {
    loggedIn: null,
    loaded: false,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        loggedIn: !!user,
        loaded: true,
      });
    });
  }

  render() {
    const { loggedIn, loaded } = this.state;

    if (!loaded) {
      return <Image style={container.splash} source={logo} />;
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={loggedIn ? "Main" : "Login"}>
            {!loggedIn ? (
              <>
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              </>
            ) : (
              <>
                <Stack.Screen 
                  name="Main" 
                  component={MainScreen} 
                  options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
                    const titles = {
                      Camera: 'Camera',
                      chat: 'Chat',
                      Profile: 'Profile',
                      Search: 'Search',
                      Feed: 'Instagram',
                    };
                    return { headerTitle: titles[routeName] || 'Instagram' };
                  }}
                />
                <Stack.Screen name="Save" component={SaveScreen} />
                <Stack.Screen name="Video" component={SaveScreen} />
                <Stack.Screen name="Post" component={PostScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="ChatList" component={ChatListScreen} />
                <Stack.Screen name="Edit" component={EditScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Comment" component={CommentScreen} />
                <Stack.Screen name="ProfileOther" component={ProfileScreen} />
                <Stack.Screen name="Blocked" component={BlockedScreen} options={{ headerShown: false }} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
