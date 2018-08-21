import React from "react";
import Router from "next/router";
import { withRouter } from "next/router";
import * as nodeUrl from "url";

import Alert from "../common/Alert";
import api from "../../conf/api.js";
import SearchAnswer from "./SearchAnswer";
import SearchResults from "./SearchResults";
import Categories from "./Categories";

class Search extends React.Component {
  state = {
    query: "",
    data: null,
    error: null,
    pendingXHR: false
  };

  componentDidMount() {
    // A query already exists in the URL: route was accessed via direct URL.
    if (Router.query && Router.query.q) {
      this.fetchResults(decodeURI(Router.query.q));
    }
    Router.onRouteChangeStart = url => {
      return this.onRouteChange(url);
    };
  }

  onRouteChange = url => {
    // If there is a `q` parameter in the querystring of the URL, we have a query in the URL.
    let query = nodeUrl.parse(url, true).query.q;
    if (query) {
      return this.fetchResults(decodeURI(query));
    }
    return this.setState({ data: null, query: "" });
  };

  urlReset = () => {
    // This will trigger the `onRouteChangeStart` listener.
    return Router.push({ pathname: "/" });
  };

  urlUpdate = query => {
    // This will trigger the `onRouteChangeStart` listener.
    return Router.push({ pathname: "/", query: { q: query } });
  };

  onFormSubmit = event => {
    event.preventDefault();
    if (this.state.query) {
      this.urlUpdate(encodeURI(this.state.query));
    }
  };

  onSearchInputChange = event => {
    let query = event.target.value;
    if (!query) {
      return this.urlReset();
    }
    this.setState({ query: query });
  };

  onKeyDown = event => {
    if (event.keyCode === 27) {
      return this.urlReset();
    }
  };

  fetchResults = query => {
    this.setState({ query, pendingXHR: true, error: null }, () => {
      fetch(`${api.BASE_URL}/search?q=${this.state.query}`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(api.ERROR_MSG);
        })
        .then(data => this.setState({ data, pendingXHR: false }))
        .catch(error => this.setState({ error, pendingXHR: false }));
    });
  };

  render() {
    const { data, error, pendingXHR, query } = this.state;
    const { router } = this.props;
    const xhrErrorJsx = error ? (
      <div className="section-light">
        <div className="container">
          <Alert category="danger">{error.message}</Alert>
        </div>
      </div>
    ) : null;
    const loadingJsx = pendingXHR ? (
      <p className="search__loading" role="alert" aria-live="assertive">
        Chargement…
      </p>
    ) : null;
    const showAnswer = router.query && router.query.type === "questions";

    let content = null;
    if (showAnswer) {
      content = <SearchAnswer data={data} id={router.query.id} />;
    } else {
      if (!data) {
        // No query.
        content = <Categories urlUpdate={this.urlUpdate} />;
      } else {
        content = <SearchResults data={data} query={query} />;
      }
    }

    return (
      <div>
        <section className="section-light shadow-bottom">
          <div className="container">
            <div className="search">
              <header>
                <h1 className="no-margin">
                  Posez votre question sur le droit du travail
                </h1>
                <p>
                  Ce site est <b>en cours de construction</b> : les données qui
                  s'y trouvent peuvent être erronées ou imprécises.
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
              </header>
              <form className="search__form" onSubmit={this.onFormSubmit}>
                <input
                  autoFocus
                  aria-label="Posez votre question"
                  className="search__input"
                  onChange={this.onSearchInputChange}
                  onKeyDown={this.onKeyDown}
                  placeholder="Posez votre question"
                  type="search"
                  value={query}
                />
                <button type="submit" className="btn btn__img btn__img__search">
                  <span className="hidden">Rechercher</span>
                </button>
              </form>
              {loadingJsx}
            </div>
          </div>
        </section>
        {xhrErrorJsx}
        {content}
      </div>
    );
  }
}

export default withRouter(Search);
