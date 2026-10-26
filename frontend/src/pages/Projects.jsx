import { useAuth } from "../context/AuthContext";

const Projects = () => {
    const { user } = useAuth();

    return (
        <div>
            <h2>Projects</h2>
            <p>Welcome {user.name}! (we will build this page next)</p>
        </div>
    );
};

export default Projects;