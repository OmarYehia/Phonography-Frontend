import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, Image, Button, Platform, Dimensions, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BACKEND_URL } from '../../ENV';
import { API_URL } from "../../@env";
import { TOKEN } from '../../ENV'
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
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
            image: null,
            captionError: "Caption can not be empty and must be at least 2 characters long",
            imageError: "Please select an image",
            disabled: true,
            width:null,
            height:null,
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
                'Authorization': `Bearer ${this.props.route.params.userToken} `
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
        console.log(Platform.__constants.Model);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            aspect: [4,3],
            base64: true
        });

        if (!result.cancelled) {
            let res = result.uri.replace('file://', '').split('/')
            let name = res[res.length - 1]
            let extension = name.split('.')[1]
            this.validate();
            this.setState({ image: { uri: result.uri, name: name, type: `image/${extension}` }, imageError: null });
        }
    }
    takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect:[4,3],
            quality: 1,
            base64: true
        })

        if (!result.cancelled) {
            let res = result.uri.replace('file://', '').split('/')
            let name = res[res.length - 1]
            let extension = name.split('.')[1]
            this.validate()
            this.setState({ image: { uri: result.uri, name: name, type: `image/${extension}` }, imageError: null });
        }
    }
    removePhoto = () => {
        this.setState({ image: null, imageError: "Please select an image" })
        this.validate()
    }
    submitPost = () => {
        console.log(this.state.image);
        let myForm = new FormData();
        myForm.append('postImage',
            this.state.image
        );
        myForm.append('caption', this.state.caption);
        myForm.append('category', this.state.category);
        myForm.append('meta_data', Platform.__constants.Model);
      this.state.competition ? myForm.append('competition',this.state.competition):null;

        console.log("before fetch");
        if (this.state.caption && this.state.image) {


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
                    if (result.success) {
                        console.log("success");
                        this.props.navigation.navigate("Home", this.props)
                    }
                    console.log(result);
                })
                .catch(err => console.log(err))
        } else {
            let message = ""
            this.state.image ? "" : message += "Please choose a message before submitting"
            this.state.caption ? "" : message += "Please enter caption before submittong"
            Alert.alert(message)
        }
    }
    validate = () => {
        console.log(this.state.disabled);
        this.setState({ captionError: this.state.caption ? null : "Caption can not be empty and must be at least 2 characters long" })

        if (this.state.captionError == null && this.state.imageError == null) {
            this.setState({ disabled: false })
        } else {

            this.setState({ disabled: true })
        }
    }
    getDimensions =  () => {
        Image.getSize(this.state.image.uri, (width, height) => {
            this.setState({width:width , height: height})
        })
        
    }
    render() {
        this.state.image ? this.state.imageError = null : this.state.imageError = "Please choose an image"
        this.state.caption ? this.state.captionError = null : this.state.captionError = "Please write a caption"
        this.state.imageError == null && this.state.captionError == null ? this.state.disabled = false : this.state.disabled = true
      
        return (
            <ScrollView>
                <TextInput style={styles.input} placeholder="Enter Caption" onChangeText={text => {
                    this.validate();
                    this.setState({ caption: text })
                }} />
                <Text>
                    {this.state.captionError ? `*${this.state.captionError}` : ""}
                </Text>
                <TextInput>
                    Select a Category for your photo:
                </TextInput>
                <Picker selectedValue={this.state.category}
                    mode={'dialog'}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue) => {
                        this.setState({ category: itemValue })
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

                    this.state.image ? (
                        <>

                            <Text>Preview: </Text>
                            <View>
                                <Image source={{ uri: this.state.image.uri }} 
                                    style={{ width: Dimensions.get('window').width - 20, height: 300, margin: 10 }} />
                                <FontAwesome name="remove" style={{
                                    margin: 10,
                                    position: "absolute",
                                    top: 0,
                                    left: Dimensions.get('window').width - 40,
                                    width: 25,
                                    height: 25,
                                    color: "red"
                                }} size={24} onPress={() => this.removePhoto()} />
                            </View>
                        </>
                    ) : (
                        <>
                            <Text>Preview: </Text>
                           {/* <Image source={require("./y9DpT.jpg")}
                                style={{ width: Dimensions.get('window').width - 20, height: 200, margin: 10 }} />*/}
                        </>
                    )
                }
                <Button title="Post" disabled={this.state.disabled} onPress={this.submitPost} />

            </ScrollView >
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
