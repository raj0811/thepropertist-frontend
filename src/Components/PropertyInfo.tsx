import axios from "axios";
import {
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import Navbar from "../Components/Navbar";
import EnquiryModal from "../Components/EnquiryModal";

type Agent = {
    _id: string;
    agentId: string;
    name: string;
    email: string;
    phone: string;
    photo?: string | null;
};

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

        // Temporary fallback for current backend response
        propertyId?: string;
    };

    agentId: Agent;
    listingType: "SELL" | "RENT" | "LEASE";
    carpetArea: number;
    carpetAreaUnit: "SQ_FT" | "SQ_METER";
    configuration: string;
    benefits: string[];

    nearestStation?: {
        name: string;
        distanceInKm: number;
    };

    description: string;
    images: string[];
    estimatedPrice: number;
    currency: string;
    negotiable: boolean;
    propertyAgeType:
    | "NEW"
    | "UNDER_CONSTRUCTION"
    | "EXISTING";
    propertyAgeInYears?: number;
    status: string;
    createdAt: string;
    updatedAt: string;
};

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";

const PropertyInfo = () => {
    const { id } = useParams<{
        id: string;
    }>();

    const navigate = useNavigate();

    const [property, setProperty] =
        useState<Property | null>(null);

    const [activeImageIndex, setActiveImageIndex] =
        useState(0);

    const [isEnquiryOpen, setIsEnquiryOpen] =
        useState(false);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] = useState("");

    const fetchProperty = useCallback(async () => {
        if (!id) {
            setError("Property ID is missing");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/properties/get/${id}`,
            );

            setProperty(response.data?.data ?? null);
            setActiveImageIndex(0);
        } catch (error: unknown) {
            setProperty(null);

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                    "Unable to fetch property",
                );
            } else {
                setError("Unable to fetch property");
            }
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProperty();
    }, [fetchProperty]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const showPreviousImage = () => {
        if (!property?.images.length) return;

        setActiveImageIndex((current) =>
            current === 0
                ? property.images.length - 1
                : current - 1,
        );
    };

    const showNextImage = () => {
        if (!property?.images.length) return;

        setActiveImageIndex((current) =>
            current === property.images.length - 1
                ? 0
                : current + 1,
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />

                        <p className="mt-4 text-gray-500">
                            Loading property...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="mx-auto max-w-3xl px-5 py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Property unavailable
                    </h1>

                    <p className="mt-3 text-gray-500">
                        {error || "Property not found"}
                    </p>

                    <div className="mt-7 flex justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/home")}
                            className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700"
                        >
                            Return home
                        </button>

                        <button
                            type="button"
                            onClick={fetchProperty}
                            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const images = property.images ?? [];

    const customPropertyId =
        property._id

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-6 text-sm font-semibold text-gray-500 transition hover:text-red-600"
                >
                    ← Back to properties
                </button>

                {/* Image carousel */}
                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                    {images.length > 0 ? (
                        <div className="flex flex-col gap-3 lg:flex-row">
                            {/* Side thumbnails */}
                            {images.length > 1 && (
                                <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:max-h-[550px] lg:w-28 lg:flex-col lg:overflow-y-auto">
                                    {images.map(
                                        (image, index) => (
                                            <button
                                                key={`${image}-${index}`}
                                                type="button"
                                                onClick={() =>
                                                    setActiveImageIndex(
                                                        index,
                                                    )
                                                }
                                                className={`h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition lg:h-24 lg:w-full ${activeImageIndex ===
                                                    index
                                                    ? "border-red-600"
                                                    : "border-transparent opacity-70 hover:opacity-100"
                                                    }`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${property.name} thumbnail ${index + 1
                                                        }`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </button>
                                        ),
                                    )}
                                </div>
                            )}

                            {/* Main image */}
                            <div className="relative order-1 min-h-72 flex-1 overflow-hidden rounded-xl bg-gray-100 lg:order-2 lg:h-[550px]">
                                <img
                                    src={images[activeImageIndex]}
                                    alt={`${property.name} image ${activeImageIndex + 1
                                        }`}
                                    className="h-full min-h-72 w-full object-cover lg:min-h-0"
                                />

                                <div className="absolute left-4 top-4 flex gap-2">
                                    <span className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow">
                                        {property.listingType}
                                    </span>

                                    <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-gray-800 shadow">
                                        {property.status}
                                    </span>
                                </div>

                                {images.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={showPreviousImage}
                                            aria-label="Previous image"
                                            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl text-white transition hover:bg-black/70"
                                        >
                                            ‹
                                        </button>

                                        <button
                                            type="button"
                                            onClick={showNextImage}
                                            aria-label="Next image"
                                            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl text-white transition hover:bg-black/70"
                                        >
                                            ›
                                        </button>

                                        <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-4 py-2 text-xs font-medium text-white">
                                            {activeImageIndex + 1} /{" "}
                                            {images.length}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-96 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                            No property images available
                        </div>
                    )}
                </section>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
                    {/* Property details */}
                    <div className="space-y-7">
                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex flex-col gap-5 border-b border-gray-100 pb-7 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
                                        {property.configuration}
                                    </p>

                                    <h1 className="mt-2 text-3xl font-bold text-gray-900">
                                        {property.name}
                                    </h1>

                                    <p className="mt-3 text-gray-500">
                                        {property.address.address},{" "}
                                        {property.address.city},{" "}
                                        {property.address.state} –{" "}
                                        {property.address.pincode}
                                    </p>

                                    {customPropertyId && (
                                        <p className="mt-2 text-xs text-gray-400">
                                            Property ID:{" "}
                                            {customPropertyId}
                                        </p>
                                    )}
                                </div>

                                <div className="sm:text-right">
                                    <p className="text-3xl font-bold text-red-600">
                                        {formatPrice(
                                            property.estimatedPrice,
                                        )}
                                    </p>

                                    {property.negotiable && (
                                        <p className="mt-2 text-sm font-semibold text-green-600">
                                            Price negotiable
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-5 py-7 sm:grid-cols-2 lg:grid-cols-4">
                                <DetailItem
                                    label="Configuration"
                                    value={property.configuration}
                                />

                                <DetailItem
                                    label="Carpet area"
                                    value={`${property.carpetArea} ${property.carpetAreaUnit ===
                                        "SQ_FT"
                                        ? "sq. ft."
                                        : "sq. m."
                                        }`}
                                />

                                <DetailItem
                                    label="Listing type"
                                    value={property.listingType}
                                />

                                <DetailItem
                                    label="Property age"
                                    value={
                                        property.propertyAgeType ===
                                            "EXISTING" &&
                                            property.propertyAgeInYears !==
                                            undefined
                                            ? `${property.propertyAgeInYears} years old`
                                            : property.propertyAgeType.replaceAll(
                                                "_",
                                                " ",
                                            )
                                    }
                                />
                            </div>

                            <div className="border-t border-gray-100 pt-7">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Description
                                </h2>

                                <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
                                    {property.description}
                                </p>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="text-xl font-bold text-gray-900">
                                Amenities and location
                            </h2>

                            {property.benefits.length >
                                0 && (
                                    <div className="mt-5 flex flex-wrap gap-3">
                                        {property.benefits.map(
                                            (benefit) => (
                                                <span
                                                    key={benefit}
                                                    className="rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-700"
                                                >
                                                    {benefit.replaceAll(
                                                        "_",
                                                        " ",
                                                    )}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                )}

                            <div className="mt-7 grid gap-5 sm:grid-cols-2">
                                <DetailItem
                                    label="City"
                                    value={property.city}
                                />

                                <DetailItem
                                    label="Pincode"
                                    value={
                                        property.address.pincode
                                    }
                                />

                                {property.nearestStation && (
                                    <>
                                        <DetailItem
                                            label="Nearest station"
                                            value={
                                                property.nearestStation
                                                    .name
                                            }
                                        />

                                        <DetailItem
                                            label="Station distance"
                                            value={`${property.nearestStation.distanceInKm} km`}
                                        />
                                    </>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Agent and enquiry */}
                    <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Listed by
                        </p>

                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-red-100 text-xl font-bold text-red-600">
                                {property.agentId.photo ? (
                                    <img
                                        src={property.agentId.photo}
                                        alt={property.agentId.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    property.agentId.name
                                        .charAt(0)
                                        .toUpperCase()
                                )}
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900">
                                    {property.agentId.name}
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    {property.agentId.agentId}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-sm">
                            <p className="text-gray-600">
                                <span className="font-medium text-gray-900">
                                    Phone:
                                </span>{" "}
                                {property.agentId.phone}
                            </p>

                            <p className="break-all text-gray-600">
                                <span className="font-medium text-gray-900">
                                    Email:
                                </span>{" "}
                                {property.agentId.email}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setIsEnquiryOpen(true)
                            }
                            disabled={!customPropertyId}
                            className="mt-7 w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Enquire About Property
                        </button>

                        <p className="mt-3 text-center text-xs leading-5 text-gray-400">
                            Submit an enquiry and the agent will
                            contact you.
                        </p>
                    </aside>
                </div>
            </main>

            <EnquiryModal
                isOpen={isEnquiryOpen}
                onClose={() =>
                    setIsEnquiryOpen(false)
                }
                propertyId={customPropertyId}
                propertyName={property.name}
            />
        </div>
    );
};

const DetailItem = ({
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

        <p className="mt-2 font-semibold text-gray-800">
            {value}
        </p>
    </div>
);

export default PropertyInfo;