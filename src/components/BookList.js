import React, { Component } from "react";
import { graphql } from "react-apollo";
import { getBooksQuery } from "../queries/queries";

class BookList extends Component {
  displayBooks = () => {
    let data = this.props.data;
    if (data.loading) {
      return <h1>Loading Books!</h1>;
    }
    return data.books.map(book => {
      return <li key={book.id}>{book.name}</li>;
    });
  };
  render() {
    console.log(this.props);
    return (
      <div>
        <ul id="book-list">{this.displayBooks()}</ul>
      </div>
    );
  }
}

export default graphql(getBooksQuery)(BookList);
