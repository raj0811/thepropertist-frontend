import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

type PropertyAddress = {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    propertyId?: string;
};

type EnquiryProperty = {
    _id: string;
    propertyId?: string;
    name: string;
    address?: PropertyAddress;
    listingType?: string;
    configuration?: string;
    images?: string[];
    estimatedPrice?: number;
    status?: string;
};

type Enquiry = {
    _id: string;
    enquiryId: string;
    enquiryType: "PROPERTY" | "GENERAL";
    name: string;
    email: string;
    phone: string;
    propertyMongoId?: EnquiryProperty | null;
    budget?: number | null;
    preferredArea?: string | null;
    movingInTime?: string | null;
    listingType?: string | null;
    message?: string | null;
    status: string;
    createdAt: string;
};

type Pagination = {
    page: number;
    limit: number;
    totalEnquiries: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

type EnquiriesResponse = {
    success: boolean;
    message: string;
    data: Enquiry[];
    pagination: Pagination;
};

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";

const formatLabel = (value?: string | null) => {
    if (!value) return "Not provided";

    return value
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase(),
        );
};

const formatPrice = (price?: number | null) => {
    if (price === undefined || price === null) {
        return "Not provided";
    }

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(price);
};

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
};

const EnquiriesSection = () => {
    const [enquiries, setEnquiries] = useState<
        Enquiry[]
    >([]);
    const [pagination, setPagination] =
        useState<Pagination>({
            page: 1,
            limit: 10,
            totalEnquiries: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
        });

    const [isLoading, setIsLoading] =
        useState(true);
    const [error, setError] = useState("");

    const fetchEnquiries = useCallback(
        async (page: number) => {
            const token =
                localStorage.getItem("token");

            if (!token) {
                setError(
                    "Please log in to view enquiries.",
                );
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/enquiries/agent-enquiries?page=${page}&limit=10`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const result =
                    (await response.json()) as EnquiriesResponse;

                if (!response.ok) {
                    throw new Error(
                        Array.isArray(result.message)
                            ? result.message.join(", ")
                            : result.message ||
                            "Failed to fetch enquiries",
                    );
                }

                setEnquiries(result.data || []);
                setPagination(result.pagination);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch enquiries";

                setError(message);
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        void fetchEnquiries(1);
    }, [fetchEnquiries]);

    if (isLoading) {
        return (
            <section>
                <SectionHeader />

                <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading enquiries...
                    </p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section>
                <SectionHeader />

                <div className="rounded-2xl border border-red-200 bg-red-50 py-16 text-center">
                    <h2 className="text-lg font-semibold text-red-700">
                        Unable to load enquiries
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            void fetchEnquiries(
                                pagination.page || 1,
                            )
                        }
                        className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700"
                    >
                        Try again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section>
            <SectionHeader
                total={pagination.totalEnquiries}
            />

            {enquiries.length === 0 ? (
                <EmptyState />
            ) : (
                <>
                    <div className="space-y-5">
                        {enquiries.map((enquiry) => {
                            const property =
                                enquiry.propertyMongoId;

                            const propertyImage =
                                property?.images?.[0];

                            const propertyCode =
                                property?.propertyId ||
                                property?.address
                                    ?.propertyId;

                            return (
                                <article
                                    key={enquiry._id}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-red-200 hover:shadow-md"
                                >
                                    <div className="flex flex-col lg:flex-row">
                                        {property && (
                                            <div className="h-52 w-full shrink-0 bg-gray-100 lg:h-auto lg:w-64">
                                                {propertyImage ? (
                                                    <img
                                                        src={
                                                            propertyImage
                                                        }
                                                        alt={
                                                            property.name
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full min-h-52 items-center justify-center text-sm text-gray-400">
                                                        No property image
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex-1 p-5 sm:p-6">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                                                            {formatLabel(
                                                                enquiry.enquiryType,
                                                            )}
                                                        </span>

                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${enquiry.status ===
                                                                    "NEW"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-gray-100 text-gray-700"
                                                                }`}
                                                        >
                                                            {formatLabel(
                                                                enquiry.status,
                                                            )}
                                                        </span>
                                                    </div>

                                                    <h2 className="mt-3 text-xl font-bold text-gray-900">
                                                        {
                                                            enquiry.name
                                                        }
                                                    </h2>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {
                                                            enquiry.enquiryId
                                                        }{" "}
                                                        •{" "}
                                                        {formatDate(
                                                            enquiry.createdAt,
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <a
                                                        href={`tel:${enquiry.phone}`}
                                                        className="rounded-lg border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                                                    >
                                                        Call
                                                    </a>

                                                    <a
                                                        href={`mailto:${enquiry.email}`}
                                                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                                                    >
                                                        Email
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="mt-5 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 xl:grid-cols-3">
                                                <InfoItem
                                                    label="Email"
                                                    value={
                                                        enquiry.email
                                                    }
                                                />

                                                <InfoItem
                                                    label="Phone"
                                                    value={
                                                        enquiry.phone
                                                    }
                                                />

                                                <InfoItem
                                                    label="Moving In"
                                                    value={formatLabel(
                                                        enquiry.movingInTime,
                                                    )}
                                                />

                                                {enquiry.enquiryType ===
                                                    "GENERAL" && (
                                                        <>
                                                            <InfoItem
                                                                label="Budget"
                                                                value={formatPrice(
                                                                    enquiry.budget,
                                                                )}
                                                            />

                                                            <InfoItem
                                                                label="Preferred Area"
                                                                value={
                                                                    enquiry.preferredArea ||
                                                                    "Not provided"
                                                                }
                                                            />

                                                            <InfoItem
                                                                label="Listing Type"
                                                                value={formatLabel(
                                                                    enquiry.listingType,
                                                                )}
                                                            />
                                                        </>
                                                    )}
                                            </div>

                                            {property && (
                                                <div className="mt-5 rounded-xl bg-gray-50 p-4">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
                                                        Property
                                                    </p>

                                                    <h3 className="mt-2 font-bold text-gray-900">
                                                        {
                                                            property.name
                                                        }
                                                    </h3>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {[
                                                            property
                                                                .address
                                                                ?.address,
                                                            property
                                                                .address
                                                                ?.city,
                                                            property
                                                                .address
                                                                ?.state,
                                                        ]
                                                            .filter(
                                                                Boolean,
                                                            )
                                                            .join(
                                                                ", ",
                                                            )}
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                                                        {propertyCode && (
                                                            <span>
                                                                {
                                                                    propertyCode
                                                                }
                                                            </span>
                                                        )}

                                                        {property.configuration && (
                                                            <span>
                                                                {
                                                                    property.configuration
                                                                }
                                                            </span>
                                                        )}

                                                        {property.listingType && (
                                                            <span>
                                                                {formatLabel(
                                                                    property.listingType,
                                                                )}
                                                            </span>
                                                        )}

                                                        {property.estimatedPrice !==
                                                            undefined && (
                                                                <span className="font-semibold text-red-600">
                                                                    {formatPrice(
                                                                        property.estimatedPrice,
                                                                    )}
                                                                </span>
                                                            )}
                                                    </div>
                                                </div>
                                            )}

                                            {enquiry.message && (
                                                <div className="mt-5 border-t border-gray-100 pt-5">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                        Message
                                                    </p>

                                                    <p className="mt-2 text-sm leading-6 text-gray-700">
                                                        {
                                                            enquiry.message
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
                            <button
                                type="button"
                                disabled={
                                    !pagination.hasPreviousPage
                                }
                                onClick={() =>
                                    void fetchEnquiries(
                                        pagination.page - 1,
                                    )
                                }
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <p className="text-sm text-gray-500">
                                Page{" "}
                                <span className="font-semibold text-gray-900">
                                    {pagination.page}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-gray-900">
                                    {pagination.totalPages}
                                </span>
                            </p>

                            <button
                                type="button"
                                disabled={
                                    !pagination.hasNextPage
                                }
                                onClick={() =>
                                    void fetchEnquiries(
                                        pagination.page + 1,
                                    )
                                }
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

const SectionHeader = ({
    total,
}: {
    total?: number;
}) => (
    <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
            Leads
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
                Enquiries
            </h1>

            {total !== undefined && (
                <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                    {total}
                </span>
            )}
        </div>

        <p className="mt-2 text-gray-500">
            View enquiries received for your properties.
        </p>
    </div>
);

const InfoItem = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => (
    <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-gray-800">
            {value}
        </p>
    </div>
);

const EmptyState = () => (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600">
            E
        </div>

        <h2 className="mt-5 text-xl font-semibold text-gray-900">
            No enquiries yet
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Enquiries submitted for your properties will
            appear here.
        </p>
    </div>
);

export default EnquiriesSection;