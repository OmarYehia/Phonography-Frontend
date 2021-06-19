import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, Image, Platform, TouchableOpacity, Alert } from 'react-native';
import { Card, Button, Icon, Input, Overlay, ListItem, } from 'react-native-elements'
import { BACKEND_URL } from '../../ENV'
import { API_URL } from '../../@env'
import jwt_decode from "jwt-decode";
import { TOKEN } from '../../ENV'

export class Post extends Component {
    constructor(props) {
        super();
        const decodedToken = jwt_decode(TOKEN);
        this.state = {
            currentUserId: decodedToken.userId,
            post: props.post,
            error: false,
            liked: props.post.likes.includes(decodedToken.userId) ? true : false,
            comments: [],
            numberOfComments: null,
            numberofLikes: props.post.likes.length,
            comment: null,
            disabled: true,
            overlayVisible: false,
        }
    }
    componentDidMount() {
        fetch(`${BACKEND_URL}/comment/post/${this.state.post._id}`, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            }
        })
            .then(response => response.json())
            .then(result => {
                this.setState({
                    comments: result.data.comments,
                    numberOfComments: result.numberOfRecords
                })
            })
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
                        this.setState({ liked: !this.state.liked, numberofLikes: this.state.numberofLikes + 1 })
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
                        this.setState({ liked: !this.state.liked, numberofLikes: this.state.numberofLikes - 1 })
                    } else {
                        Alert.alert(result.errors.message);
                    }
                })
        }
    }
    addComment = () => {
        console.log("Comment");
        let sentBody = {
            post_id: this.state.post._id,
            body: this.state.comment
        }
        console.log(sentBody);
        fetch(`${BACKEND_URL}/comment`, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify(sentBody)
        })
            .then(response => response.json())
            .then(result => {
                console.log(result)
                this.setState({ comment: null, numberOfComments: this.state.numberOfComments + 1, disabled: !this.state.disabled })
            })
            .catch(err => console.log(err))
    }
    toggleOverlay = () => {
        this.setState({ overlayVisible: !this.state.overlayVisible })
    }
    render() {
        const alt = "Image Not availabe!";
        const { error } = this.state;
        return (
            <Card>
                <Card.Title>{this.state.post.author.name}</Card.Title>
                <Card.Divider />
                <Card.Image source={{ uri: this.state.post.image }}>

                </Card.Image>
                <Text style={{ margin: 10 }}>
                    {this.state.post.caption}
                </Text>
                <Text style={{ margin: 10, color: 'blue' }}>
                    #{this.state.post.category.name}
                </Text>
                <Text style={{ margin: 10 }} onPress={() => this.toggleOverlay()}>
                    {this.state.numberofLikes} Likes . {this.state.numberOfComments} Comments
                </Text>
                <Button
                    title={this.state.liked ? "Unlike" : "Like"} onPress={() => this.likePost()} />
                <Button
                    title="Add Comment" onPress={() => this.setState({ disabled: !this.state.disabled, comment: null })} />
                {!this.state.disabled && <Input
                    placeholder='Write a comment ...'
                    onChangeText={text => {
                        this.setState({ comment: text ? text : null })
                    }}
                    rightIcon={
                        this.state.comment != null && <Icon
                            name='sc-telegram'
                            type='evilicon'
                            color='#0099ff'
                            disabled={!this.state.comment}
                            onPress={() => this.addComment()}
                        />
                    }
                />
                }
                <Overlay isVisible={this.state.overlayVisible} onBackdropPress={() => this.toggleOverlay()}>
                    <View>
                        {
                            this.state.comments.map((comment) => {
                                return (
                                    <ListItem key={comment._id} bottomDivider>
                                        <ListItem.Content>
                                            <ListItem.Title><Text>{comment.author.name}</Text></ListItem.Title>
                                            <ListItem.Subtitle><Text>{comment.body}</Text></ListItem.Subtitle>
                                        </ListItem.Content>
                                    </ListItem>
                                    // <Text>{comment.body}</Text>
                                )
                            })
                        }
                    </View>
                </Overlay>
            </Card>
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
