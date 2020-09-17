const { ApolloServer, gql } = require("apollo-server");

// Initialize firebase admin
import * as admin from "firebase-admin";
var serviceAccount = require("./what-is-in-my-fridge-d17be-firebase-adminsdk-t51ko-7d07b06fbc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://what-is-in-my-fridge-d17be.firebaseio.com",
});
var db = admin.firestore();
let data = [];

var collection = db.collection("recipies");
collection.onSnapshot((querySnapshot) => {
  console.log("Recieved QuerySnapshot");
  var docs = querySnapshot.docs;
  data = docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  console.log("In Memory cache Updated and Ready");
});

const typeDefs = gql`
  type Recipe {
    id: ID
    name: String
    url: String
    require: [String]
  }

  type Query {
    recipies: [Recipe]
  }
`;

const resolvers = {
  Query: {
    recipies: () => data,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
