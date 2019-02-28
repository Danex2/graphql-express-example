const graphql = require("graphql");
const Book = require("../models/Books");
const Author = require("../models/Author");

// Importing the graphql types
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

/* 
  - This is the book object
  - We gave it the name book for obvious reasons
  - The fields function defines the fields the object should have (will not work if it is not a function)
  - Fields can be anything you like
  - If you want to have a relation with another field the type must be the name of the graphql object
  - The resolve function takes in 3 arguments: parent, args and request
  - We use the parent argument if we have to access the fields of the parent object 
  - We use the args argument if we are accessing the arguments passed in from the base query
  - To actually return data we need to have a return statement in the resolve function
*/
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        // return the information about a book and the author of that book
        return Author.findById({ id: parent.authorId });
      }
    }
  })
});
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return all the books by the author
        return Book.find({ authorId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db
        // return information about a single book by the
        return Book.findById({ id: args.id });
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return information about a single author by the
        return Author.findById({ id: args.id });
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return all books
        return Book.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        let author = {
          name: args.name,
          age: args.age
        };
        return Author.create(author);
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) } //seems weird having to look into the database for the authorId, needs to be a relationship in the db with the authorId and the and the id of the author
      },
      resolve(parent, args) {
        let book = {
          name: args.name,
          genre: args.genre,
          author: args.authorId
        };
        return Book.create(book);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
