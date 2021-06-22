import React, { Component } from 'react'
import { Modal, StyleSheet, Text, View, TextInput, Image, Platform, TouchableOpacity, Alert, FlatList, TouchableWithoutFeedback, SafeAreaView, ScrollView } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { Card, Button, Icon, Input, Overlay, ListItem, Avatar } from 'react-native-elements'
import { BACKEND_URL } from '../../ENV'
import jwt_decode from "jwt-decode";
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';


export class Post extends Component {
    constructor(props) {
        super();
        const decodedToken = jwt_decode(props.token);
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
            onePostSelected: false,
            token: props.token,
            lastPress: 0,
            postOwner: props.post.author._id,
            imageLoadError: false,
        }
    }
    onPress = () => {
        var delta = new Date().getTime() - this.state.lastPress;

        if (delta < 200) {
            this.likePost()
        }

        this.setState({
            lastPress: new Date().getTime()
        })
    }
    componentDidMount() {
        this.state.imageLoadError = false;
        fetch(`${BACKEND_URL}/comment/post/${this.state.post._id}`, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
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
                    'Authorization': `Bearer ${this.state.token}`
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
                    'Authorization': `Bearer ${this.state.token}`
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
                'Authorization': `Bearer ${this.state.token}`
            },
            body: JSON.stringify(sentBody)
        })
            .then(response => response.json())
            .then(result => {
                console.log(result)
                this.setState({ comment: null, numberOfComments: this.state.numberOfComments + 1, disabled: !this.state.disabled })
                this.componentDidMount();
            })
            .catch(err => console.log(err))
    }
    toggleOnePostSelected = () => {
        this.setState({ onePostSelected: !this.state.onePostSelected })
    }
    pressHandler = (item) => {
        this.props.navigation.navigate('UserProfile', item);
    }
    deleteComment = (id) => {
        fetch(`${BACKEND_URL}/comment/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            }
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    Alert.alert("Success", "Comment deleted Successfully")
                    this.componentDidMount();
                } else {
                    Alert.alert("Failure", result.errors.message)
                }
            })
    }
    render() {
        const alt = "Image Not availabe!";
        const { error } = this.state;
        return (
            !this.state.onePostSelected ?
                (<Card>
                    <Card.Title >
                        <ListItem containerStyle={{ padding: 0 }} onPress={() => this.pressHandler({ userId: this.state.postOwner, token: this.state.token })}>
                            <Avatar rounded size="small" source={require("../../assets/default-avatar.jpg")} />
                            <ListItem.Content>
                                <ListItem.Title>@{this.state.post.author.name}</ListItem.Title>
                                <ListItem.Subtitle>{this.state.post.author.email}</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                    </Card.Title>

                    <Card.Divider />
                    {!this.state.imageLoadError && <Card.Image source={{ uri: this.state.post.image }} onError={() => this.setState({ imageLoadError: true })} onPress={() => this.onPress()}>
                    </Card.Image>
                    }

                    <Text style={{ margin: 10, }}>
                        {this.state.post.caption}
                    </Text>
                    <Text style={{ margin: 10, color: '#f01d71', textAlign: 'right' }}>
                        #{this.state.post.category.name}
                    </Text>

                    <Text style={{ margin: 10 }} onPress={() => this.toggleOnePostSelected()}>
                        {this.state.numberofLikes} Likes . {this.state.numberOfComments} Comments
                    </Text>
                    <Card.Divider />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity onPress={() => this.likePost()} style={{ flex: 1, borderRightWidth: 1, alignItems: 'center' }}>
                            {this.state.liked ? <AntDesign name="heart" size={20} color="#f01d71" /> : <AntDesign name="hearto" size={20} color="#f01d71" />}
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => this.setState({ disabled: !this.state.disabled, comment: null })}>
                            <FontAwesome name="comment-o" size={20} color="#f01d71" />
                        </TouchableOpacity>
                    </View>
                    {!this.state.disabled && <Input
                        style={{ marginTop: 20 }}
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

                </Card>
                ) :
                (
                    <Modal
                        animationType="slide"
                        visible={this.state.onePostSelected}
                    >
                        <MaterialIcons
                            name="close"
                            size={24}
                            style={{ ...syles.modalToggle, ...syles.modalClose }}
                            onPress={() => {
                                this.toggleOnePostSelected();
                            }}
                        />
                        <ScrollView>

                            <Card>
                                <Card.Title>
                                    <ListItem containerStyle={{ padding: 0 }} onPress={() => this.pressHandler({ userId: this.state.postOwner, token: this.state.token })}>
                                        <Avatar rounded size="small" source={require("../../assets/default-avatar.jpg")} />
                                        <ListItem.Content>
                                            <ListItem.Title>@{this.state.post.author.name}</ListItem.Title>
                                            <ListItem.Subtitle>{this.state.post.author.email}</ListItem.Subtitle>
                                        </ListItem.Content>
                                    </ListItem>
                                </Card.Title>
                                <Card.Divider />

                                <Card.Image source={{ uri: this.state.post.image }} onPress={() => this.onPress()}>

                                </Card.Image>
                                <Text style={{ margin: 10 }}>
                                    {this.state.post.caption}
                                </Text>
                                <Text style={{ margin: 10, color: '#f01d71' }}>
                                    #{this.state.post.category.name}
                                </Text>
                                <Text style={{ margin: 10 }} onPress={() => this.toggleOnePostSelected()}>
                                    {this.state.numberofLikes} Likes . {this.state.numberOfComments} Comments
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <TouchableOpacity onPress={() => this.likePost()} style={{ flex: 1, alignItems: 'center' }}>
                                        {this.state.liked ? <AntDesign name="heart" size={20} color="#f01d71" /> : <AntDesign name="hearto" size={20} color="#f01d71" />}
                                    </TouchableOpacity>

                                </View>
                                <Text>{'\n'}</Text>
                                <Card.Divider />
                                <SafeAreaView >
                                    <FlatList
                                        data={this.state.comments}
                                        keyExtractor={(item) => item._id}
                                        renderItem={({ item }) =>
                                            <ListItem bottomDivider>
                                                <Avatar source={require("../../assets/default-avatar.jpg")} />
                                                <TouchableOpacity onLongPress={() => {
                                                    Alert.alert(
                                                        "Delete Comment",
                                                        "Are you sure you want to delete this comment?",
                                                        [
                                                            {
                                                                text: "Cancel",
                                                                onPress: () => console.log("cancelled"),
                                                                style: "Cancel"
                                                            },
                                                            {
                                                                text: "Yes",
                                                                onPress: () => this.deleteComment(item._id)
                                                            }
                                                        ]
                                                    )
                                                }}>

                                                    <ListItem.Content>
                                                        <ListItem.Title>{item.author.name}</ListItem.Title>
                                                        <ListItem.Subtitle>{item.body}</ListItem.Subtitle>
                                                    </ListItem.Content>
                                                </TouchableOpacity>
                                                <Card.Divider />
                                            </ListItem>
                                        }
                                    />
                                </SafeAreaView>
                                <Input
                                    style={{ marginTop: 10 }}
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
                            </Card>

                        </ScrollView>
                    </Modal>


                )
        )
    }
}

const syles = StyleSheet.create({
    image: {
        height: 30,
        width: 30,
        borderRadius: 15,

    },
    postContainer: {
        flex: 1,
        padding: 20,
        height: 200
    },
    text: {
        lineHeight: 30,
        alignContent: 'center',
        justifyContent: 'center'
    },
    modalToggle: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#f2f2f2",
        padding: 10,
        borderRadius: 10,
        alignSelf: "center",
    },
    modalClose: {
        marginTop: 20,
        marginBottom: 0,
    },
    modalContent: {
        flex: 1,
    },
    itemContent: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
})

export default Post
