import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
// Authentication Pages
import Login from 'pages/Authentication/Login/Login';
import Register from 'pages/Authentication/Register/Register';
import RequireAuth from 'RequireAuth';
import routes from 'routes';

const App = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		document.documentElement.scrollTop = 0;
		document.scrollingElement.scrollTop = 0;
	}, [pathname]);

	const getRoutes = (routes) =>
		routes.map((route) => {
			if (route.collapse) {
				return getRoutes(route.collapse);
			}

			if (route.route) {
				return (
					<Route
						exact
						path={route.route}
						element={
							<RequireAuth routes={routes}>{route.component}</RequireAuth>
						}
						key={route.key}
					/>
				);
			}

			return null;
		});

	return (
		<>
			<Routes>
				<Route path="/" element={<Navigate to="/login" />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				{getRoutes(routes)}
			</Routes>
		</>
	);
};

export default App;
