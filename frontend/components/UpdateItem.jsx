import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import ErrorMessage from "./ErrorMessage";
import Router from "next/router";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({
      [name]: val,
    });
  };

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();

    await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      },
    });
  };

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (loading) return <p>Loading ....</p>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form
                  onSubmit={(e) => {
                    this.updateItem(e, updateItem);
                  }}
                >
                  <ErrorMessage error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      {"title"[0].toUpperCase() + "title".slice(1)}
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder={"title"[0].toUpperCase() + "title".slice(1)}
                      required
                      defaultValue={data.item.title}
                      onChange={this.handleChange}
                    />
                    <label htmlFor="price">
                      {"price"[0].toUpperCase() + "price".slice(1)}
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      placeholder={"price"[0].toUpperCase() + "price".slice(1)}
                      required
                      defaultValue={data.item.price}
                      onChange={this.handleChange}
                    />
                    <label htmlFor="description">
                      {"description"[0].toUpperCase() + "description".slice(1)}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder={
                        "description"[0].toUpperCase() + "description".slice(1)
                      }
                      required
                      defaultValue={data.item.description}
                      onChange={this.handleChange}
                    />
                    <button type="submit">
                      Sav{loading ? "ing" : "e"} Changes
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
