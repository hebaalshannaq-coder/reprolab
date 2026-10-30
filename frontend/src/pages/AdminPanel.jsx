import { useState } from "react";
import { Card } from "react-bootstrap";
import StatsOverview from "../components/StatsOverview";
import UsersManager from "../components/UsersManager";

const AdminPanel = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const refreshStats = () => setRefreshKey((key) => key + 1);

    return (
        <div>
            <div className="mb-4">
                <h2 className="page-title mb-1">Admin Panel</h2>
                <p className="text-muted mb-0">System overview and user management</p>
            </div>

            <StatsOverview refreshKey={refreshKey} />

            <h5 className="mt-4 mb-3">Users</h5>
            <Card className="p-3">
                <UsersManager onChanged={refreshStats} />
            </Card>
        </div>
    );
};

export default AdminPanel;