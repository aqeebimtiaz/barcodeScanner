'use strict';
import React from 'react';
import Camera from './Camera';
import {
    StatusBar,
    View,
    SafeAreaView,
    TouchableHighlight,
    Image,
    StyleSheet
} from 'react-native';
export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            img: null
        };
        this.onPicture = this.onPicture.bind(this);
    }
    setImg(uri) {
        this.setState({ img: uri });
    }

    onPicture(uri) {
        this.setImg(uri);
    }

    onBackToCamera() {
        this.setImg(null);
    }

    render() {
        console.log(this.state.img);
        return (
            <>
                <StatusBar
                    backgroundColor="grey"
                    barStyle="light-content"
                    showHideTransition="slide"
                    animated
                    hidden={false}
                />
                ‍
                <SafeAreaView style={styles.container}>
                    <Camera onPicture={this.onPicture} />‍
                    {/* {this.state.img ? (
                        <View
                            style={{ flex: 1 }}
                            onPress={() => {
                                this.onBackToCamera();
                            }}
                        >
                            <Image
                                source={{ uri: this.state.img }}
                                style={{ flex: 1 }}
                            />
                            ‍
                        </View>
                    ) : (
                        <Camera onPicture={this.onPicture} />
                    )} */}
                </SafeAreaView>
            </>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
        // backgroundColor: '#3366cc',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        flex: 0,
        backgroundColor: '#3366cc',
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 20,
        alignSelf: 'center',
        // margin: 5,
        height: '50%'
    },
    searchInput: {
        width: '90%',
        height: '50%',
        borderBottomWidth: 3,
        padding: 4,
        marginRight: 5,
        // marginTop: 5,
        fontSize: 18,
        // borderWidth: 1,
        borderColor: '#3366cc',
        borderRadius: 8,
        color: 'black'
        // backgroundColor: '#3366cc',
    },
});

// AppRegistry.registerComponent('App', () => ExampleApp);
