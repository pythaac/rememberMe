import React, {Component, useCallback, useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, Alert, ScrollView, Dimensions} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import messaging, {firebase} from '@react-native-firebase/messaging'
import PushNotification from 'react-native-push-notification'
import RenderHtml from 'react-native-render-html'

const App = () => {
    const main = 1;
    const addPushCat = 2;
    const addPushTime = 3;
    const post = 4;

    const MAMACOCO = 'http://pythaac.gonetis.com:8080';
    const REMEMBERME = 'http://pythaac.gonetis.com:9999';

    const [categories, setCategories] = useState([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [addCat, setAddCat] = useState("null");
    const [addTime, setAddTime] = useState("null");
    const [token, setToken] = useState(null);
    const [currentView, setCurrentView] = useState(main);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    /*
        Views -----------------------------------------------------------------
     */
    const Main = () => (
        <View style={styles.container}>
            <Button
                onPress={() => setCurrentView(addPushCat)}
                title="Create Push"/>
            <Text style={styles.enter}>{"\n"}</Text>
            <Button
                onPress={() => sendToken(token)}
                title="Send Token"/>
        </View>
    );

    const AddPushCat = () => {
        const getCategoryList = () => {
            fetch(`${MAMACOCO}/rememberMe/categories`)
                .then(response => response.text())
                .then(response => response.slice(2, -2))
                .then(response => response.split("\",\""))
                .then(response => setCategories(response))
                .catch(e => setCategories([e]))
        };

        const buttonCategoryList = () => (
                categories.map((cat, index) =>
                    <Button
                        key={cat}
                        onPress={() => {
                            setAddCat(cat)
                            setCurrentView(addPushTime)
                        }}
                        title={cat}
                        color="black"
                    />
                )
        );

        return(
            <View style={styles.container}>
                <Text style={styles.title}>{"\n"}Category{"\n"}</Text>
                <ScrollView style={styles.categories}>
                    {buttonCategoryList()}
                </ScrollView>

                <Text style={styles.enter}>{"\n"}</Text>

                <Button
                    onPress={ () => {
                        getCategoryList()
                        Alert.alert('Categories updated')
                    }}
                    title="Update Categories"/>

                <Text style={styles.enter}>{"\n"}</Text>

                <Button
                    onPress={() => setCurrentView(main)}
                    title="Back"/>

                <Text style={styles.enter}>{"\n"}</Text>
            </View>
        );
    };

    const AddPushTime = () => {
        const showDatePicker = () => {
            setDatePickerVisibility(true);
        };

        const hideDatePicker = () => {
            setDatePickerVisibility(false);
        };

        const handleConfirm = (time) => {
            setAddTime(new Date(time).toString());
            hideDatePicker();
        };

        const send = () =>{
            if (addCat === "null"){
                Alert.alert("카테고리를 선택해주세요")
            }
            else if  (addTime === "null") {
                Alert.alert("시간을 선택해주세요")
            }
            else {
                const sending = JSON.stringify({
                    'category': addCat,
                    'time': addTime
                })
                {
                    fetch(REMEMBERME+"/register", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: sending
                    })
                        .then(() => Alert.alert("전송되었습니다"))
                        .then(() => setAddCat("null"))
                        .then(() => setAddTime("null"))
                        .then(() => setCurrentView(main))
                        .catch(e => Alert.alert("에러 : " + e))
                }
            }
        };

        return (
            <View style={styles.content}>
                <Text style={styles.title}>{"\n"}Time{"\n"}</Text>
                <Button title="Pick Time" onPress={showDatePicker} />

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="time"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />

                <Text style={styles.enter}>{"\n"}</Text>

                <Button
                    onPress={() => send()}
                    title="Send"/>

                <Text style={styles.enter}>{"\n"}</Text>

                <Button
                    onPress={() => setCurrentView(addPushCat)}
                    title="Back"/>
            </View>
        );
    };

    const Post = () => {
        return(
            <View style>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.enter}>{"\n"}</Text>

                <ScrollView style={styles.content}>
                    <RenderHtml
                        source={{html: content}}
                        contentWidth={Dimensions.get('window').width}
                    />
                </ScrollView>

                <Text style={styles.enter}>{"\n"}</Text>

                <Button
                    onPress={() => setCurrentView(main)}
                    title="Back"/>
            </View>
        )
    };

    /*
        Firebase -----------------------------------------------------------------
     */
    const getPostById = (id) => {
        fetch(MAMACOCO+"/rememberMe/postById?postId=" + id,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
            }})
            .then((response) => response.json())
            .then((response) => {
                setTitle(response.title);
                setContent(response.content);
                setCurrentView(post);
            })
            .catch((e) => {console.log("[getPostById Error] " + e)})
    };

    const onNotiClick = () => {
        PushNotification.configure({
            onRegister: (token) => {
                console.log("TOKEN: ", token.token);
            },
            onNotification: (notification) => {
                console.log("NOTIFICATION: ", notification.data);
                if (notification.userInteraction)
                    getPostById(notification.data.id)
            },
            onAction: (notification) => {
                console.log("ACTION: ", notification);
            },
            onRegistrationError: (e) => {
                console.log("REGISTRATION ERROR: " + e)
            },
            popInitialNotification: true,
            requestPermissions: true
        })
    };

    const foregroundListener = () => {
        messaging().onMessage((message) => {
            console.log("[foreground] message: " + JSON.stringify(message.data))
            getPostById(message.data.id)
        }, []);
    };

    const sendToken = (token) => {
        if (token === null)
            Alert.alert("토큰이 null입니다");
        else {
            const sending = JSON.stringify({
                'token': token
            });
            console.log(sending);
            fetch(REMEMBERME + "/tokenRegister", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: sending
            })
                .then((response) => response.text())
                .then((response) => Alert.alert(response))
                .catch(e => Alert.alert("[sendToken 에러] " + e))
        }
    };

    const isPermitted = useCallback(async () =>
        await messaging().hasPermission() || await messaging().requestPermission()
    , []);

    const checkToken = useCallback(async () => {
        if (!await isPermitted())
            throw Error("FCM: Permission denied")
        else if (token === null){
            const _token = await messaging().getToken();
            if (!_token)
                throw Error("FCM: getToken() error")
            else
                return _token;
        }
    }, []);

    useEffect(() => {
        checkToken().then(_token => setToken(_token));
        onNotiClick();
        foregroundListener();
    }, []);

    return(
        <View style={styles.container}>
            {currentView === main ? Main() : null}
            {currentView === addPushCat ? AddPushCat() : null}
            {currentView === addPushTime ? AddPushTime() : null}
            {currentView === post ? Post() : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    categories:{
        flex: 1,
        flexDirection: 'column', // row
        backgroundColor: 'white',
    },
    title:{
        fontSize: 20,
        fontWeight: "bold",
        textAlign: 'center'
    },
    enter:{
        fontSize: 5
    },
    content:{
        paddingLeft: 20,
        paddingRight: 20
    }
})

export default App;
