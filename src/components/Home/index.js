import {Link} from 'react-router-dom'
import {Component} from 'react'
import Navbar from '../Navbar'
import './index.css'

class Home extends Component {
  goToJobsRoute = () => {
    const {history} = this.props
    history.push('/jobs')
  }

  render() {
    return (
      <div>
        <Navbar />
        <h1>Find The Job That Fits Your Life</h1>
        <img
          alt="img"
          src="https://assets.ccbp.in/frontend/react-js/home-lg-bg.png"
        />
        <p>Millions of people are searching for jobs</p>
        <Link to="/jobs">
          <button onClick={this.goToJobsRoute} type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    )
  }
}
export default Home
