import {Link} from 'react-router-dom'

const JobItem = props => {
  const {item} = props
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
        <h1>Description</h1>
        <p>{jobDescription}</p>
        <p>{employmentType}</p>
        <img alt="company logo" src={companyLogoUrl} />
      </li>
    </Link>
  )
}
export default JobItem
