import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, Image, Button, Platform, TouchableOpacity, Alert } from 'react-native';
import { BACKEND_URL } from '../../ENV'
import { API_URL } from '../../@env'
import { TOKEN } from '../../ENV'

export class Post extends Component {
    constructor(props) {
        super();
        this.state = {
            post: props.post,
            caption: props.post.caption,
            error: false,
            liked: false,
        }
    }
    _onImageLoadError = (event) => {
        console.warn(event.nativeEvent.error);
        this.setState({ error: true });
    }
    likePost = () => {
        if (!this.state.liked) {
            console.log("like post");

            fetch(`${BACKEND_URL}/posts/${this.state.post._id}/like`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                }
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        this.setState({ liked: !this.state.liked })
                    } else {
                        Alert.alert(result.errors.message);
                    }
                })
        } else {
            console.log("Unlike post");
            fetch(`${BACKEND_URL}/posts/${this.state.post._id}/unlike`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                }
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        this.setState({ liked: !this.state.liked })
                    } else {
                        Alert.alert(result.errors.message);
                    }
                })
        }
    }
    render() {
        const alt = "Image Not availabe!";
        const { error } = this.state;



        return (
            <View style={[syles.postContainer, { flexDirection: "column" }]}>

                <View style={syles.postContainer}>
                    <Text>{this.state.post.author.name}</Text>
                    <Image
                        style={syles.image}
                        accessible
                        accessibilityLabel={alt}
                        source={{ uri: this.state.post.image }}
                        onError={this._onImageLoadError} />
                    <Text>{this.state.caption}</Text>
                    <Text onPress={() => this.likePost()}>{this.state.liked ? "Unlike" : "Like"}</Text>

                </View>
            </View>
        )
    }
}

const syles = StyleSheet.create({
    image: {
        height: 100,
        width: 100
    },
    postContainer: {
        flex: 1,
        padding: 20,
        height: 200
    },
})

export default Post
