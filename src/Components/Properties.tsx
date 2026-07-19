import axios from "axios";
import {
    useCallback,
    useEffect,
    useState,
} from "react";
import EditPropertyModal, {
    type EditableProperty,
} from "./EditPropertyModal";
import AddPropertyModal from "./AddPropertyModal";
import DeletePropertyModal from "./DeletePropertyModal";
import { useNavigate } from "react-router-dom";

type PropertyAddress = {
    address: string;
    city: string;
    state: string;
    pincode: string;
    propertyId?: string;
};

type Property = {
    _id: string;
    propertyId?: string;
    name: string;
    city: string;
    address: PropertyAddress;
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

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";

const PropertiesSection = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState<
        Property[]
    >([]);

    const [
        isAddPropertyModalOpen,
        setIsAddPropertyModalOpen,
    ] = useState(false);

    const [
        editingProperty,
        setEditingProperty,
    ] = useState<EditableProperty | any>(null);

    const [
        deletingProperty,
        setDeletingProperty,
    ] = useState<Property | null>(null);

    const [pagination, setPagination] =
        useState<Pagination>({
            page: 1,
            limit: 10,
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

            const token =
                localStorage.getItem("token");

            if (!token) {
                throw new Error(
                    "Please log in to view your properties",
                );
            }

            const response = await axios.get(
                `${API_URL}/properties/agent-properties`,
                {
                    params: {
                        page,
                        limit: 10,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            setProperties(response.data?.data ?? []);

            setPagination(
                response.data?.pagination ?? {
                    page,
                    limit: 10,
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
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Unable to fetch properties");
            }
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <section>
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
                        Listings
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-gray-900">
                        My Properties
                    </h1>

                    <p className="mt-2 text-gray-500">
                        {pagination.totalProperties > 0
                            ? `${pagination.totalProperties} properties listed by you`
                            : "Manage all properties listed by you."}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setIsAddPropertyModalOpen(true)
                    }
                    className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
                >
                    + Add Property
                </button>
            </div>

            {isLoading && (
                <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading properties...
                    </p>
                </div>
            )}

            {!isLoading && error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
                    <h2 className="font-semibold text-red-700">
                        Unable to load properties
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchProperties}
                        className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Try again
                    </button>
                </div>
            )}

            {!isLoading &&
                !error &&
                properties.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600">
                            PR
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-gray-900">
                            No properties listed
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                            Your properties will appear here after
                            you create your first listing.
                        </p>
                    </div>
                )}

            {!isLoading &&
                !error &&
                properties.length > 0 && (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {properties.map((property) => {
                                const publicPropertyId =
                                    property.propertyId ||
                                    property.address.propertyId;

                                return (
                                    <article
                                        key={property._id}
                                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="relative h-52 bg-gray-100">
                                            {property.images?.[0] ? (
                                                <img
                                                    src={property.images[0]}
                                                    alt={property.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                                    No image available
                                                </div>
                                            )}

                                            <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                                                {property.listingType}
                                            </span>

                                            <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700">
                                                {property.status}
                                            </span>
                                        </div>

                                        <div className="p-5">
                                            <p className="text-xl font-bold text-red-600">
                                                {formatPrice(
                                                    property.estimatedPrice,
                                                )}
                                            </p>

                                            <h2 className="mt-2 truncate text-lg font-semibold text-gray-900">
                                                {property.name}
                                            </h2>

                                            <p className="mt-1 truncate text-sm text-gray-500">
                                                {property.address.address},{" "}
                                                {property.address.city}
                                            </p>

                                            <div className="mt-5 flex flex-wrap gap-2">
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                                    {property.configuration}
                                                </span>

                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                                    {property.carpetArea}{" "}
                                                    {property.carpetAreaUnit ===
                                                        "SQ_FT"
                                                        ? "sq. ft."
                                                        : "sq. m."}
                                                </span>

                                                {property.negotiable && (
                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                        Negotiable
                                                    </span>
                                                )}
                                            </div>

                                            {publicPropertyId && (
                                                <p className="mt-4 text-xs text-gray-400">
                                                    ID: {publicPropertyId}
                                                </p>
                                            )}

                                            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-100 pt-5">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditingProperty(property)
                                                    }
                                                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:text-red-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(`/properties/${property._id}`)
                                                    }
                                                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:text-red-600"
                                                >
                                                    View details
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDeletingProperty(property)
                                                    }
                                                    className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-4">
                                <button
                                    type="button"
                                    disabled={
                                        !pagination.hasPreviousPage
                                    }
                                    onClick={() =>
                                        setPage((current) =>
                                            Math.max(current - 1, 1),
                                        )
                                    }
                                    className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                <p className="text-sm text-gray-500">
                                    Page {pagination.page} of{" "}
                                    {pagination.totalPages}
                                </p>

                                <button
                                    type="button"
                                    disabled={!pagination.hasNextPage}
                                    onClick={() =>
                                        setPage(
                                            (current) => current + 1,
                                        )
                                    }
                                    className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

            <AddPropertyModal
                isOpen={isAddPropertyModalOpen}
                onClose={() =>
                    setIsAddPropertyModalOpen(false)
                }
                onSuccess={fetchProperties}
            />

            <DeletePropertyModal
                isOpen={deletingProperty !== null}
                propertyId={deletingProperty?._id ?? null}
                propertyName={deletingProperty?.name}
                onClose={() => setDeletingProperty(null)}
                onSuccess={() => {
                    setDeletingProperty(null);
                    fetchProperties();
                }}
            />

            <EditPropertyModal
                isOpen={editingProperty !== null}
                property={editingProperty}
                onClose={() => setEditingProperty(null)}
                onSuccess={() => {
                    setEditingProperty(null);
                    fetchProperties();
                }}
            />
        </section>
    );
};

export default PropertiesSection;