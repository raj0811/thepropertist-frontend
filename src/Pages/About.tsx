import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";

const About = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Navbar />

            <main>
                {/* Hero */}
                <section className="border-b border-red-100 bg-red-50">
                    <div className="mx-auto max-w-7xl px-5 py-20 text-center sm:py-28">
                        <p className="text-sm font-semibold uppercase tracking-widest text-red-600">
                            About Propertist
                        </p>

                        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
                            Making property discovery simpler
                            and more reliable
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
                            Propertist connects home seekers
                            with trusted property agents,
                            helping people discover the right
                            home without unnecessary
                            complexity.
                        </p>
                    </div>
                </section>

                {/* Introduction */}
                <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
                            Who we are
                        </p>

                        <h2 className="mt-3 text-3xl font-bold leading-tight">
                            A better way to connect agents
                            and home seekers
                        </h2>

                        <p className="mt-5 leading-7 text-gray-600">
                            Searching for a property can be
                            overwhelming. Propertist brings
                            listings, property details and
                            enquiries together in one simple
                            platform.
                        </p>

                        <p className="mt-4 leading-7 text-gray-600">
                            Agents can showcase and manage
                            their properties, while home
                            seekers can browse available
                            listings and directly submit an
                            enquiry for the properties they
                            like.
                        </p>

                        <Link
                            to="/home"
                            className="mt-7 inline-flex rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
                        >
                            Browse properties
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-3xl">
                        <img
                            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"
                            alt="Modern property interior"
                            className="h-[420px] w-full object-cover"
                        />
                    </div>
                </section>

                {/* Values */}
                <section className="bg-gray-50">
                    <div className="mx-auto max-w-7xl px-5 py-16">
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
                                What matters to us
                            </p>

                            <h2 className="mt-3 text-3xl font-bold">
                                Property search made for real
                                people
                            </h2>
                        </div>

                        <div className="mt-10 grid gap-6 md:grid-cols-3">
                            <ValueCard
                                number="01"
                                title="Simple discovery"
                                description="Search and filter listings by location, configuration and price without unnecessary steps."
                            />

                            <ValueCard
                                number="02"
                                title="Clear information"
                                description="View important property details, images, pricing and agent information in one place."
                            />

                            <ValueCard
                                number="03"
                                title="Direct connection"
                                description="Submit an enquiry directly to the agent responsible for the property."
                            />
                        </div>
                    </div>
                </section>

                {/* Agents */}
                <section className="mx-auto max-w-7xl px-5 py-16">
                    <div className="rounded-3xl bg-red-600 px-6 py-12 text-center text-white sm:px-12">
                        <p className="text-sm font-semibold uppercase tracking-widest text-red-100">
                            For property agents
                        </p>

                        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold">
                            Showcase your properties and
                            manage enquiries from one
                            dashboard
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl leading-7 text-red-100">
                            Create your agent account, publish
                            property listings and connect with
                            interested home seekers.
                        </p>

                        <Link
                            to="/login"
                            className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                        >
                            Join as an agent
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-gray-200">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-7 text-sm text-gray-500 sm:flex-row sm:justify-between">
                    <p>
                        © 2026 Propertist. All rights reserved.
                    </p>

                    <p>Find a place you’ll love.</p>
                </div>
            </footer>
        </div>
    );
};

const ValueCard = ({
    number,
    title,
    description,
}: {
    number: string;
    title: string;
    description: string;
}) => (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 font-bold text-red-600">
            {number}
        </div>

        <h3 className="mt-5 text-xl font-bold text-gray-900">
            {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-600">
            {description}
        </p>
    </article>
);

export default About;