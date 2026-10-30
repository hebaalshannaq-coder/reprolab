import { Link, useNavigate } from "react-router-dom";
import { Navbar as BsNavbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <BsNavbar expand="md" className="app-navbar mb-4">
            <Container>
                <BsNavbar.Brand as={Link} to="/" className="brand">
                    🧪 Repro<span>Lab</span>
                </BsNavbar.Brand>
                <BsNavbar.Toggle aria-controls="main-nav" />
                <BsNavbar.Collapse id="main-nav">
                    <Nav className="me-auto">
                        {user && (
                            <Nav.Link as={Link} to="/">
                                Projects
                            </Nav.Link>
                        )}
                        {user?.role === "admin" && (
                            <Nav.Link as={Link} to="/admin">
                                Admin
                            </Nav.Link>
                        )}
                    </Nav>
                    <Nav className="align-items-md-center gap-2">
                        {user ? (
                            <>
                                <span className="text-muted">Hi, {user.name}</span>
                                <Button variant="outline-primary" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">
                                    Login
                                </Nav.Link>
                                <Button as={Link} to="/register" size="sm">
                                    Register
                                </Button>
                            </>
                        )}
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    );
};

export default Navbar;