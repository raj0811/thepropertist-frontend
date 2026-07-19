import axios from "axios";
import {
    useEffect,
    useState,
    type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type AuthMode = "login" | "signup";

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
};

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";

const AuthModal = ({
    isOpen,
    onClose,
    onLoginSuccess,
}: AuthModalProps) => {
    const navigate = useNavigate();

    const [mode, setMode] =
        useState<AuthMode>("login");

    const [isLoading, setIsLoading] =
        useState(false);

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });

    const [signupForm, setSignupForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        localities: "",
        experience: "",
        password: "",
        expertise: "",
    });

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener(
                "keydown",
                handleEscape,
            );
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleLogin = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        try {
            setIsLoading(true);

            const response = await axios.post(
                `${API_URL}/agent/login`,
                {
                    email: loginForm.email.trim().toLowerCase(),
                    password: loginForm.password,
                },
            );

            console.log("Login response:", response.data);

            const token =
                response.data?.token ||
                response.data?.accessToken ||
                response.data?.data?.token ||
                response.data?.data?.accessToken;

            if (!token) {
                toast.error("Token was not returned by API");
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("accountType", "AGENT");

            const agent =
                response.data?.agent ||
                response.data?.data?.agent;

            if (agent) {
                localStorage.setItem(
                    "agent",
                    JSON.stringify(agent),
                );
            }

            onLoginSuccess();
            onClose();

            toast.success("Login successful");

            navigate("/dashboard", {
                replace: true,
            });
        } catch (error: unknown) {
            console.error("Login error:", error);

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ||
                    "Invalid email or password",
                );
            } else {
                toast.error("Login failed");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        try {
            setIsLoading(true);

            await axios.post(
                `${API_URL}/agent/register`,
                {
                    name: signupForm.name.trim(),
                    email: signupForm.email
                        .trim()
                        .toLowerCase(),
                    phone: signupForm.phone.trim(),
                    address: signupForm.address.trim(),

                    localities: signupForm.localities
                        .split(",")
                        .map((value) => value.trim())
                        .filter(Boolean),

                    experience: Number(
                        signupForm.experience,
                    ),

                    password: signupForm.password,

                    expertise: signupForm.expertise
                        .split(",")
                        .map((value) =>
                            value.trim().toUpperCase(),
                        )
                        .filter(Boolean),
                },
            );

            toast.success(
                "Registration successful. Please log in.",
            );

            // Prefill login email after registration
            setLoginForm({
                email: signupForm.email,
                password: "",
            });

            setMode("login");

            setSignupForm({
                name: "",
                email: "",
                phone: "",
                address: "",
                localities: "",
                experience: "",
                password: "",
                expertise: "",
            });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message;

                toast.error(
                    Array.isArray(message)
                        ? message[0]
                        : message || "Registration failed",
                );
            } else {
                toast.error("Registration failed");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100";

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-100"
                >
                    ×
                </button>

                <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
                    Propertist Agent
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                    {mode === "login"
                        ? "Agent login"
                        : "Create agent account"}
                </h2>

                <div className="my-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
                    <button
                        type="button"
                        onClick={() => setMode("login")}
                        className={`rounded-lg py-2.5 font-semibold ${mode === "login"
                            ? "bg-white text-red-600 shadow-sm"
                            : "text-gray-500"
                            }`}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className={`rounded-lg py-2.5 font-semibold ${mode === "signup"
                            ? "bg-white text-red-600 shadow-sm"
                            : "text-gray-500"
                            }`}
                    >
                        Sign up
                    </button>
                </div>

                {mode === "login" ? (
                    <form
                        onSubmit={handleLogin}
                        className="space-y-4"
                    >
                        <input
                            type="email"
                            required
                            placeholder="Email address"
                            value={loginForm.email}
                            onChange={(event) =>
                                setLoginForm((current) => ({
                                    ...current,
                                    email: event.target.value,
                                }))
                            }
                            className={inputClass}
                        />

                        <input
                            type="password"
                            required
                            placeholder="Password"
                            value={loginForm.password}
                            onChange={(event) =>
                                setLoginForm((current) => ({
                                    ...current,
                                    password: event.target.value,
                                }))
                            }
                            className={inputClass}
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading
                                ? "Logging in..."
                                : "Login"}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Don&apos;t have an account?{" "}
                            <button
                                type="button"
                                onClick={() =>
                                    setMode("signup")
                                }
                                className="font-semibold text-red-600"
                            >
                                Sign up
                            </button>
                        </p>
                    </form>
                ) : (
                    <form
                        onSubmit={handleSignup}
                        className="grid gap-4 sm:grid-cols-2"
                    >
                        <input
                            required
                            placeholder="Full name"
                            value={signupForm.name}
                            onChange={(event) =>
                                setSignupForm((current) => ({
                                    ...current,
                                    name: event.target.value,
                                }))
                            }
                            className={inputClass}
                        />

                        <input
                            type="email"
                            required
                            placeholder="Email address"
                            value={signupForm.email}
                            onChange={(event) =>
                                setSignupForm((current) => ({
                                    ...current,
                                    email: event.target.value,
                                }))
                            }
                            className={inputClass}
                        />

                        <input
                            type="tel"
                            required
                            placeholder="Phone number"
                            value={signupForm.phone}
                            onChange={(event) =>
                                setSignupForm((current) => ({
                                    ...current,
                                    phone: event.target.value,
                                }))
                            }
                            className={inputClass}
                        />

                        <input
                            type="number"
                            required
                            min="0"
                            max="70"
                            placeholder="Experience in years"
                            value={signupForm.experience}
                            onChange={(event) =>
                                setSignupForm((current) => ({
                                    ...current,
                                    experience: event.target.value,
                                }))
                            }
                            className={inputClass}
                        />

                        <input
                            required
                            placeholder="Address"
                            value={signupForm.address}
                            onChange={(event) =>
                                setSignupForm((current) => ({
                                    ...current,
                                    address: event.target.value,
                                }))
                            }
                            className={`${inputClass} sm:col-span-2`}
                        />

                        <input
                            required
                            placeholder="Localities: Chembur, Kurla, BKC"
                            value={signupForm.localities}
                            onChange={(event) =>
                                setSignupForm((current) => ({
                                    ...current,
                                    localities:
                                        event.target.value,
                                }))
                            }
                            className={`${inputClass} sm:col-span-2`}
                        />

                        <input
                            placeholder="Expertise: RENT, PG, SELL"
                            value={signupForm.expertise}
                            onChange={(event) =>
                                setSignupForm((current) => ({
                                    ...current,
                                    expertise:
                                        event.target.value,
                                }))
                            }
                            className={`${inputClass} sm:col-span-2`}
                        />

                        <input
                            type="password"
                            required
                            minLength={6}
                            placeholder="Password"
                            value={signupForm.password}
                            onChange={(event) =>
                                setSignupForm((current) => ({
                                    ...current,
                                    password: event.target.value,
                                }))
                            }
                            className={`${inputClass} sm:col-span-2`}
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60 sm:col-span-2"
                        >
                            {isLoading
                                ? "Creating account..."
                                : "Create account"}
                        </button>

                        <p className="text-center text-sm text-gray-500 sm:col-span-2">
                            Already registered?{" "}
                            <button
                                type="button"
                                onClick={() =>
                                    setMode("login")
                                }
                                className="font-semibold text-red-600"
                            >
                                Login
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthModal;