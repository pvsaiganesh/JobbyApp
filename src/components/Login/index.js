import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {user: '', pass: '', errMsg: ''}

  getUsername = e => {
    this.setState({user: e.target.value})
  }

  getPassword = e => {
    this.setState({pass: e.target.value})
  }

  getData = async e => {
    e.preventDefault()
    const {history} = this.props
    const {user, pass} = this.state
    const userDetails = {username: user, password: pass}
    const options = {method: 'POST', body: JSON.stringify(userDetails)}
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    if (response.ok === true) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 7})
      history.replace('/')
    } else {
      this.setState({errMsg: data.error_msg})
    }
  }

  render() {
    const {user, pass, errMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div>
        <form onSubmit={this.getData}>
          <img
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
          <input
            value={user}
            placeholder="Username"
            onChange={this.getUsername}
            id="user"
            type="text"
          />
          <label htmlFor="user">USERNAME</label>
          <input
            value={pass}
            onChange={this.getPassword}
            id="pass"
            type="password"
          />
          <label htmlFor="pass">PASSWORD</label>
          <button type="submit">Login</button>
          <p>{errMsg}</p>
        </form>
      </div>
    )
  }
}
export default Login
