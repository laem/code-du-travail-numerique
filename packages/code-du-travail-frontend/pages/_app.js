import App, { Container } from "next/app";
import React from "react";
import GitHubForkRibbon from "react-github-fork-ribbon";
import "@cdt/css";
import "@reach/dialog/styles.css";

import "../src/piwik";
import Header from "../src/layout/Header.js";
import Footer from "../src/layout/Footer.js";

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <GitHubForkRibbon
          href="//github.com/SocialGouv/code-du-travail-explorer"
          rel="noopener noreferrer"
          position="right"
          color="green"
        >
          version bêta
        </GitHubForkRibbon>
        <Header />
        <main id="main">
          <Component {...pageProps} />
        </main>
        <Footer />
      </Container>
    );
  }
}
