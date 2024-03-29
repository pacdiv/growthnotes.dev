import React from "react"
import { css } from "@emotion/core"
import styled from "@emotion/styled"

const Container = styled.div`
  margin-bottom: 2em;
  margin-top: 6em;
  position: relative;

  &::before {
    background-color: #f0f0f0;
    content: "";
    height: 1px;
    left: 0;
    position: absolute;
    top: -2em;
    right: 0;
  }

  ${({ altDisposition }) =>
    altDisposition &&
    css`
      margin-bottom: 0;
      margin-top: 0;

      &::before {
        content: none;
      }
    `}
`

const StyledForm = styled.form`
  align-items: center;
  color: #222222;
  display: flex;
  flex-direction: column;
  justify-content: center;

  input {
    border: 0;
    padding: 0.5em 1em;
    text-align: center;
    width: 100%;

    &[type="email"] {
      border-radius: 4px 4px 0 0;

      ${({ containsErrors }) =>
        containsErrors &&
        css`
          border: 2px solid red;
        `}
    }

    &[type="submit"]  {
      background-color: #ffe70b;
      border-radius: 0 0 4px 4px;
    }
  }

  @media (min-width: 700px) {
    justify-content: flex-start;
    flex-direction: row;

    input {
      &[type="email"] {
        border-radius: 4px 0 0 4px;
        text-align: left;
      }

      &[type="submit"] {
        border-radius: 0 4px 4px 0;
        width: 26em;
      }
    }
  }
`

const Title = styled.h3`
  ${({ withoutMarginTop }) =>
    withoutMarginTop &&
    css`
      margin-top: 0;
    `
  }
`

class Form extends React.Component {
  static emailingEndpoint = process.env.GATSBY_GROWTHNOTES_SITE_MAILING_ENDPOINT

  static isEmailAddressValid(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  }

  state = {
    apiError: false,
    localError: false,
    errorMessage: '',
    success: false,
    value: "",
  }

  formRef = React.createRef()

  onFieldChange = event => {
    this.setState({
      value: event.target.value,
    })
  }

  onSubmitClick = event => {
    event.preventDefault()

    const email = this.state.value.trim()

    if (Form.isEmailAddressValid(email)) {
      this.setState({ localError: false }, () => {
        fetch(Form.emailingEndpoint.concat('/', email))
          .then(({ status }) =>
            status === 200
              ? this.setFormAsSuccess()
              : this.setFormAsFailure()
          )
          .catch(this.setFormAsFailure)
      })

      return
    }

    this.setState({ localError: true })
  }

  setFormAsFailure = () => this.setState({ apiError: true })

  setFormAsSuccess = () => this.setState({ success: true })

  render() {
    const { altDisposition } = this.props
    const { apiError, localError, success, value } = this.state

    return (
      <Container altDisposition={altDisposition}>
        <Title withoutMarginTop={altDisposition}>
          Get access to notes from my journey to build an audience as a
          developer.
        </Title>
        {altDisposition && (
          <p>
            All my previous side-projects failed for the same old reason: no one
            heard from them. I'm currently working on tactics so this doesn't happen again.
            <br />
            Subscribe to get notified!
          </p>
        )}
        {success ? (
          <p>
            I just sent you an email!
            <br />
            <small>(Please check your spam box, just in case)</small>
          </p>
        ) : (
          <StyledForm
            action={Form.emailingEndpoint}
            containsErrors={localError}
            method="POST"
            novalidate
            ref={this.formRef}
          >
            <input
              id="mce-EMAIL"
              name="EMAIL"
              onChange={this.onFieldChange}
              placeholder="Type here your email address"
              required
              value={value}
              type="email"
            />
            <input
              onClick={this.onSubmitClick}
              name="subscribe"
              value="Tell me more"
              type="submit"
            />
          </StyledForm>
        )}
        {apiError ? (
          <p>
            An error has occurred. Please contact me at{" "}
            <a href="mailto:loic@growthnotes.dev">loic@growthnotes.dev</a>.
          </p>
        ) : (
          <small>*No spam and one-click unsubscribe.</small>
        )}
      </Container>
    )
  }
}
      
export default Form
