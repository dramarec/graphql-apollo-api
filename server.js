const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

dotEnv.config();


const app = express();
app.use(cors());
app.use(express.json());


const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 3000;

app.use('/', (req, res, next) => {
    res.send({ message: 'Hello' });
})

app.listen(PORT, () => {
    console.log(`Server listening on PORT: http://localhost:${PORT}`);
    console.log(`Graphql Endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`);
});