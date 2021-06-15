const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

const uuid = require('uuid');
// const resolvers = require('./resolvers');
// const typeDefs = require('./typeDefs');
const { tasks, users } = require('./constants')

dotEnv.config();


const app = express();
app.use(cors());
app.use(express.json());

const typeDefs = gql`
    type Query {
        greetings: [String!]
        tasks: [Task!]
        task(id: ID!): Task
        users: [User!]
        user(id: ID!): User
    }

    input createTaskInput {
        name: String!
        completed: Boolean!
        userId: ID!
    }

    type Mutation {
        createTask(input: createTaskInput!): Task
    }

    type User {
        id: ID!
        name: String!
        email: String!
        tasks: [Task!] 
        # tasks: Task!
    }  
    type Task {
        id: ID!
        name: String!
        completed: Boolean!
        user: User!
    }
`
const resolvers = {
    Query: {
        greetings: () => ['Helllloooo', "hi", null],
        // tasks: () => tasks
        tasks: () => {
            // console.log("🔥🚀 ===> Query:tasks", tasks);
            return tasks
        },
        task: (_, args) => {
            console.log("🔥🚀 ===> args", typeof args.id);

            return tasks.find(task => task.id === args.id)
        },
        users: () => {
            return users
        },
        user: (_, { id }) => users.find(user => user.id === id),
        // user: (_, { id }) => users.filter(user => user.id === id),
    },
    Mutation: {
        createTask: (_, { input }) => {
            const task = { ...input, id: uuid.v4() }
            tasks.push(task)
            return task
        }
    },
    Task: {
        user: (root) => {
            // console.log("🔥🚀 ===> root", root);
            return users.find(user => user.id === root.userId)
        },
        // name: () => 'test-task'
    },
    User: {
        tasks: (root) => {
            // console.log("🔥🚀 ===> root", root);
            // return tasks.find(task => task.id === root.taskId) // находит если tasks: Task!
            // return tasks.find(task => task.userId === root.id)  // находит если tasks: Task!
            return tasks.filter(task => task.userId === root.id)  // находит если tasks: [Task!]
        }
    }

}

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