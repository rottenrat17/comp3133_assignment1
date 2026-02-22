require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Employee Management API is running.' });
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    customFormatErrorFn: (err) => {
      return {
        message: err.message || 'Something went wrong.',
        status: false,
      };
    },
  })
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/graphql in your browser to use GraphiQL.`);
});
