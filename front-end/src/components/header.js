import { Auth } from "aws-amplify";

function Header(props) {

  const logout = () => {
    Auth.signOut().then(() => window.location.href = '/login')
  }

  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light p-3">
      <a class="navbar-brand" href="#">Finspiration</a>
      <div class="collapse navbar-collapse" style={{ flexDirection: 'row-reverse' }} id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <a class="nav-link" href="/visualization">Visulization</a>
          </li>
          <li class="nav-item active">
            <a class="nav-link" href="/home">Home</a>
          </li>
          <li onClick={logout} class="nav-item">
            <a class="nav-link" href="#">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Header;