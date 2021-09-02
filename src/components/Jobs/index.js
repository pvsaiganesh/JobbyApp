import {Component} from 'react'
import Navbar from '../Navbar'
import JobsList from './Jobs'
import ProfileData from './ProfileData'

class Jobs extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <ProfileData />
        <JobsList />
      </div>
    )
  }
}

export default Jobs
