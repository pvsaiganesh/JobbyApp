import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import JobItem from './JobItem'
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

class JobsList extends Component {
  state = {
    employment: [],
    salary: '',
    search: '',
    jobsData: [],
    currentStatus: apiStatus.initial,
  }

  componentDidMount = () => {
    this.getData1()
  }

  getData1 = async () => {
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
    const response1 = await fetch(
      `https://apis.ccbp.in/jobs?employment_type=${employmentParam}&minimum_package=${salary}&search=${search}`,
      options,
    )
    if (response1.ok === true) {
      const data1 = await response1.json()
      if (data1.jobs === []) {
        this.setState({jobsData: [], currentStatus: apiStatus.success})
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
      this.setState({jobsData, currentStatus: apiStatus.success})
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
        this.getData1,
      )
    }
    // console.log(employment)
  }

  removeEmploymentId = id => {
    const {employment} = this.state
    const presence = employment.filter(item => item === id)
    if (presence.length === 1) {
      this.setState(
        prev => ({
          employment: prev.employment.filter(item => item !== id),
        }),
        this.getData1,
      )
    }
    // console.log(employment)
  }

  getSearchValue = e => {
    this.setState({search: e.target.value})
  }

  updateJobs = () => {
    this.getData1()
  }

  changeValue = e => {
    this.setState({salary: e.target.value}, this.getData1)
    console.log(e.target.value)
  }

  renderSuccessView = () => {
    const {jobsData} = this.state
    return (
      <div>
        <input type="search" onChange={this.getSearchValue} />
        <button onClick={this.updateJobs} type="button" testid="searchButton">
          <BsSearch className="search-icon" />
        </button>
        <div className="employment-type-container">
          <h1>Type of Employment</h1>
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
          <h1>Salary Range</h1>
          <ul onChange={this.changeValue}>
            {salaryRangesList.map(item => (
              <li key={item.salaryRangeId}>
                <input
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
          {jobsData.length === 0 ? (
            <div>
              <img
                alt="no jobs"
                src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              />
              <h1>No Jobs Found</h1>
              <p>We could not find any jobs. Try other filters</p>
            </div>
          ) : (
            jobsData.map(item => <JobItem key={item.id} item={item} />)
          )}
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
    this.getData1()
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
export default JobsList
