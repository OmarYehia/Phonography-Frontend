import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, Image, Button, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BACKEND_URL } from '../../ENV';
import { API_URL } from "../../@env";
import { TOKEN } from '../../ENV'
import * as ImagePicker from 'expo-image-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

class addPostForm extends Component {
    constructor(props) {
        super();
        console.log("id",props.competitionId)
        console.log("route",props.route.params.userToken)
        this.state = {
            caption: null,
            category: null,
            categories: null,
            image: {},
            errors: [],
            competition: props.competitionId ? props.competitionId : null
        }
    }
    componentDidMount() {
        (async () => {
            if (Platform.OS !== 'web') {
                let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
                let cameraStatus = await ImagePicker.getCameraPermissionsAsync();
                if (cameraStatus.status !== 'granted') {
                    alert('Sorry, we need camera permissions to make this work!');
                }
            }
        })
        fetch(`${API_URL}/categories`, {
            headers: {
                'Authorization': `Bearer ${TOKEN} `
            }
        })
            .then(response => {
                console.log("inside 1");
                return response.json()
            })
            .then(result => {
                console.log("inside");
                this.setState({
                    categories: result.data.categories
                })
            })
    }
    pickImage = async () => {
        console.log(Platform);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        });
        console.log(result);

        if (!result.cancelled) {
            let res = result.uri.replace('file://', '').split('/')
            let name = res[res.length - 1]
            let extension = name.split('.')[1]
            console.log(result);
            this.setState({ image: { uri: result.uri, name: name, type: `image/${extension}` } });
        }
    }
    takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        })
        console.log(result);

        if (!result.cancelled) {
            let res = result.uri.replace('file://', '').split('/')
            let name = res[res.length - 1]
            let extension = name.split('.')[1] 
            this.setState({ image: { uri: result.uri, name: name, type: `image/${extension}` } });
        }
    }
    submitPost = () => {
        console.log(this.state.image);
        let myForm = new FormData();
        myForm.append('postImage',
            this.state.image
        );
        myForm.append('caption', this.state.caption);
        myForm.append('category', this.state.category);
        myForm.append('competition',this.state.competition);

        console.log("before fetch");
        fetch(`${API_URL}/posts`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${this.props.route.params.userToken} `,
                'Content-Type': 'multipart/form-data',
                'Accept': '*/*'
            },
            body: myForm
        })
            .then(response => response.json())
            .then(result => {
                if (result.success){
                    console.log("success");
                    this.props.navigation.navigate("Home",this.props)
                }
                console.log(result);
            })
            .catch(err => console.log(err))
    }
    render() {
        return (
            <View>
                <TextInput style={styles.input} placeholder="Enter Caption" onChangeText={text => {
                    this.state.caption = text
                    console.log(this.state.caption);
                }} />
                <TextInput>
                    Select a Category for your photo:
                </TextInput>
                <Picker selectedValue={this.state.category}
                    mode={'dialog'}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue) => {
                        this.setState({category: itemValue})
                        console.log(this.state.category);
                    }}
                >
                    {this.state.categories && this.state.categories.map((each) => {
                        return (
                            <Picker.Item key={each._id} label={each.name} value={each._id} />
                        )
                    })}
                </Picker>
                
                <Button title="Pick an image from camera roll" onPress={this.pickImage} />
                <Text>Or</Text>
                <Button title="Take a photo" onPress={this.takePhoto} />
                {
                    this.state.image && (
                        <>
                            <Text>Preview: </Text>
                            <Image source={{ uri: this.state.image.uri }}
                                style={{ width: 300, height: 200, marginBottom: 10 }} />
                            <Button title="Post" onPress={this.submitPost} />
                        </>
                    )
                }
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
        color: 'white',
        justifyContent: "center",
        alignItems: 'center'
    },
    button: {
        backgroundColor: "yellow",
        width: 50,

    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        width: 200
    },
});
export default addPostForm
