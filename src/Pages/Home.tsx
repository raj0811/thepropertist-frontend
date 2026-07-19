import axios from "axios";
import {
    useCallback,
    useEffect,
    useState,
    type FormEvent,
} from "react";
import Navbar from "../Components/Navbar";
import EnquiryModal from "../Components/EnquiryModal";
import { useNavigate } from "react-router-dom";

type Property = {
    _id: string;
    propertyId?: string;
    name: string;
    city: string;

    address: {
        address: string;
        city: string;
        state: string;
        pincode: string;
    };

    listingType: "RENT" | "SELL" | "LEASE";
    carpetArea: number;
    carpetAreaUnit: "SQ_FT" | "SQ_METER";
    configuration: string;
    benefits: string[];
    description: string;
    images: string[];
    estimatedPrice: number;
    currency: string;
    negotiable: boolean;
    propertyAgeType: string;
    propertyAgeInYears?: number;
    status: string;
};

type Pagination = {
    page: number;
    limit: number;
    totalProperties: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

type Filters = {
    location: string;
    bhk: string;
    minPrice: string;
    maxPrice: string;
    status: string;
    listingType: string;
};

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";

const initialFilters: Filters = {
    location: "",
    bhk: "",
    minPrice: "",
    maxPrice: "",
    status: "AVAILABLE",
    listingType: "",
};

const Home = () => {
    const [properties, setProperties] = useState<
        Property[]
    >([]);
    const navigate = useNavigate();
    const [
        selectedProperty,
        setSelectedProperty,
    ] = useState<Property | null>(null);

    const [
        isGeneralEnquiryOpen,
        setIsGeneralEnquiryOpen,
    ] = useState(false);

    // Values currently visible in the form
    const [filters, setFilters] =
        useState<Filters>(initialFilters);

    // Values applied to the API
    const [appliedFilters, setAppliedFilters] =
        useState<Filters>(initialFilters);

    const [pagination, setPagination] =
        useState<Pagination>({
            page: 1,
            limit: 9,
            totalProperties: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
        });

    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] =
        useState(true);
    const [error, setError] = useState("");

    const fetchProperties = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/properties/all-properties`,
                {
                    params: {
                        page,
                        limit: 9,

                        location:
                            appliedFilters.location ||
                            undefined,

                        bhk:
                            appliedFilters.bhk ||
                            undefined,

                        minPrice:
                            appliedFilters.minPrice ||
                            undefined,

                        maxPrice:
                            appliedFilters.maxPrice ||
                            undefined,

                        status:
                            appliedFilters.status ||
                            undefined,

                        listingType:
                            appliedFilters.listingType ||
                            undefined,
                    },
                },
            );

            setProperties(response.data?.data ?? []);

            setPagination(
                response.data?.pagination ?? {
                    page,
                    limit: 9,
                    totalProperties: 0,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false,
                },
            );
        } catch (error: unknown) {
            setProperties([]);

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                    "Unable to fetch properties",
                );
            } else {
                setError("Unable to fetch properties");
            }
        } finally {
            setIsLoading(false);
        }
    }, [page, appliedFilters]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const updateFilter = (
        field: keyof Filters,
        value: string,
    ) => {
        setFilters((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleApplyFilters = (
        event?: FormEvent,
    ) => {
        event?.preventDefault();

        if (
            filters.minPrice &&
            filters.maxPrice &&
            Number(filters.minPrice) >
            Number(filters.maxPrice)
        ) {
            setError(
                "Minimum price cannot be greater than maximum price",
            );
            return;
        }

        setError("");
        setPage(1);
        setAppliedFilters({ ...filters });
    };

    const handleResetFilters = () => {
        setFilters(initialFilters);
        setAppliedFilters(initialFilters);
        setPage(1);
        setError("");
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getPageNumbers = () => {
        const pages: number[] = [];
        const total = pagination.totalPages;

        if (total <= 5) {
            for (let current = 1; current <= total; current++) {
                pages.push(current);
            }

            return pages;
        }

        const start = Math.max(
            1,
            Math.min(page - 2, total - 4),
        );

        for (
            let current = start;
            current < start + 5;
            current++
        ) {
            pages.push(current);
        }

        return pages;
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Navbar />

            <main>
                <section
                    className="relative bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/60" />

                    <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 text-center sm:py-28">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-red-400">
                            Find your next home
                        </p>

                        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
                            Discover properties that feel right for you
                        </h1>

                        <p className="mx-auto mt-4 max-w-xl text-gray-200">
                            Browse apartments, villas and homes in
                            your preferred location.
                        </p>

                        <form
                            onSubmit={handleApplyFilters}
                            className="mx-auto mt-8 flex max-w-3xl flex-col gap-2 rounded-2xl border border-white/30 bg-white/20 p-2 shadow-lg backdrop-blur-md sm:flex-row sm:rounded-full"
                        >
                            <input
                                type="text"
                                placeholder="Search city, area or pincode"
                                value={filters.location}
                                onChange={(event) =>
                                    updateFilter(
                                        "location",
                                        event.target.value,
                                    )
                                }
                                className="min-w-0 flex-1 rounded-full border border-white/30 bg-white/20 px-6 py-3 text-white outline-none placeholder:text-white/75 focus:border-white"
                            />

                            <select
                                value={filters.listingType}
                                onChange={(event) =>
                                    updateFilter(
                                        "listingType",
                                        event.target.value,
                                    )
                                }
                                className="rounded-full border border-white/30 bg-white/20 px-6 py-3 text-white outline-none"
                            >
                                <option
                                    className="text-gray-900"
                                    value=""
                                >
                                    All listing types
                                </option>

                                <option
                                    className="text-gray-900"
                                    value="SELL"
                                >
                                    Buy
                                </option>

                                <option
                                    className="text-gray-900"
                                    value="RENT"
                                >
                                    Rent
                                </option>

                                <option
                                    className="text-gray-900"
                                    value="LEASE"
                                >
                                    Lease
                                </option>
                            </select>

                            <button
                                type="submit"
                                className="rounded-full bg-red-600 px-7 py-3 font-semibold text-white hover:bg-red-700"
                            >
                                Search
                            </button>
                        </form>

                        <button
                            type="button"
                            onClick={() =>
                                setIsGeneralEnquiryOpen(true)
                            }
                            className="mt-12 rounded-full bg-red-600 px-6 py-3 font-semibold text-white"
                        >
                            Rise Enquiry
                        </button>
                    </div>
                </section>

                <section className="border-b border-gray-200 bg-gray-50">
                    <div className="mx-auto max-w-7xl px-5 py-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                                    BHK
                                </label>

                                <select
                                    value={filters.bhk}
                                    onChange={(event) =>
                                        updateFilter(
                                            "bhk",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-red-500"
                                >
                                    <option value="">All BHK</option>
                                    <option value="1">1 BHK</option>
                                    <option value="2">2 BHK</option>
                                    <option value="3">3 BHK</option>
                                    <option value="4">4 BHK</option>
                                    <option value="5">5 BHK</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                                    Minimum price
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    placeholder="₹ Min"
                                    value={filters.minPrice}
                                    onChange={(event) =>
                                        updateFilter(
                                            "minPrice",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                                    Maximum price
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    placeholder="₹ Max"
                                    value={filters.maxPrice}
                                    onChange={(event) =>
                                        updateFilter(
                                            "maxPrice",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                                    Status
                                </label>

                                <select
                                    value={filters.status}
                                    onChange={(event) =>
                                        updateFilter(
                                            "status",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-red-500"
                                >
                                    <option value="AVAILABLE">
                                        Available
                                    </option>

                                    <option value="SOLD">
                                        Sold
                                    </option>

                                    <option value="RENTED">
                                        Rented
                                    </option>

                                    <option value="INACTIVE">
                                        Inactive
                                    </option>
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    handleApplyFilters()
                                }
                                className="self-end rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700"
                            >
                                Apply filters
                            </button>

                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="self-end rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-100"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </section>

                <section
                    id="properties"
                    className="mx-auto max-w-7xl px-5 py-12 sm:py-16"
                >
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold sm:text-3xl">
                            Listed properties
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            {pagination.totalProperties} properties
                            found
                        </p>
                    </div>

                    {isLoading && (
                        <div className="py-20 text-center">
                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />

                            <p className="mt-4 text-gray-500">
                                Loading properties...
                            </p>
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 py-14 text-center">
                            <h3 className="font-semibold text-red-700">
                                Unable to load properties
                            </h3>

                            <p className="mt-2 text-sm text-red-600">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={fetchProperties}
                                className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {!isLoading &&
                        !error &&
                        properties.length === 0 && (
                            <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
                                <h3 className="text-lg font-semibold">
                                    No properties found
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    Try changing your search or
                                    filters.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="mt-5 font-semibold text-red-600"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}

                    {!isLoading &&
                        !error &&
                        properties.length > 0 && (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {properties.map((property) => (
                                        <article
                                            key={property._id}
                                            className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
                                        >
                                            <div className="relative h-56 bg-gray-100">
                                                {property.images?.[0] ? (
                                                    <img
                                                        src={property.images[0]}
                                                        alt={property.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-gray-400">
                                                        No image available
                                                    </div>
                                                )}

                                                <span className="absolute left-4 top-4 rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                                                    {property.listingType}
                                                </span>

                                                <span className="absolute right-4 top-4 rounded-md bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700">
                                                    {property.status}
                                                </span>
                                            </div>

                                            <div className="p-5">
                                                <p className="text-xl font-bold text-red-600">
                                                    {formatPrice(
                                                        property.estimatedPrice,
                                                    )}
                                                </p>

                                                <h3 className="mt-2 text-lg font-semibold">
                                                    {property.name}
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {property.address.address},{" "}
                                                    {property.address.city}
                                                </p>

                                                <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                                                    <span className="rounded-full bg-gray-100 px-3 py-1">
                                                        {property.configuration}
                                                    </span>

                                                    <span className="rounded-full bg-gray-100 px-3 py-1">
                                                        {property.carpetArea}{" "}
                                                        {property.carpetAreaUnit ===
                                                            "SQ_FT"
                                                            ? "sq. ft."
                                                            : "sq. m."}
                                                    </span>

                                                    {property.negotiable && (
                                                        <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                                                            Negotiable
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(`/properties/${property._id}`)
                                                    }
                                                    className="mt-5 w-full rounded-md border border-red-600 px-4 py-2.5 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                                                >
                                                    View details
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {pagination.totalPages > 1 && (
                                    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            disabled={
                                                !pagination.hasPreviousPage
                                            }
                                            onClick={() =>
                                                setPage((current) =>
                                                    Math.max(
                                                        current - 1,
                                                        1,
                                                    ),
                                                )
                                            }
                                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Previous
                                        </button>

                                        {getPageNumbers().map(
                                            (pageNumber) => (
                                                <button
                                                    key={pageNumber}
                                                    type="button"
                                                    onClick={() =>
                                                        setPage(pageNumber)
                                                    }
                                                    className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold ${page === pageNumber
                                                        ? "bg-red-600 text-white"
                                                        : "border border-gray-200 text-gray-700 hover:border-red-300"
                                                        }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            ),
                                        )}

                                        <button
                                            type="button"
                                            disabled={
                                                !pagination.hasNextPage
                                            }
                                            onClick={() =>
                                                setPage(
                                                    (current) =>
                                                        current + 1,
                                                )
                                            }
                                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                </section>
            </main>
            <EnquiryModal
                isOpen={isGeneralEnquiryOpen}
                onClose={() =>
                    setIsGeneralEnquiryOpen(false)
                }
            />

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

export default Home;