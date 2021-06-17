import React, { Component } from 'react'
import { StyleSheet, Text, View,ScrollView, TextInput, Image, Button, Platform, TouchableOpacity } from 'react-native';
import { BACKEND_URL } from '../../ENV'
import { API_URL } from '../../@env'
import { TOKEN } from '../../ENV'
import Post from './Post'

export class allPosts extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
        }
    }
    componentDidMount() {
        fetch(`${BACKEND_URL}/posts`, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            }
        }).then(response => response.json())
            .then(result => {
                console.log(result);
                this.setState({ posts: result.data.post })
            })
    }
    render() {
        return (
            <ScrollView style={syles.postContainer}>
                {this.state.posts.length ? this.state.posts.map(post => <Post  key={post._id} post={post} />) : <Text>No Available Posts to show.</Text>}
            </ScrollView>
        )
    }
}

const syles = StyleSheet.create({
    image: {
        height: 100,
        width: 100
    },
    postContainer: {
        height: 900
    },
})
export default allPosts
