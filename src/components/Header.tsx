import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logoReact from '../assets/react.svg'
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';

const Header = () => {
    const { logout, user } = useContext(UserContext)

    //const [hideHeader, setHideHeader] = useState(false);

    // useEffect(() => {
    //     if (window.location.pathname == '/login') {
    //         setHideHeader(true);
    //     }
    // }, [])

    const handleLogout = () => {
        logout();
        toast.success("Log out successfully");
    }

    return (<>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">
                    <img src={logoReact}
                        width="30" height="30"
                        className='d-inline-block align-top'
                        alt='React Bootstrap logo'
                    /><span> React-Application</span></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {(user && user.auth || window.location.pathname === '/')&& 
                        <>
                            <Nav className="me-auto" activeKey={location.pathname}>
                                <NavLink className='nav-link' to='/'>Home</NavLink>
                                <NavLink className='nav-link' to='/users'>Manage Users</NavLink>
                            </Nav>
                            <Nav>
                                {user && user.email && <span className='nav-link'>Welcome {user.email}</span>}
                                <NavDropdown title="Setting" id="basic-nav-dropdown">
                                    {user && user.auth
                                        ? <Nav.Link onClick={() => handleLogout()} className='nav-link dropdown-item bg-white' href='/'>Logout</Nav.Link>
                                        : <Nav.Link className='nav-link dropdown-item bg-white' href='/login'>Login</Nav.Link>
                                    }
                                </NavDropdown>
                            </Nav>
                        </>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>) 
}

export default Header