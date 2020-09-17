import { ApolloServer, gql } from "apollo-server";
// Initialize firebase admin
import * as admin from "firebase-admin";
var serviceAccount = require("./what-is-in-my-fridge-d17be-firebase-adminsdk-t51ko-7d07b06fbc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://what-is-in-my-fridge-d17be.firebaseio.com",
});

interface Recipe {
  id: string;
  name: string;
  url: string;
  require: Array<string>;
}

var db: FirebaseFirestore.Firestore = admin.firestore();
let data: Array<Recipe> = [];

var collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> = db.collection(
  "recipies"
);
collection.onSnapshot((querySnapshot) => {
  console.log("Recieved QuerySnapshot");
  var docs: FirebaseFirestore.QueryDocumentSnapshot<
    FirebaseFirestore.DocumentData
  >[] = querySnapshot.docs;
  data = docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<Recipe>;
  console.log("In Memory cache Updated and Ready");
});

const score = (input: Array<string>) => {
  let scored = data.map((reciepe) => {
    let missing = reciepe.require.filter((x) => !input.includes(x));
    let score = missing.length / reciepe.require.length;
    return { ...reciepe, score, missing };
  });
  return scored.sort((a, b) => a.score - b.score);
};

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

const server: ApolloServer = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
