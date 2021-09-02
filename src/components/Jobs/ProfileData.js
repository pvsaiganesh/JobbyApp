import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  loading: 'LOADING',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class ProfileData extends Component {
  state = {
    profileData: [],
    currentStatus: apiStatus.initial,
  }

  componentDidMount = () => {
    this.getData()
  }

  getData = async () => {
    this.setState({currentStatus: apiStatus.loading})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    if (response.ok === true) {
      const data = await response.json()
      const profileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({profileData, currentStatus: apiStatus.success})
      // console.log(profileData, jobsData)
    } else {
      this.setState({currentStatus: apiStatus.failure})
    }
  }

  renderSuccessView = () => {
    const {profileData} = this.state
    const {name, shortBio, profileImageUrl} = profileData
    return (
      <div>
        <div className="profile-container">
          <h1>{name}</h1>
          <img alt="profile" src={profileImageUrl} />
          <p>{shortBio}</p>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  refresh = () => {
    this.getData()
  }

  renderFailureView = () => (
    <div>
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <button onClick={this.refresh} type="button">
        Retry
      </button>
    </div>
  )

  render() {
    const {currentStatus} = this.state
    switch (currentStatus) {
      case apiStatus.success:
        return this.renderSuccessView()
      case apiStatus.failure:
        return this.renderFailureView()
      case apiStatus.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}
export default ProfileData
