const Navbar = ({logout}) => {
  return (
   <div className='navbar'>
        <h1>Task Manager</h1>
        <button onClick={logout}>Logout</button>
      </div>
  )
}

export default Navbar