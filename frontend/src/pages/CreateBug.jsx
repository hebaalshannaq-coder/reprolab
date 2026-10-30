import { Link, useNavigate, useParams } from "react-router-dom";
import BugForm from "../components/BugForm";

const CreateBug = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div>
            <Link to={`/projects/${id}`} className="text-muted">
                ← Back to project
            </Link>
            <h2 className="page-title mt-3">Report a bug</h2>
            <BugForm projectId={id} onCreated={() => navigate(`/projects/${id}`)} />
        </div>
    );
};

export default CreateBug;