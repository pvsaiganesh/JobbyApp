const SimilarJobItem = props => {
  const {item} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    title,
  } = item
  return (
    <li key={id}>
      <h1>{title}</h1>
      <img src={companyLogoUrl} alt="similar job company logo" />
      <p>{employmentType}</p>
      <h1>Description</h1>
      <p>{jobDescription}</p>
      <p>{location}</p>
      <p>{rating}</p>
    </li>
  )
}
export default SimilarJobItem
