import memoizee from "memoizee";
import React from "react";
import { Container } from "@socialgouv/code-du-travail-ui";

import AsyncFetch from "../lib/AsyncFetch";
import Suggester from "./Suggester";
import SearchResults from "./SearchResults";

import { Router, Link } from "../../routes";

const Disclaimer = () => (
  <div className="wrapper-narrow">
    <p>
      Ce service gouvernemental vous permet d’obtenir des réponses détaillées,
      des fiches explicatives et les articles de loi correspondants -{" "}
      <Link route="about">
        <a>En savoir plus</a>
      </Link>
      <br />
      <a
        target="_blank"
        className="external-link__after"
        rel="noopener noreferrer"
        href="https://www.legifrance.gouv.fr/affichTexteArticle.do;jsessionid=AE9DCF75DDCF0465784CEE0E7D62729F.tplgfr37s_2?idArticle=JORFARTI000035607420&cidTexte=JORFTEXT000035607388&dateTexte=29990101&categorieLien=id"
      >
        L'ouverture officielle du site est prévue pour 2020.
      </a>
    </p>
  </div>
);

const FormSearchButton = () => (
  <button type="submit" className="btn btn__img btn__img__search">
    <span className="hidden">Rechercher</span>
  </button>
);

const fetchResults = (query, endPoint = "search") => {
  const url = `${process.env.API_URL}/${endPoint}?q=${query}`;
  return fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Un problème est survenu.");
  });
};

// memoize search results
const fetchResultsSearch = memoizee(
  query => {
    return fetchResults(query, "search");
  },
  { promise: true }
);

// memoize suggestions results
const fetchResultsSuggest = memoizee(
  query =>
    (query && query.length > 2 && fetchResults(query, "suggest")) ||
    Promise.resolve(),
  { promise: true }
);

export const SearchQuery = ({ query }) => (
  <AsyncFetch
    autoFetch={true}
    fetch={() => fetchResultsSearch(query)}
    render={({ status, result, clear }) => (
      <div>
        <div style={{ textAlign: "center" }}>
          {status === "loading" ? "..." : ""}
        </div>
        <div>
          {status === "success" && result && <SearchResults data={result} />}
        </div>
      </div>
    )}
  />
);

class Search extends React.Component {
  state = {
    query: "",
    submitQuery: ""
  };
  componentDidMount() {
    // A query already exists in the URL: route was accessed via direct URL.
    if (Router.query && Router.query.q) {
      this.setState({
        query: Router.query.q,
        submitQuery: Router.query.q
      });
    }
  }

  submitQuery = () => {
    if (this.state.query) {
      this.setState({ submitQuery: this.state.query });
      Router.push({
        pathname: "/",
        query: { q: this.state.query }
      });
    }
  };
  onFormSubmit = e => {
    e.preventDefault();
    this.submitQuery();
  };

  onChange = e => {
    if (e.target.keyCode === 13) {
      this.submitQuery();
    } else {
      this.setState({ query: e.target.value });
    }
  };

  render() {
    const { query, submitQuery } = this.state;
    return (
      <div>
        <div className="section-white shadow-bottom">
          <Container>
            <div className="search" style={{ padding: "1em 0" }}>
              <header>
                <h1 className="no-margin">
                  Posez votre question sur le droit du travail
                </h1>
                <Disclaimer />
              </header>
              <form className="search__form" onSubmit={this.onFormSubmit}>
                <Suggester
                  onChange={this.onChange}
                  query={query}
                  getResults={() => fetchResultsSuggest(query)}
                />
                <FormSearchButton />
              </form>
            </div>
          </Container>
        </div>
        {(submitQuery && <SearchQuery query={submitQuery} />) || null}
      </div>
    );
  }
}

export default Search;
