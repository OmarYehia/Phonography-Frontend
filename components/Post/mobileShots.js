import React, { Component } from 'react'
import { StyleSheet, Text, ActivityIndicator, View, ScrollView, TextInput, Image, Button, Platform, TouchableOpacity, Alert } from 'react-native';
import { BACKEND_URL } from '../../ENV'
import { API_URL } from '../../@env'
import { TOKEN } from '../../ENV'
import Post from './Post'
import Spinner from "react-native-loading-spinner-overlay";


export class allPosts extends Component {
    constructor(props) {
        console.log(props);
        super();
        this.state = {
            posts: [],
            loading: true,
        }
    }
    componentDidMount() {
        this.state.loading = true;
        fetch(`${API_URL}/posts/model/${this.props.route.params.model}`, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${this.props.route.params.userToken}`
            }
        }).then(response => response.json())
            .then(result => {
                if (result.success) {
                    result.data.post.sort((a,b)=>{
                        let da = new Date(a.created_at),
                            db = new Date(b.created_at)
                        return db-da;
                    })
                    result.data.post.forEach((e)=>{
                        e.image
                    })
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
                    <Spinner visible={this.state.loading} />
                    :
                    ((this.state.posts.length) ? this.state.posts.map(post => <Post key={post._id} post={post} token={this.props.route.params.userToken} navigation={this.props.navigation} />) : <Text>No Available Posts to show.</Text>)}
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
