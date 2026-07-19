import { useState } from "react";
import Navbar from "../Components/Navbar";
import PropertiesSection from "../Components/Properties";
import ProfileSection from "../Components/ProfileSection";
import EnquiriesSection from "../Components/Enquiries";

type DashboardTab =
    | "profile"
    | "properties"
    | "enquiries";

type Agent = {
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
};

const getStoredAgent = (): Agent => {
    try {
        const storedAgent =
            localStorage.getItem("agent");

        return storedAgent
            ? JSON.parse(storedAgent)
            : {};
    } catch {
        return {};
    }
};

const Dashboard = () => {
    const [activeTab, setActiveTab] =
        useState<DashboardTab>("profile");

    const [isSidebarOpen, setIsSidebarOpen] =
        useState(true);

    const agent = getStoredAgent();

    const sidebarItems: {
        id: DashboardTab;
        label: string;
        shortLabel: string;
    }[] = [
            {
                id: "profile",
                label: "Profile",
                shortLabel: "P",
            },
            {
                id: "properties",
                label: "Properties",
                shortLabel: "PR",
            },
            {
                id: "enquiries",
                label: "Enquiries",
                shortLabel: "E",
            },
        ];

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileSection />;

            case "properties":
                return <PropertiesSection />;

            case "enquiries":
                return <EnquiriesSection />;

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="flex">
                <aside
                    className={`relative min-h-[calc(100vh-73px)] flex-shrink-0 border-r border-gray-200 bg-white transition-all duration-300 ${isSidebarOpen
                        ? "w-64"
                        : "w-20"
                        }`}
                >
                    <button
                        type="button"
                        onClick={() =>
                            setIsSidebarOpen((current) => !current)
                        }
                        aria-label={
                            isSidebarOpen
                                ? "Collapse sidebar"
                                : "Expand sidebar"
                        }
                        className="absolute -right-4 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-lg font-bold text-red-600 shadow-sm transition hover:bg-red-50"
                    >
                        {isSidebarOpen ? "‹" : "›"}
                    </button>

                    <div className="border-b border-gray-100 p-5">
                        <div
                            className={`flex items-center ${isSidebarOpen
                                ? "gap-3"
                                : "justify-center"
                                }`}
                        >
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-red-100 font-bold text-red-600">
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

                            {isSidebarOpen && (
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-gray-900">
                                        {agent.name || "Agent"}
                                    </p>

                                    <p className="truncate text-xs text-gray-500">
                                        {agent.agentId || "Agent account"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <nav className="space-y-2 p-3">
                        {sidebarItems.map((item) => {
                            const isActive =
                                activeTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    title={
                                        isSidebarOpen
                                            ? undefined
                                            : item.label
                                    }
                                    onClick={() =>
                                        setActiveTab(item.id)
                                    }
                                    className={`flex w-full items-center rounded-xl py-3 transition ${isSidebarOpen
                                        ? "gap-3 px-4"
                                        : "justify-center px-2"
                                        } ${isActive
                                            ? "bg-red-600 text-white"
                                            : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                                        }`}
                                >
                                    <span
                                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isActive
                                            ? "bg-white/20"
                                            : "bg-gray-100"
                                            }`}
                                    >
                                        {item.shortLabel}
                                    </span>

                                    {isSidebarOpen && (
                                        <span className="text-sm font-semibold">
                                            {item.label}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                <main className="min-w-0 flex-1 p-5 sm:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};






export default Dashboard;