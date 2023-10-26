import Header from '../components/layouts/Header';

const BaseLayout = ({ children, currentUser }) => {
  return (
    <div className="container">
      <Header currentUser={currentUser} />
      {children}
    </div>
  )
}

export default BaseLayout