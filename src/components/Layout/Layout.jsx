import NavBar from "../common/NavBar"
import {Outlet as Page} from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <div>
        <NavBar/>
        <Page/>
      </div>
    </div>
  )
}

export default Layout
