const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: String!
  }

  type AuthPayload {
    message: String!
    user_id: String
    jwt_token: String
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    position: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    created_at: String!
    updated_at: String!
  }

  type EmployeeMessage {
    message: String!
    employee_id: String
  }

  type Query {
    employees: [Employee!]!
    employee(id: ID!): Employee
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addEmployee(
      first_name: String!
      last_name: String!
      email: String!
      position: String!
      salary: Float!
      date_of_joining: String!
      department: String!
    ): EmployeeMessage!
    updateEmployee(
      id: ID!
      first_name: String
      last_name: String
      email: String
      position: String
      salary: Float
      date_of_joining: String
      department: String
    ): EmployeeMessage!
    deleteEmployee(id: ID!): EmployeeMessage!
  }
`);
