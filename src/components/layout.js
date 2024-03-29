import React from "react"
import { css } from "@emotion/core"
import { Link } from "gatsby"
import styled from "@emotion/styled"

import Form from './form'
import { rhythm } from "../utils/typography"
import "./layout.css"

const Header = styled.header`
  ${({ fullHeight }) =>
    fullHeight &&
    css`
      display: flex;
      flex: 1 0 auto;
      flex-direction: column;
      justify-content: center;
    `
  }
`

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header
    const homeLink = location.pathname.startsWith("/blog")
      ? { path: '/', title }
      : { path: '/blog', title: '← blog' }

    if (location.pathname === rootPath) {
      header = (
        <Form altDisposition={location.pathname === rootPath} />
      )
    } else {
      header = (
        <h3
          style={{
            fontFamily: "Times New Roman",
            marginTop: 0,
            fontWeight: "600",
            letterSpacing: "-1.5px",
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={homeLink.path}
          >
            {homeLink.title}
          </Link>
        </h3>
      )
    }
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${location.pathname === rootPath ? '0' : '' } ${rhythm(1.5)} ${rhythm(3 / 4)}`,
          ...location.pathname === rootPath && {
            display: `flex`,
            flexDirection: `column`,
            justifyContent: `stretch`,
            alignItems: `center`,
            minHeight: `85vh`,
          }
        }}
      >
        <Header fullHeight={location.pathname === rootPath}>{header}</Header>
        <main>{children}</main>
        {location.pathname !== rootPath && (
          <footer>
            <Form />
            © {new Date().getFullYear()}, by PACDIV
          </footer>
        )}
      </div>
    )
  }
}

export default Layout
