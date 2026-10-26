import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav>
            <Link to="/">ReproLab</Link>

            {user ? (
                <>
                    <Link to="/">Projects</Link>
                    {user.role === "admin" && <Link to="/admin">Admin</Link>}
                    <span>Hi, {user.name}</span>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;