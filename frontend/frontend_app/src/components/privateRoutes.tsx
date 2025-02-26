import { userStore } from "@/store/storeInstances";
import { observer } from "mobx-react-lite";
import { JSX } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = observer(({ children }) => {
    if(!userStore.token){
        return <Navigate to="/" replace />
    }

    return children
});

export default PrivateRoute;