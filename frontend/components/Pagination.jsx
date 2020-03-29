import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PaginationStyles from "./styles/PaginationStyles";
import { perPage } from "../config";
import Head from "next/head";
import Link from "next/link";
const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => {
  return (
    <Query query={PAGINATION_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        const count = data.itemsConnection.aggregate.count;
        const pages = Math.ceil(count / perPage);
        const page = props.page;
        return (
          <PaginationStyles>
            <Head>
              <title>
                Tada Ecommerce - Page {page} of {pages}
              </title>
            </Head>
            <Link
              href={{
                pathname: "shop",
                query: { page: page - 1 }
              }}
            >
              <a className="prev" aria-disabled={page <= 1}>
                &#x2039; Prev
              </a>
            </Link>
            <p>
              Page {props.page} of {pages}
            </p>
            <p>
              {count} item{count >= 2 && "s"} total
            </p>
            <Link
              href={{
                pathname: "shop",
                query: { page: page + 1 }
              }}
            >
              <a className="prev" aria-disabled={page >= pages}>
                Next &#x203A;
              </a>
            </Link>
          </PaginationStyles>
        );
      }}
    </Query>
  );
};

export default Pagination;
