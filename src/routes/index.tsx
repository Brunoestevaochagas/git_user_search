import { ElementType, lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { Loading } from "../component/loading";
import Layout from "../layout";

const Loadable = (Component: ElementType) => () => {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { element: <Navigate to="users" replace />, index: true },
        { path: "users", element: <Users /> },
        { path: "user/:id", element: <UserProfile /> },
      ],
    },
  ]);
}

const Users = Loadable(lazy(() => import("../pages/users/list")));
const UserProfile = Loadable(lazy(() => import("../pages/users/profile")));
