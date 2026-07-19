import axios from "axios";
import {
    useCallback,
    useEffect,
    useState,
} from "react";

type Agent = {
    _id?: string;
    id?: string;
    agentId?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    experience?: number;
    localities?: string[];
    expertise?: string[];
    photo?: string;
    bio?: string;
    status?: string;
    certifications?: {
        name?: string;
        certificateNumber?: string;
        documentUrl?: string;
        issuedBy?: string;
    }[];
};

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";

const ProfileItem = ({
    label,
    value,
}: {
    label: string;
    value?: string;
}) => (
    <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {label}
        </p>

        <p className="mt-2 font-medium text-gray-800">
            {value || "Not provided"}
        </p>
    </div>
);

const ProfileSection = () => {
    const [agent, setAgent] =
        useState<Agent | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] = useState("");

    const fetchAgentProfile =
        useCallback(async () => {
            try {
                setIsLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    throw new Error(
                        "Please log in to view your profile",
                    );
                }

                const response = await axios.get(
                    `${API_URL}/agent`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                console.log(
                    "Agent profile response:",
                    response.data,
                );

                // Supports multiple response structures
                const agentData =
                    response.data?.data?.agent ??
                    response.data?.data ??
                    response.data?.agent ??
                    response.data;

                setAgent(agentData);

                // Keep local storage updated
                localStorage.setItem(
                    "agent",
                    JSON.stringify(agentData),
                );
            } catch (error: unknown) {
                setAgent(null);

                if (axios.isAxiosError(error)) {
                    setError(
                        error.response?.data?.message ||
                        "Unable to fetch profile",
                    );
                } else if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(
                        "Unable to fetch profile",
                    );
                }
            } finally {
                setIsLoading(false);
            }
        }, []);

    useEffect(() => {
        fetchAgentProfile();
    }, [fetchAgentProfile]);

    if (isLoading) {
        return (
            <section>
                <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading profile...
                    </p>
                </div>
            </section>
        );
    }

    if (error || !agent) {
        return (
            <section>
                <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
                    <h2 className="text-lg font-semibold text-red-700">
                        Unable to load profile
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        {error || "Agent profile not found"}
                    </p>

                    <button
                        type="button"
                        onClick={fetchAgentProfile}
                        className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Try again
                    </button>
                </div>
            </section>
        );
    }

    const statusClass =
        agent.status === "VERIFIED"
            ? "bg-green-100 text-green-700"
            : agent.status === "BLOCKED" ||
                agent.status === "REJECTED"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700";

    return (
        <section>
            <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
                    Agent dashboard
                </p>

                <h1 className="mt-1 text-3xl font-bold text-gray-900">
                    Profile
                </h1>

                <p className="mt-2 text-gray-500">
                    View and manage your agent information.
                </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 border-b border-gray-100 pb-6 sm:flex-row sm:items-center">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-red-100 text-3xl font-bold text-red-600">
                        {agent.photo ? (
                            <img
                                src={agent.photo}
                                alt={agent.name || "Agent"}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            agent.name
                                ?.charAt(0)
                                .toUpperCase() || "A"
                        )}
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {agent.name || "Agent"}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {agent.agentId || "No agent ID"}
                        </p>

                        <span
                            className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                        >
                            {agent.status || "PENDING"}
                        </span>
                    </div>
                </div>

                <div className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                    <ProfileItem
                        label="Email"
                        value={agent.email}
                    />

                    <ProfileItem
                        label="Phone"
                        value={agent.phone}
                    />

                    <ProfileItem
                        label="Address"
                        value={agent.address}
                    />

                    <ProfileItem
                        label="Experience"
                        value={
                            agent.experience !== undefined
                                ? `${agent.experience} years`
                                : undefined
                        }
                    />

                    <ProfileItem
                        label="Localities"
                        value={agent.localities?.join(", ")}
                    />

                    <ProfileItem
                        label="Expertise"
                        value={agent.expertise?.join(", ")}
                    />
                </div>

                {agent.bio && (
                    <div className="mt-6 border-t border-gray-100 pt-6">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Bio
                        </p>

                        <p className="mt-2 leading-7 text-gray-700">
                            {agent.bio}
                        </p>
                    </div>
                )}

                {agent.certifications &&
                    agent.certifications.length > 0 && (
                        <div className="mt-6 border-t border-gray-100 pt-6">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Certifications
                            </p>

                            <div className="mt-3 flex flex-wrap gap-3">
                                {agent.certifications.map(
                                    (certification, index) => (
                                        <div
                                            key={`${certification.name}-${index}`}
                                            className="rounded-xl border border-gray-200 px-4 py-3"
                                        >
                                            <p className="font-semibold text-gray-800">
                                                {certification.name}
                                            </p>

                                            {certification.issuedBy && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {
                                                        certification.issuedBy
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    )}
            </div>
        </section>
    );
};

export default ProfileSection;