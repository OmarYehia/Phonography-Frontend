import React, { Component } from 'react'
import { StyleSheet, Text, ActivityIndicator, View, ScrollView, TextInput, Image, Button, Platform, TouchableOpacity, Alert } from 'react-native';
import { BACKEND_URL } from '../../ENV'
import { API_URL } from '../../@env'
import { TOKEN } from '../../ENV'
import Post from './Post'

export class allPosts extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
            loading: true,
        }
    }
    componentDidMount() {
        this.state.loading = true;
        fetch(`${BACKEND_URL}/posts`, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            }
        }).then(response => response.json())
            .then(result => {
                if (result.success) {
                    this.setState({ loading: false, posts: result.data.post })
                } else {
                    Alert.alert(result.errors.message)
                }

            })
    }
    render() {
        return (
            <ScrollView >
                {this.state.loading ?
                    <Text>Loading ...</Text> :
                    ((this.state.posts.length) ? this.state.posts.map(post => <Post key={post._id} post={post} />) : <Text>No Available Posts to show.</Text>)}
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
