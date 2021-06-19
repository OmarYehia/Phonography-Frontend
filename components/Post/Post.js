import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, Image, Platform, TouchableOpacity, Alert, FlatList, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { Card, Button, Icon, Input, Overlay, ListItem, Avatar } from 'react-native-elements'
import { BACKEND_URL } from '../../ENV'
import { API_URL } from '../../@env'
import jwt_decode from "jwt-decode";
import { TOKEN } from '../../ENV'
import avatar from '../../assets/default-avatar.jpg'
import Zicon from 'react-native-vector-icons/FontAwesome';
import { List } from 'react-native-paper';


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
            onePostSelected: false,
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
                this.componentDidMount();
            })
            .catch(err => console.log(err))
    }
    toggleOnePostSelected = () => {
        this.setState({ onePostSelected: !this.state.onePostSelected })
    }
    pressHandler = (item) => {
        navigation.navigate('User Profile', item);
    }
    deleteComment=(id)=>{
        fetch(`${BACKEND_URL}/comment/${id}`,{
            method:"DELETE",
            headers:{
                'Authorization':`Bearer ${TOKEN}`
            }
        })
        .then(response=>response.json())
        .then(result=>{
            if(result.success){
                Alert.alert("Success","Comment deleted Successfully")
                this.componentDidMount();
            }else{
                Alert.alert("Failure",result.errors.message)
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
                        <ListItem containerStyle={{ padding:0}} onPress={() => this.pressHandler(item)}>
                            <Avatar rounded size="small" source={require("../../assets/default-avatar.jpg")} />
                            <ListItem.Content>
                                <ListItem.Title>@{this.state.post.author.name}</ListItem.Title>
                                <ListItem.Subtitle>{this.state.post.author.email}</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                    </Card.Title>

                    <Card.Divider />
                    <Card.Image source={{ uri: this.state.post.image }}>

                    </Card.Image>
                    <Text style={{ margin: 10, }}>
                        {this.state.post.caption}
                    </Text>
                    <Text style={{ margin: 10, color: 'blue', textAlign: 'right' }}>
                        #{this.state.post.category.name}
                    </Text>

                    <Text style={{ margin: 10 }} onPress={() => this.toggleOnePostSelected()}>
                        {this.state.numberofLikes} Likes . {this.state.numberOfComments} Comments
                    </Text>
                    <Card.Divider />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity onPress={() => this.likePost()}>

                            <Text><Zicon name="heart" size={20} color="blue" /> {this.state.liked ? "Unlike" : "Like"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ disabled: !this.state.disabled, comment: null })}>
                            <Text><Zicon name="comments" size={20} color="blue" /> Add Comment</Text>
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
                    <View>
                        <Card>
                            <Card.Title>
                                <ListItem>
                                    <Avatar rounded size="small" source={require("../../assets/default-avatar.jpg")} />
                                    <ListItem.Content>
                                        <ListItem.Title>@{this.state.post.author.name}</ListItem.Title>
                                        <ListItem.Subtitle>{this.state.post.author.email}</ListItem.Subtitle>
                                    </ListItem.Content>
                                </ListItem>
                            </Card.Title>
                            <Card.Divider />
                            <Card.Image source={{ uri: this.state.post.image }}>

                            </Card.Image>
                            <Text style={{ margin: 10 }}>
                                {this.state.post.caption}
                            </Text>
                            <Text style={{ margin: 10, color: 'blue' }}>
                                #{this.state.post.category.name}
                            </Text>
                            <Text style={{ margin: 10 }} onPress={() => this.toggleOnePostSelected()}>
                                {this.state.numberofLikes} Likes . {this.state.numberOfComments} Comments
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <TouchableOpacity onPress={() => this.likePost()}>

                                    <Text><Zicon name="heart" size={20} color="blue" /> {this.state.liked ? "Unlike" : "Like"}</Text>
                                </TouchableOpacity>

                            </View>
                            <Text>{'\n'}</Text>
                            <Card.Divider />
                            <SafeAreaView style={{ flex: 1 }}>
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
                                                                onPress: ()=>console.log("cancelled"),
                                                                style: "Cancel"
                                                            },
                                                            {
                                                                text: "Yes",
                                                                onPress: ()=>this.deleteComment(item._id)
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

                    </View>
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
    }
})

export default Post
