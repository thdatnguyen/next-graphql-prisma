import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import ErrorMessage from "./ErrorMessage";
import Router from "next/router";

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: "Tada",
    description: "Description for item",
    image: "",
    largeImage: "",
    price: 0,
    altImg: ""
  };
  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({
      [name]: val
    });
  };
  uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "ecommerce");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/tadaaaaa/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    const file = await res.json();
    console.log(file);

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
      altImg: file.original_file
    });
  };
  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              const res = await createItem();
              console.log(res);
              Router.push({
                pathname: "/item",
                query: { id: res.data.createItem.id }
              });
            }}
          >
            <ErrorMessage error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                {"image"[0].toUpperCase() + "image".slice(1)}
              </label>
              <input
                type="file"
                id="file"
                name="file"
                placeholder="Upload image for item"
                required
                onChange={this.uploadFile}
              />
              {this.state.image && (
                <img src={this.state.image} alt={this.state.altImg} />
              )}
              <label htmlFor="title">
                {"title"[0].toUpperCase() + "title".slice(1)}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder={"title"[0].toUpperCase() + "title".slice(1)}
                required
                value={this.state.title}
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
                value={this.state.price}
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
                value={this.state.description}
                onChange={this.handleChange}
              />
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
