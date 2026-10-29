import { useState } from "react";
import StatsOverview from "../components/StatsOverview";
import UsersManager from "../components/UsersManager";

const AdminPanel = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshStats = () => setRefreshKey((key) => key + 1);

    return (
        <div>
            <h2>Admin Panel</h2>

            <h3>Overview</h3>
            <StatsOverview refreshKey={refreshKey} />

            <hr />

            <h3>Users</h3>
            <UsersManager onChanged={refreshStats} />
        </div>
    );
};

export default AdminPanel;