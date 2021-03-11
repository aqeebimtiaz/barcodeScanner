'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
    TextInput
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class Camera extends Component {
    constructor() {
        super();
        this.state = {
            barcode: '',
            takingPic: false
        };
    }

    takePicture = async () => {
        if (this.camera && !this.state.takingPic) {
            let options = {
                quality: 0.85,
                fixOrientation: true,
                forceUpOrientation: true
            };

            this.setState({ takingPic: true });

            try {
                const data = await this.camera.takePictureAsync(options);
                Alert.alert('Success', JSON.stringify(data));
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
        return (
            <>
                <View style={styles.container}>
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.off}
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
                        // onGoogleVisionBarcodesDetected={({ barcodes }) => {
                        //     console.log(barcodes);
                        //     this.setState({ barcode: barcodes[0].data });
                        //     console.log(
                        //         'from raw barcode ' + this.state.barcode
                        //     );
                        //     Alert.alert('Barcode', barcodes[0].data);
                        // }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.btnAlignment}
                            onPress={this.takePicture}
                        >
                            <Icon name="camera" size={50} color="#fff" />
                        </TouchableOpacity>
                    </RNCamera>
                    <View
                        style={{
                            flex: 0,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignContent: 'center',
                            height: '15%',
                            paddingHorizontal: 20
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignContent: 'center'
                            }}
                        >
                            <TextInput
                                style={styles.searchInput}
                                value={this.state.barcode}
                                onChangeText={barcode =>
                                    this.setState({ barcode })
                                }
                            />
                        </View>

                        <TouchableOpacity
                            onPress={this.getProduct.bind(this)}
                            style={styles.capture}
                        >
                            <Icon
                                style={{
                                    marginTop: 'auto',
                                    marginBottom: 'auto'
                                }}
                                name="cloud-search"
                                size={25}
                                color="#fff"
                            />
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
    btnAlignment: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 20
    },
});
