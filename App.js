'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
    Text,
    TextInput,
    Image,
    PermissionsAndroid
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LZString from 'lz-string';

import RNFS from "react-native-fs";

const path = RNFS.DocumentDirectoryPath + '/image.jpg';
export default class Camera extends Component {
    constructor() {
        super();
        this.state = {
            barcode: '',
            takingPic: false,
            uri: '',
        };
        this.requestStoragePermission();
    }

    async requestStoragePermission() {
        try {
            const granted = await PermissionsAndroid.requestMultiple(
                [
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ],
                {
                    title: 'Cool Photo App Storage Permission',
                    message:
                        'Cool Photo App needs access to your storage so you can take awesome pictures.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (e) {
            // saving error
            console.log(e);
        }
    };

    takePicture = async () => {
        if (this.camera && !this.state.takingPic) {
            let options = {
                base64: true,
                quality: 0.85,
                fixOrientation: true,
                forceUpOrientation: true,
                // exif: true,
                path: path,
            };

            this.setState({ takingPic: true });

            try {
                const data = await this.camera.takePictureAsync(options);
                Alert.alert('Success', JSON.stringify(data));
                this.setState({ uri: data.base64 });
                this.storeData('base64', data.base64);
                let compressed = LZString.compress(data.base64);
                this.storeData('compressedB64', compressed);

                let decompressed = LZString.decompress(compressed);
                this.storeData('decompressedB64', decompressed);

                console.log('Size of sample is: ' + data.base64.length);
                console.log('Size of compressed is: ' + compressed.length);
                console.log('Size of decompressed is: ' + decompressed.length);
                // this.props.onPicture(data);
            } catch (err) {
                Alert.alert(
                    'Error',
                    'Failed to take picture: ' + (err.message || err)
                );
                return;
            } finally {
                this.setState({ takingPic: false });
            }
        }
    };

    getProduct() {
        let bar_code = this.state.barcode;
        console.log('From Search function: ' + bar_code);

        let url =
            'https://www.batzo.net/api/v1/products?barcode=' +
            bar_code +
            '&key=86KpjeDg1mKp49zhzVSeORDKD94YnEnwwNQ';

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    return Alert.alert(
                        'Server Response ' + response.status,
                        'Barcode error, please try again.'
                    );
                }
                return response.json();
            })
            .then(data => {
                if (data === undefined) {
                    console.log('undefined data');
                } else {
                    console.log(data);
                    let alertText =
                        'Barcode: ' +
                        data.barcode +
                        '\n' +
                        'Name: ' +
                        data.name.en +
                        'Brand: ' +
                        data.brand +
                        ' \n Manufacturer: ' +
                        data.manufacturer;
                    Alert.alert('Product Details', alertText);
                }
            });
    }
    render() {
        // console.log(this.state.uri);
        return (
            <>
                <View style={styles.container}>
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.auto}
                        whiteBalance={RNCamera.Constants.WhiteBalance.auto}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message:
                                'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel'
                        }}
                        androidRecordAudioPermissionOptions={{
                            title: 'Permission to use audio recording',
                            message:
                                'We need your permission to use your audio',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel'
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.btnAlignment}
                            onPress={this.takePicture}
                        >
                            <Icon name="camera" size={50} color="#fff" />
                        </TouchableOpacity>
                    </RNCamera>
                    <View style={styles.imagePreview}>
                        {this.state.uri !== '' ? (
                            <Image
                                source={{
                                    isStatic: true,
                                    uri: `data:image/jpeg;base64,${
                                        this.state.uri
                                    }`
                                }}
                                resizeMode="contain"
                                resizeMethod="resize"
                            />
                        ) : (
                            <Text>URI is empty</Text>
                        )}
                    </View>
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center'
        // backgroundColor: '#3366cc',
    },
    preview: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnAlignment: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 20
    },
    imagePreview: {
        // flex: 1,
        // flexDirection: 'column',
        // justifyContent: 'center',
        // alignContent: 'center',
        height: '15%',
        padding: 20,
    },
});
