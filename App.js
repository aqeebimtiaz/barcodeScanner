/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
'use strict';
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, TouchableOpacity, View, StatusBar, Alert, TextInput } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BarcodeMask from 'react-native-barcode-mask';

export default class App extends Component {
    constructor(){
        super();
        this.state = {
            barcode : '',
        };
    }

    getProduct() {
        let bar_code = this.state.barcode;
        console.log("From Search function: " + bar_code);

        let url = 'https://www.batzo.net/api/v1/products?barcode=' + bar_code + '&key=86KpjeDg1mKp49zhzVSeORDKD94YnEnwwNQ';

        fetch(url)
		.then((response) => {
            if (!response.ok){
                return Alert.alert ( 'Server Response ' + response.status , 'Barcode error, please try again.');
            }
            return response.json()
        }
            )
		.then(data => {
            if (data === undefined){
                console.log('undefined data')
            }
            else {
                console.log(data);
                let alertText = 'Barcode: ' + data.barcode + '\n' + 'Name: ' + data.name.en + 'Brand: ' + data.brand + ' \n Manufacturer: ' + data.manufacturer;
                Alert.alert('Product Details', alertText);
            }
        });
    }
    render() {
        return (
            <>
                <StatusBar backgroundColor="grey" barStyle="light-content" showHideTransition='slide' animated hidden={false} />
                <View style={styles.container}>
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.off}
                        whiteBalance = {RNCamera.Constants.WhiteBalance.auto}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        androidRecordAudioPermissionOptions={{
                            title: 'Permission to use audio recording',
                            message: 'We need your permission to use your audio',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        onGoogleVisionBarcodesDetected={({ barcodes }) => {
                            console.log('barcodes', barcodes);
                            this.setState({barcode: barcodes[0].data});
                            console.log('from raw barcode ' + this.state.barcode);
                            // Alert.alert('Barcode', barcodes[0].data);
                        }}
                        googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.ALL}
                    >
                        <BarcodeMask edgeColor={'#62B1F6'} showAnimatedLine={true} transparency={0.8}/>
                    </RNCamera>
                    <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', height: '15%', paddingHorizontal: 20 }}>
                        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center'}}>
                            <TextInput
                                style={styles.searchInput}
                                value={this.state.barcode}
                                onChangeText = {(barcode) => this.setState({barcode})}
                            />
                        </View>

                        <TouchableOpacity onPress={this.getProduct.bind(this)} style={styles.capture}>
                            <Icon style = {{marginTop: 'auto', marginBottom: 'auto'}} name="cloud-search" size={25} color="#fff" />
                        </TouchableOpacity>

                        {/* <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                            <Text style={{ fontSize: 14 }}> SNAP </Text>
                            <Icon style = {{marginTop: 'auto', marginBottom: 'auto'}} name="cloud-search" size={25} color="#fff" />
                        </TouchableOpacity> */}
                    </View>
                </View>
            </>
        );
    }

    // takePicture = async () => {
    //     if (this.camera) {
    //         const options = { quality: 0.5, base64: true };
    //         const data = await this.camera.takePictureAsync(options);
    //         console.log(data.uri);
    //     }
    // };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        // backgroundColor: '#3366cc',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#3366cc',
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 20,
        alignSelf: 'center',
        // margin: 5,
        height: '50%',
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
        color: 'black',
        // backgroundColor: '#3366cc',
    },
});

// AppRegistry.registerComponent('App', () => ExampleApp);
