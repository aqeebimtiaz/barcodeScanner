import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import Camera from 'react-native-camera';

export default class barcodeScanner extends Component {
    constructor(props) {
        super(props);
        this.handleTourch = this.handleTourch.bind(this);
        this.state = {
            torchOn: false
        };
    }
}
