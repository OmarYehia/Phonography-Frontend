import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View,ScrollView, TouchableOpacity,  Alert } from "react-native";
import { globalStyles } from "../../styles/global";
import Card from "../../components/shared/card";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../@env";
import SolidButton from "../../components/shared/SolidButton";
import jwt_decode from "jwt-decode";
import Spinner from "react-native-loading-spinner-overlay";
import Post from "../../components/Post/Post";
import AddPostForm from "../../components/Post/addPostForm";
import { schedulePushNotification } from "../../services/notification";
import { showMessage } from "react-native-flash-message";
import { MaterialIcons } from '@expo/vector-icons';




export default function CompetitionDetails({ route, navigation }) {
  const [competitors, setCompetitors] = useState(null);
  const [isJoined, setIsJoined] = useState();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changed, setChanged] = useState(false);
  const [posts, setPosts] = useState(null);
  const [isEnded, setIsEnded] = useState();
  const [winner, setWinner] = useState();
  const [winnerPost, setWinnerPost] = useState();
  const userToken = route.params.userToken;
  const userRole = route.params.role
  

    const pressHandler = (competitionId,currentUserId, userToken, winner) => {
        navigation.navigate('Competitors', {competitionId, currentUserId, userToken, winner});
    }
    const joinHandler = async () => {
        try {
            const res = await fetch(`${API_URL}/competition/${route.params._id}/competitor/join`, {
              headers: { 
                  "Content-Type": "application/json" ,
                  "Authorization": `Bearer ${userToken}`
              },
              method: "PUT",
            });
           
            const jsonRes = await res.json();
            if(jsonRes.Success){
                setIsJoined(true);
                setChanged(!changed);
                
            }
           // console.log("heey",isJoined)
           // console.log(jsonRes);
            return jsonRes;
  
          } catch (error) {
              console.log(error)
            return error;
          }
  };
  const disjoinHandler = async () => {
    Alert.alert("Warning", `If you quit this contest your posts will be deleted, Are you sure?`, [
      {
        text: "yes",
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/competition/${route.params._id}/competitor/remove`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
              method: "PUT",
            });
      
            const jsonRes = await res.json();
            if (jsonRes.Success) {
              setIsJoined(false);
              setChanged(!changed)
              //   console.log(isJoined);
            }
            // console.log(jsonRes);
            return jsonRes;
          } catch (error) {
            console.log(error);
            return error;
          }
        },
      },
      { text: "No" },
    ]);
  };
  const endContestHandler = async () => {
    let winnerId
    if(posts.length>1){
      let max = posts[0].likes.length 
       winnerId = posts[0].author._id;
       setWinnerPost(posts[0]);
      for (let i = 1; i < posts.length; i++){
            if(posts[i].likes.length > max){
              max = posts[i].likes.length;
              w = posts[i].author._id;
              setWinnerPost(posts[i]._id);
     
            }
      }
      console.log("winner",w);
    }else {
      setWinner();
     // setIsEnded(true);
     // setChanged(!changed)
      console.log("There are no posts");
    }
     
      try {
       
        const res = await fetch(`${API_URL}/competition/assign-winner/${route.params._id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          method: "PUT",
          body: JSON.stringify({winner:winnerId})
        });
        
        const jsonRes = await res.json();
        console.log("res",jsonRes);
        setIsEnded(true);
        if (jsonRes.Success) {
            showMessage({
              message: `Contest has been ended succesfully!`,
              type: "success",
              duration: 2500,
              icon: "auto",
            });
            competitors.forEach(competitor => {
              if(competitor._id == currentUserId){
                schedulePushNotification({
                  content: {
                    title: `${route.params.name}`,
                    body: `The ${route.params.name} Contest  has been ended `,
                  },
                  trigger: { seconds: 2 },
                });
              }if(competitor._id == winnerId){
                schedulePushNotification({
                  content: {
                    title: "Congratulations",
                    body: `The ${route.params.name} Contest  has been ended and you won the contest`,
                  },
                  trigger: { seconds: 2 },
                });
              }
              
            });
            
            
        }
        
           else {
            showMessage({
              message: `Contest can't be ended. Something went wrong.`,
              type: "danger",
              duration: 2500,
              icon: "auto",
            });
          }
        
        return jsonRes;
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    
  
  useEffect(() => {
    const decodedToken = jwt_decode(userToken);
    const currentUser = decodedToken.userId;
    setCurrentUserId(currentUser);

    if(route.params.endDate < new Date()){
      endContestHandler();
    }
    fetch(`${API_URL}/competition/${route.params._id}`)
    .then(res => {
        if(res.ok) {
            return res.json()
        } else {
            if (res.status === 404){
                throw Error("Notfound")
            }
        }
    })
    .then(data => {
        setIsEnded(data.data.competition.isEnded);  
        setWinner(data.data.competition.winner);  
    })
    .catch(err => {
        console.log(err)
    })
    fetch(`${API_URL}/competition/${route.params._id}/competitors`)
          .then(res => {
              if(res.ok) {
                  return res.json()
              } else {
                  if (res.status === 404){
                      throw Error("Notfound")
                  }
              }
          })
          .then(data => {
              setCompetitors(data.data.competitors);
              if(currentUser){
               
                data.data.competitors.forEach((competitor) => {

                    if(currentUser === competitor._id){
                        setIsJoined(true)
                    } else{
                        setIsJoined(false)
                    }
                });    
              }    
          })
          .catch(err => {
              console.log(err)
          })
        //get all posts of competition
        fetch(`${API_URL}/posts/competition/${route.params._id}`)
          .then(res => {
              if(res.ok) {
                  return res.json()
              } else {
                  if (res.status === 404){
                      throw Error("Notfound")
                  }
              }
          })
          .then(data => {
            setPosts(data.data.post);
            setLoading(false);
            
             
          })
          .catch(err => {
              console.log(err)
          })
  }, [changed]);

  return (
    <ScrollView style={globalStyles}>
     <Spinner visible={loading} />
      <Card>
        <Text style={{ ...globalStyles.titleText, ...styles.nameText }}>{route.params.name}</Text>
        <View style={styles.items}>
          <Text style={globalStyles.normalText}>Sponsor: </Text>
          <Text style={globalStyles.normalText}>{route.params.sponsor.name}</Text>
        </View>
        <View style={styles.items}>
          <Text style={globalStyles.normalText}>Prizes: </Text>
          <Text style={globalStyles.normalText}>{route.params.prizes}</Text>
        </View>
        <View style={{ ...styles.items, ...styles.date }}>
          <Text style={globalStyles.normalText}>From: {route.params.startDate}</Text>
          <Text style={globalStyles.normalText}>To: {route.params.endDate}</Text>
        </View>
        <TouchableOpacity style={styles.items} onPress={() => pressHandler(route.params._id,currentUserId,userToken, winner)}>
                <Text style={globalStyles.normalText}>Competitors   </Text>
                <Ionicons name="people-outline" size={30} color="crimson" />
        </TouchableOpacity>
        {route.params.winner? (
        <View style={styles.items}>
                <Text style={globalStyles.normalText}>Winner: {route.params.winner.name} </Text>
               
        </View>):null}
        {!isEnded ?
          !isJoined ? (
          <View style={styles.items}>
            <SolidButton text="Join This Context"  onPress={() => joinHandler()} borderRadius={30}/>
            
          </View>
        ) : (
          <View style={styles.items}>
            <SolidButton text="Disjoin This Context" onPress={() => disjoinHandler()} borderRadius={30} />
          </View>
        ):(
          <View style={styles.items}>
            <Text style={globalStyles.titleText}>This Contest has been ended</Text>
          </View>
          
          )}
      </Card>
      { !isEnded && userRole === "admin"? (<SolidButton text="End Contest" onPress={()=>endContestHandler()} />):null}
      { !isEnded ?
       !isJoined ?
      (
          <View >
            <Text style={globalStyles.paragraph}>Join The Contest To post your Images</Text>
          </View>
        ) : (
          <View >
            <AddPostForm competitionId={route.params._id} route={route} navigation={navigation}/>
          </View>
        ): null}
       
      <ScrollView >
              {loading ?
                  <Text>Loading ...</Text> :
                  ( posts.map(post => <Post key={post._id} post={post} token={userToken} navigation={navigation} />) )}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  nameText: {
    fontSize: 20,
    alignSelf: "center",
  },
  items: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  date: {
    justifyContent: "space-around",
  },
});
