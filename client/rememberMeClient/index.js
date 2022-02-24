/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";

// const localNotification = () => {
//     PushNotification.localNotification({
//         autoCancel: true,
//         largeIcon: "ic_launcher",
//         smallIcon: "ic_notification",
//         bigText: "My big text that will be shown when notification is expanded",
//         subText: "This is a subText",
//         color: "green",
//         vibrate: true,
//         vibration: 300,
//         title: "Notification Title",
//         message: "Notification Message",
//         playSound: true,
//         soundName: 'default',
//         actions: '["Accept", "Reject"]'
//     });
// };

messaging().setBackgroundMessageHandler(async message => {
    console.log("[background]" + message.notification.title);
    // localNotification();
})

AppRegistry.registerComponent(appName, () => App);
