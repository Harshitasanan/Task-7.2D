import React from 'react'
import {Menu, Container, Button, Image} from 'semantic-ui-react'
import {useNavigate, Link} from 'react-router-dom';
import logo from "../asset/color.svg";

const NavBar = () => {
    const navigate = useNavigate();
    const linkStyle = {
        textDecoration: 'none', // Remove text decoration
        color: 'white', // Set link color to white
        margin: '20px',

      };
  return (
    <Menu inverted borderless style={{padding: "0.3rem", marginBottom: "20px"}} attached>
        <Container>
            <Menu.Item name='home'>
                <Link to="/">
                    <Image size="mini" src={logo} alt="logo"/>
                </Link>
            </Menu.Item>
            <Menu.Item>
            <div className="navbar">
        
        <div className="hiddenLinks">
          <Link to="/" style={linkStyle}> Home </Link>
          <Link to="/menu" style={linkStyle}> Menu </Link>
          <Link to="/about" style={linkStyle}> About </Link>
          <Link to="/contact" style={linkStyle}> Contact </Link>
          <Link to="/signup" style={linkStyle}>Sign Up</Link>
        </div>
      </div>
            </Menu.Item>
            <Menu.Item position="right">
                <Button size='mini' primary onClick={() => navigate("/add")}>Add User</Button>
            </Menu.Item>
        </Container>
    </Menu>
  )
}

export default NavBar
