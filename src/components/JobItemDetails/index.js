import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import SkillItem from './SkillItem'
import SimilarJobItem from './SimilarJobItem'
import Navbar from '../Navbar'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  loading: 'LOADING',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class JobItemDetails extends Component {
  state = {jobDetails: {}, similarJobs: [], currentStatus: apiStatus.initial}

  componentDidMount = () => {
    this.getData1()
  }

  getData1 = async () => {
    this.setState({currentStatus: apiStatus.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const formattedSimilarJobsData = data.similar_jobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        rating: item.rating,
        title: item.title,
      }))
      const formattedData = {
        jobDetailsCompanyLogo: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: data.job_details.life_at_company,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        skills: data.job_details.skills,
        title: data.job_details.title,
      }
      const formattedLifeAtCompany = {
        imageUrl: formattedData.lifeAtCompany.image_url,
        description: formattedData.lifeAtCompany.description,
      }
      const formattedSkills = formattedData.skills.map(item => ({
        imageUrl: item.image_url,
        name: item.name,
      }))
      formattedData.lifeAtCompany = formattedLifeAtCompany
      formattedData.skills = formattedSkills
      console.log(formattedData, formattedSimilarJobsData)
      this.setState({
        currentStatus: apiStatus.success,
        jobDetails: formattedData,
        similarJobs: formattedSimilarJobsData,
      })
    } else {
      this.setState({currentStatus: apiStatus.failure})
    }
  }

  renderLoadingView1 = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSkills = () => {
    const {jobDetails} = this.state
    const {skills} = jobDetails
    return (
      <div>
        <p>Skills</p>
        <ul>
          {skills.map(item => (
            <SkillItem key={item.name} item={item} />
          ))}
        </ul>
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state
    return (
      <ul>
        {similarJobs.map(item => (
          <SimilarJobItem key={item.id} item={item} />
        ))}
      </ul>
    )
  }

  renderSuccessView1 = () => {
    const {jobDetails} = this.state
    const {
      jobDetailsCompanyLogo,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails
    return (
      <div>
        <Navbar />
        <div>
          <h1>{title}</h1>
          <img alt="job details company logo" src={jobDetailsCompanyLogo} />
          <a href={companyWebsiteUrl}>Visit</a>
          <p>{employmentType}</p>
          <p>{jobDescription}</p>
          <p>{location}</p>
          <p>{packagePerAnnum}</p>
          <p>{rating}</p>
          {this.renderSkills()}
          <h1>Life at Company</h1>
          <p>{lifeAtCompany.description}</p>
          <img src={lifeAtCompany.imageUrl} alt="life at company" />
          <h1>Similar Jobs</h1>
          {this.renderSimilarJobs()}
        </div>
      </div>
    )
  }

  refresh = () => {
    this.getData1()
  }

  renderFailureView1 = () => (
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
        return this.renderSuccessView1()
      case apiStatus.failure:
        return this.renderFailureView1()
      case apiStatus.loading:
        return this.renderLoadingView1()
      default:
        return null
    }
  }
}
export default JobItemDetails
