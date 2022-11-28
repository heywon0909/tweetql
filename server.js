import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch"
let tweets = [
  {
    id:"1",
    text:"first one!",
    userId:"2"
  },
  {
    id:"2",
    text:"second one!",
    userId:"1"
  }
]
let users = [
  {id:"1",
  firstName:"nico",
  lastName:"las"
},
{
  id:"2",
  firstName:"Elon",
  lastName:"musk"
}
];
const typeDefs = gql`
  type User {
    id:ID!
    username:String!
    firstName:String!
    lastName:String!
    """
    Is the sum of firstName + lastName as a string
    """
    fullName:String!
  }
  """
  Tweet object represents a resource for a Tweet
  """
  type Tweet {
    id:ID!
    text:String!
    author:User
  }
  type Movie{
    id:Int!, 
    url:String!, 
    imdb_code:String!, 
    title:String!, 
    title_english:String!, 
    title_long:String!, 
    slug:String!,
    year:Int, 
    rating:Float!, 
    runtime:Float!, 
    genres:[String]!, 
    summary:String, 
    description_full:String!, 
    synopsis:String, 
    yt_trailer_code:String!, 
    language:String!, 
    mpa_rating:String!, 
    background_image:String!, 
    background_image_original:String!, 
    small_cover_image:String!, 
    medium_cover_image:String!, 
    large_cover_image:String!
  }
  type Query {
    allMovies:[Movie!]!
    allUsers:[User]!
    allTweets:[Tweet!]!
    tweet(id:ID!):Tweet
    movie(id:String!):Movie
  }
  type Mutation{
    postTweet(text:String!, userId:ID!):Tweet!
    """ Deletes a Tweet if found, else returns false """
    deleteTweet(id:ID!):Boolean!
  }`;
const resolvers ={
  Query:{
    tweet(){
      console.log('i am called');
      return null;
    },
    allTweets(){
      return tweets
    },
    tweet(_,{id}){
      return tweets.find(tweet=>tweet.id===id);
    },
    allUsers(){
      console.log('all users called');
      return users;
    },
    allMovies(){
      return fetch("https://yts.mx/api/v2/list_movies.json").then((r)=>r.json()).then(json=>json.data.movies);
    },
    movie(_,{id}){
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`).then((r)=>r.json()).then(json=>json.data.movie);
    }
  },
  Mutation:{
    postTweet(_,{ text, userId}){
      const findIndex = this.users.find(user=>user.id===userId);
      if(findIndex===-1) throw new Error('not Found');
      const newTweet = {
        id:tweets.length+1,
        text,
        userId
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_,{id}){
      const tweet= tweets.find(tweet=>tweet.id===id);
      if(!tweet) return false;
      tweets = tweets.filter(tweet=> tweet.id !== id);
      return true;
    }
  },
  User:{
    fullName({firstName,lastName}){
     return  `${firstName} ${lastName}`
    }
  },
  Tweet:{
    author({userId}){
      return users.find((user)=>user.id ===userId)
    }
  }
}
const server = new ApolloServer({ typeDefs,resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
