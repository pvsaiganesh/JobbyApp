const SkillItem = props => {
  const {item} = props
  return (
    <li>
      <img alt={item.name} src={item.imageUrl} />
      <p>{item.name}</p>
    </li>
  )
}
export default SkillItem
