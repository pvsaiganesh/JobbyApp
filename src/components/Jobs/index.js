import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Navbar from '../Navbar'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const apiStatus = {
  initial: 'INITIAL',
  loading: 'LOADING',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class Jobs extends Component {
  state = {
    employment: [],
    salary: '',
    search: '',
    profileData: [],
    jobsData: [],
    currentStatus: apiStatus.initial,
  }

  componentDidMount = () => {
    this.getData()
  }

  getData = async () => {
    this.setState({currentStatus: apiStatus.loading})
    const {employment, salary, search} = this.state
    const employmentParam = employment.join(',')
    console.log(employmentParam)
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
      const response1 = await fetch(
        `https://apis.ccbp.in/jobs?employment_type=${employmentParam}&minimum_package=${salary}&search=${search}`,
        options,
      )
      if (response1.ok === true) {
        const data1 = await response1.json()
        const profileData = {
          name: data.profile_details.name,
          profileImageUrl: data.profile_details.profile_image_url,
          shortBio: data.profile_details.short_bio,
        }
        const jobsData = data1.jobs.map(item => ({
          companyLogoUrl: item.company_logo_url,
          employmentType: item.employment_type,
          id: item.id,
          jobDescription: item.job_description,
          location: item.location,
          packagePerAnnum: item.package_per_annum,
          rating: item.rating,
          title: item.title,
        }))
        this.setState({profileData, jobsData, currentStatus: apiStatus.success})
        // console.log(profileData, jobsData)
      } else {
        this.setState({currentStatus: apiStatus.failure})
      }
    } else {
      this.setState({currentStatus: apiStatus.failure})
    }
  }

  addEmploymentId = id => {
    const {employment} = this.state
    const presence = employment.filter(item => item === id)
    if (presence.length === 0) {
      this.setState(
        prev => ({employment: [...prev.employment, id]}),
        this.getData,
      )
    }
    console.log(employment)
  }

  removeEmploymentId = id => {
    const {employment} = this.state
    const presence = employment.filter(item => item === id)
    if (presence.length === 1) {
      this.setState(
        prev => ({
          employment: prev.employment.filter(item => item !== id),
        }),
        this.getData,
      )
    }
    console.log(employment)
  }

  renderSuccessView = () => {
    const {profileData, jobsData} = this.state
    const {name, shortBio, profileImageUrl} = profileData
    return (
      <div>
        <Navbar />
        <div className="profile-container">
          <h1>{name}</h1>
          <img alt="profile" src={profileImageUrl} />
          <p>{shortBio}</p>
        </div>
        <div className="employment-type-container">
          <ul>
            {employmentTypesList.map(item => {
              const getId = e => {
                console.log(e.target.checked)
                if (e.target.checked) {
                  this.addEmploymentId(item.employmentTypeId)
                } else {
                  this.removeEmploymentId(item.employmentTypeId)
                }
              }
              return (
                <li key={item.employmentTypeId}>
                  <input
                    onChange={getId}
                    type="checkbox"
                    id={item.employmentTypeId}
                  />
                  <label htmlFor={item.employmentTypeId}>{item.label}</label>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="salary-container">
          <ul>
            {salaryRangesList.map(item => (
              <li key={item.salaryRangeId}>
                <input
                  onChange={this.setSalary}
                  type="radio"
                  name="salary"
                  value={item.salaryRangeId}
                  id={item.salaryRangeId}
                />
                <label htmlFor={item.salaryRangeId}>{item.label}</label>
              </li>
            ))}
          </ul>
        </div>
        <div className="jobs-container">
          <ul>
            {jobsData.map(item => {
              const {
                companyLogoUrl,
                employmentType,
                id,
                jobDescription,
                location,
                packagePerAnnum,
                rating,
                title,
              } = item
              return (
                <Link key={id} to={`/jobs/${id}`}>
                  <li>
                    <h1>{title}</h1>
                    <p>{rating}</p>
                    <p>{packagePerAnnum}</p>
                    <p>{location}</p>
                    <p>Description</p>
                    <p>{jobDescription}</p>
                    <p>{employmentType}</p>
                    <img alt="company logo" src={companyLogoUrl} />
                  </li>
                </Link>
              )
            })}
          </ul>
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
export default Jobs