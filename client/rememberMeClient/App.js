import React, { useState } from 'react';
import {View, Text, Button, StyleSheet, Alert, ScrollView} from 'react-native';
import { DateTimePickerModal } from "react-native-modal-datetime-picker";

const App = () => {
    const main = 1;
    const addPushCat = 2;
    const addPushTime = 3;

    const [currentView, setCurrentView] = useState(main)
    const [categories, setCategories] = useState([])
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [addCat, setAddCat] = useState("null")
    const [addTime, setAddTime] = useState("null")

    const Main = () => (
        <View style={styles.container}>
            <Button
                onPress={() => setCurrentView(addPushCat)}
                title="Create Push"/>
        </View>
    )

    const AddPushCat = () => {
        const MAMACOCO = '172.30.1.60'

        const getCategoryList = () => {
            fetch(`http://${MAMACOCO}:8080/rememberMe/categories`)
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
        )

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
    }

    const AddPushTime = () => {
        const showDatePicker = () => {
            setDatePickerVisibility(true);
        };

        const hideDatePicker = () => {
            setDatePickerVisibility(false);
        };

        const handleConfirm = (time) => {
            setAddTime(time)
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
                Alert.alert(
                    "전송되었습니다")
                setAddCat("null")
                setAddTime("null")
                setCurrentView(main)
            }
        }

        return (
            <View>
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
    }

    return(
        <View style={styles.container}>
            {currentView === main ? Main() : null}
            {currentView === addPushCat ? AddPushCat() : null}
            {currentView === addPushTime ? AddPushTime() : null}
        </View>
    )
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
    }
})

export default App;
