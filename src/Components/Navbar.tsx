import {
    Link,
    NavLink,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";
import AuthModal from "./AuthModal";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isAuthModalOpen, setIsAuthModalOpen] =
        useState(false);

    useEffect(() => {
        const routeState = location.state as {
            openLogin?: boolean;
        } | null;

        const hasToken = Boolean(
            localStorage.getItem("token"),
        );

        if (routeState?.openLogin && !hasToken) {
            console.log('not found');

            setIsAuthModalOpen(true);
        }

        if (routeState?.openLogin) {
            // Remove openLogin so it doesn't reopen
            navigate(location.pathname, {
                replace: true,
                state: {},
            });
        }
    }, [
        location.pathname,
        location.state,
        navigate,
    ]);

    const [isAuthenticated, setIsAuthenticated] =
        useState(
            Boolean(localStorage.getItem("token")),
        );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsAuthenticated(false);
        navigate("/home");
    };

    const getLinkClass = ({
        isActive,
    }: {
        isActive: boolean;
    }) =>
        `text-sm font-medium transition ${isActive
            ? "text-red-600"
            : "text-gray-600 hover:text-red-600"
        }`;

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
                    <Link
                        to="/home"
                        className="text-2xl font-bold text-red-600"
                    >
                        Propertist
                    </Link>

                    <div className="flex items-center gap-4 sm:gap-7">
                        <NavLink
                            to="/home"
                            className={getLinkClass}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/dashboard"
                            className={getLinkClass}
                        >
                            Agent Dashboard
                        </NavLink>

                        <NavLink
                            to="/about"
                            className={getLinkClass}
                        >
                            About
                        </NavLink>

                        {/* <NavLink
                            to="/contact"
                            className={getLinkClass}
                        >
                            Contact Us
                        </NavLink> */}

                        {isAuthenticated ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-full border border-red-600 px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() =>
                                    setIsAuthModalOpen(true)
                                }
                                className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </nav>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLoginSuccess={() => setIsAuthenticated(true)}
            />
        </>
    );
};

export default Navbar;