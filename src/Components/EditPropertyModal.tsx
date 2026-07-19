import axios from "axios";
import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { toast } from "react-toastify";

export type EditableProperty = {
    _id: string;
    propertyId?: string;
    name: string;
    city: string;

    address: {
        address: string;
        city: string;
        state: string;
        pincode: string;
        propertyId?: string;
    };

    listingType: "RENT" | "SELL" | "LEASE";
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
    negotiable: boolean;

    propertyAgeType:
    | "NEW"
    | "UNDER_CONSTRUCTION"
    | "EXISTING";

    propertyAgeInYears?: number;
    googleMapLocation?: string;
};

type EditPropertyModalProps = {
    isOpen: boolean;
    property: EditableProperty | null;
    onClose: () => void;
    onSuccess: () => void;
};

type UploadImageResponse = {
    success: boolean;
    message: string;
    data: {
        key: string;
        url: string;
    };
};

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";

const IMAGE_UPLOAD_ENDPOINT =
    `${API_URL}/properties/property-image`;

const availableBenefits = [
    "GATED_SOCIETY",
    "GYM",
    "POOL",
    "PARK",
];

const initialForm = {
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    listingType: "SELL",
    carpetArea: "",
    carpetAreaUnit: "SQ_FT",
    configuration: "1BHK",
    benefits: [] as string[],
    nearestStationName: "",
    nearestStationDistance: "",
    description: "",
    estimatedPrice: "",
    negotiable: false,
    propertyAgeType: "NEW",
    propertyAgeInYears: "",
    googleMapLocation: "",
};

const convertFileToBase64 = (
    file: File,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject(
                    new Error(
                        "Unable to read the image",
                    ),
                );
            }
        };

        reader.onerror = () => {
            reject(
                new Error(
                    "Unable to read the image",
                ),
            );
        };

        reader.readAsDataURL(file);
    });
};

const getErrorMessage = (
    error: unknown,
    fallback: string,
) => {
    if (axios.isAxiosError(error)) {
        const message =
            error.response?.data?.message;

        if (Array.isArray(message)) {
            return message[0];
        }

        return message || fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
};

const EditPropertyModal = ({
    isOpen,
    property,
    onClose,
    onSuccess,
}: EditPropertyModalProps) => {
    const [form, setForm] =
        useState(initialForm);

    const [uploadedImages, setUploadedImages] =
        useState<string[]>([]);

    const [isUploadingImage, setIsUploadingImage] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    useEffect(() => {
        if (!property || !isOpen) return;

        setForm({
            name: property.name || "",

            address:
                property.address?.address || "",

            city:
                property.address?.city ||
                property.city ||
                "",

            state:
                property.address?.state || "",

            pincode:
                property.address?.pincode || "",

            listingType:
                property.listingType || "SELL",

            carpetArea:
                property.carpetArea !== undefined
                    ? String(property.carpetArea)
                    : "",

            carpetAreaUnit:
                property.carpetAreaUnit ||
                "SQ_FT",

            configuration:
                property.configuration ||
                "1BHK",

            benefits:
                property.benefits || [],

            nearestStationName:
                property.nearestStation?.name ||
                "",

            nearestStationDistance:
                property.nearestStation
                    ?.distanceInKm !== undefined
                    ? String(
                        property.nearestStation
                            .distanceInKm,
                    )
                    : "",

            description:
                property.description || "",

            estimatedPrice:
                property.estimatedPrice !==
                    undefined
                    ? String(
                        property.estimatedPrice,
                    )
                    : "",

            negotiable:
                property.negotiable || false,

            propertyAgeType:
                property.propertyAgeType ||
                "NEW",

            propertyAgeInYears:
                property.propertyAgeInYears !==
                    undefined
                    ? String(
                        property.propertyAgeInYears,
                    )
                    : "",

            googleMapLocation:
                property.googleMapLocation || "",
        });

        // Load old property images.
        setUploadedImages(
            property.images || [],
        );
    }, [property, isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (
            event: KeyboardEvent,
        ) => {
            if (
                event.key === "Escape" &&
                !isSubmitting &&
                !isUploadingImage
            ) {
                onClose();
            }
        };

        document.body.style.overflow =
            "hidden";

        window.addEventListener(
            "keydown",
            handleEscape,
        );

        return () => {
            document.body.style.overflow = "";

            window.removeEventListener(
                "keydown",
                handleEscape,
            );
        };
    }, [
        isOpen,
        isSubmitting,
        isUploadingImage,
        onClose,
    ]);

    if (!isOpen || !property) {
        return null;
    }

    const updateForm = (
        field: keyof typeof initialForm,
        value: string | boolean | string[],
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleBenefitChange = (
        benefit: string,
    ) => {
        setForm((current) => ({
            ...current,

            benefits:
                current.benefits.includes(
                    benefit,
                )
                    ? current.benefits.filter(
                        (item) =>
                            item !== benefit,
                    )
                    : [
                        ...current.benefits,
                        benefit,
                    ],
        }));
    };

    const handleImageUpload = async (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file =
            event.target.files?.[0];

        event.target.value = "";

        if (!file) return;

        if (uploadedImages.length >= 5) {
            toast.error(
                "You can upload a maximum of 5 images",
            );
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error(
                "Only JPG, PNG and WebP images are allowed",
            );
            return;
        }

        const maximumSize =
            5 * 1024 * 1024;

        if (file.size > maximumSize) {
            toast.error(
                "Image size cannot exceed 5 MB",
            );
            return;
        }

        const token =
            localStorage.getItem("token");

        if (!token) {
            toast.error(
                "Please log in to upload images",
            );
            return;
        }

        try {
            setIsUploadingImage(true);

            const base64 =
                await convertFileToBase64(file);

            const response =
                await axios.post<UploadImageResponse>(
                    IMAGE_UPLOAD_ENDPOINT,
                    {
                        base64,
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json",
                        },
                    },
                );

            const newImageUrl =
                response.data.data.url;

            setUploadedImages((current) => [
                ...current,
                newImageUrl,
            ]);

            toast.success(
                "Image uploaded successfully",
            );
        } catch (error: unknown) {
            toast.error(
                getErrorMessage(
                    error,
                    "Unable to upload image",
                ),
            );
        } finally {
            setIsUploadingImage(false);
        }
    };

    const removeImage = (
        imageIndex: number,
    ) => {
        setUploadedImages((current) =>
            current.filter(
                (_, index) =>
                    index !== imageIndex,
            ),
        );
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const propertyId =
            property._id ||
            property.address?.propertyId;

        if (!propertyId) {
            toast.error(
                "Property ID is missing",
            );
            return;
        }

        const token =
            localStorage.getItem("token");

        if (!token) {
            toast.error(
                "Please log in to edit the property",
            );
            return;
        }

        if (isUploadingImage) {
            toast.error(
                "Please wait for the image upload to finish",
            );
            return;
        }

        if (uploadedImages.length === 0) {
            toast.error(
                "Please keep at least one property image",
            );
            return;
        }

        try {
            setIsSubmitting(true);

            const requestBody:
                Record<string, unknown> = {
                name: form.name.trim(),

                address: {
                    address:
                        form.address.trim(),

                    city: form.city.trim(),

                    state:
                        form.state.trim(),

                    pincode:
                        form.pincode.trim(),
                },

                listingType:
                    form.listingType,

                carpetArea: Number(
                    form.carpetArea,
                ),

                carpetAreaUnit:
                    form.carpetAreaUnit,

                configuration:
                    form.configuration,

                benefits: form.benefits,

                description:
                    form.description.trim(),

                // Old remaining images and new images.
                images: uploadedImages,

                estimatedPrice: Number(
                    form.estimatedPrice,
                ),

                negotiable:
                    form.negotiable,

                propertyAgeType:
                    form.propertyAgeType,

                googleMapLocation:
                    form.googleMapLocation.trim() ||
                    undefined,
            };

            if (
                form.nearestStationName.trim() &&
                form.nearestStationDistance
            ) {
                requestBody.nearestStation = {
                    name:
                        form.nearestStationName.trim(),

                    distanceInKm: Number(
                        form.nearestStationDistance,
                    ),
                };
            }

            if (
                form.propertyAgeType ===
                "EXISTING"
            ) {
                requestBody.propertyAgeInYears =
                    Number(
                        form.propertyAgeInYears,
                    );
            } else {
                requestBody.propertyAgeInYears =
                    undefined;
            }

            await axios.patch(
                `${API_URL}/properties/edit/${propertyId}`,
                requestBody,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",
                    },
                },
            );

            toast.success(
                "Property updated successfully",
            );

            onClose();
            onSuccess();
        } catch (error: unknown) {
            toast.error(
                getErrorMessage(
                    error,
                    "Unable to update property",
                ),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (
            isSubmitting ||
            isUploadingImage
        ) {
            return;
        }

        onClose();
    };

    const inputClass =
        "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100";

    const labelClass =
        "mb-1.5 block text-sm font-medium text-gray-700";

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
            onMouseDown={handleClose}
        >
            <div
                className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={
                        isSubmitting ||
                        isUploadingImage
                    }
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    ×
                </button>

                <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
                    Property listing
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                    Edit Property
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    Update property information
                    and images.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-7 grid gap-5 sm:grid-cols-2"
                >
                    <div className="sm:col-span-2">
                        <label
                            className={labelClass}
                        >
                            Property name
                        </label>

                        <input
                            required
                            value={form.name}
                            onChange={(event) =>
                                updateForm(
                                    "name",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            className={labelClass}
                        >
                            Listing type
                        </label>

                        <select
                            value={
                                form.listingType
                            }
                            onChange={(event) =>
                                updateForm(
                                    "listingType",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        >
                            <option value="SELL">
                                Sell
                            </option>

                            <option value="RENT">
                                Rent
                            </option>

                            <option value="LEASE">
                                Lease
                            </option>
                        </select>
                    </div>

                    <div>
                        <label
                            className={labelClass}
                        >
                            Configuration
                        </label>

                        <select
                            value={
                                form.configuration
                            }
                            onChange={(event) =>
                                updateForm(
                                    "configuration",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        >
                            <option value="1RK">
                                1 RK
                            </option>

                            <option value="1BHK">
                                1 BHK
                            </option>

                            <option value="2BHK">
                                2 BHK
                            </option>

                            <option value="3BHK">
                                3 BHK
                            </option>

                            <option value="4BHK">
                                4 BHK
                            </option>

                            <option value="DUPLEX">
                                Duplex
                            </option>
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            className={labelClass}
                        >
                            Address
                        </label>

                        <input
                            required
                            value={form.address}
                            onChange={(event) =>
                                updateForm(
                                    "address",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            className={labelClass}
                        >
                            City
                        </label>

                        <input
                            required
                            value={form.city}
                            onChange={(event) =>
                                updateForm(
                                    "city",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            className={labelClass}
                        >
                            State
                        </label>

                        <input
                            required
                            value={form.state}
                            onChange={(event) =>
                                updateForm(
                                    "state",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            className={labelClass}
                        >
                            Pincode
                        </label>

                        <input
                            required
                            inputMode="numeric"
                            pattern="[1-9][0-9]{5}"
                            maxLength={6}
                            value={form.pincode}
                            onChange={(event) =>
                                updateForm(
                                    "pincode",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            className={labelClass}
                        >
                            Estimated price
                        </label>

                        <input
                            required
                            type="number"
                            min="0"
                            value={
                                form.estimatedPrice
                            }
                            onChange={(event) =>
                                updateForm(
                                    "estimatedPrice",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            className={labelClass}
                        >
                            Carpet area
                        </label>

                        <input
                            required
                            type="number"
                            min="1"
                            value={form.carpetArea}
                            onChange={(event) =>
                                updateForm(
                                    "carpetArea",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            className={labelClass}
                        >
                            Area unit
                        </label>

                        <select
                            value={
                                form.carpetAreaUnit
                            }
                            onChange={(event) =>
                                updateForm(
                                    "carpetAreaUnit",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        >
                            <option value="SQ_FT">
                                Square feet
                            </option>

                            <option value="SQ_METER">
                                Square metres
                            </option>
                        </select>
                    </div>

                    <div>
                        <label
                            className={labelClass}
                        >
                            Property age type
                        </label>

                        <select
                            value={
                                form.propertyAgeType
                            }
                            onChange={(event) =>
                                updateForm(
                                    "propertyAgeType",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        >
                            <option value="NEW">
                                New
                            </option>

                            <option value="UNDER_CONSTRUCTION">
                                Under construction
                            </option>

                            <option value="EXISTING">
                                Existing
                            </option>
                        </select>
                    </div>

                    {form.propertyAgeType ===
                        "EXISTING" && (
                            <div>
                                <label
                                    className={
                                        labelClass
                                    }
                                >
                                    Age in years
                                </label>

                                <input
                                    required
                                    type="number"
                                    min="0"
                                    value={
                                        form.propertyAgeInYears
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        updateForm(
                                            "propertyAgeInYears",
                                            event.target
                                                .value,
                                        )
                                    }
                                    className={
                                        inputClass
                                    }
                                />
                            </div>
                        )}

                    <div>
                        <label
                            className={labelClass}
                        >
                            Nearest station
                        </label>

                        <input
                            value={
                                form.nearestStationName
                            }
                            onChange={(event) =>
                                updateForm(
                                    "nearestStationName",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            className={labelClass}
                        >
                            Distance in km
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={
                                form.nearestStationDistance
                            }
                            onChange={(event) =>
                                updateForm(
                                    "nearestStationDistance",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            className={labelClass}
                        >
                            Benefits
                        </label>

                        <div className="flex flex-wrap gap-3">
                            {availableBenefits.map(
                                (benefit) => (
                                    <label
                                        key={
                                            benefit
                                        }
                                        className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium ${form.benefits.includes(
                                            benefit,
                                        )
                                                ? "border-red-600 bg-red-50 text-red-600"
                                                : "border-gray-200 text-gray-600"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.benefits.includes(
                                                benefit,
                                            )}
                                            onChange={() =>
                                                handleBenefitChange(
                                                    benefit,
                                                )
                                            }
                                            className="hidden"
                                        />

                                        {benefit.replaceAll(
                                            "_",
                                            " ",
                                        )}
                                    </label>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Property images */}
                    <div className="sm:col-span-2">
                        <div className="mb-2 flex items-center justify-between">
                            <label
                                className={
                                    labelClass
                                }
                            >
                                Property images
                            </label>

                            <span className="text-xs font-medium text-gray-500">
                                {
                                    uploadedImages.length
                                }
                                /5 images
                            </span>
                        </div>

                        {uploadedImages.length >
                            0 && (
                                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                                    {uploadedImages.map(
                                        (
                                            imageUrl,
                                            index,
                                        ) => (
                                            <div
                                                key={`${imageUrl}-${index}`}
                                                className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                                            >
                                                <img
                                                    src={
                                                        imageUrl
                                                    }
                                                    alt={`Property ${index + 1}`}
                                                    className="h-28 w-full object-cover"
                                                />

                                                {index ===
                                                    0 && (
                                                        <span className="absolute bottom-2 left-2 rounded-md bg-red-600 px-2 py-1 text-[10px] font-semibold text-white">
                                                            Cover
                                                        </span>
                                                    )}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(
                                                            index,
                                                        )
                                                    }
                                                    disabled={
                                                        isSubmitting ||
                                                        isUploadingImage
                                                    }
                                                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                    aria-label={`Remove image ${index + 1}`}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}

                        <label
                            className={`flex items-center justify-center rounded-xl border-2 border-dashed px-5 py-7 text-center transition ${uploadedImages.length >=
                                    5 ||
                                    isUploadingImage
                                    ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60"
                                    : "cursor-pointer border-red-200 bg-red-50/50 hover:border-red-400 hover:bg-red-50"
                                }`}
                        >
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={
                                    handleImageUpload
                                }
                                disabled={
                                    uploadedImages.length >=
                                    5 ||
                                    isUploadingImage
                                }
                                className="hidden"
                            />

                            <div>
                                {isUploadingImage ? (
                                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />
                                ) : (
                                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl text-red-600 shadow-sm">
                                        +
                                    </div>
                                )}

                                <p className="mt-3 text-sm font-semibold text-gray-800">
                                    {isUploadingImage
                                        ? "Uploading image..."
                                        : uploadedImages.length >=
                                            5
                                            ? "Maximum 5 images reached"
                                            : "Upload another image"}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    JPG, PNG or WebP,
                                    maximum 5 MB
                                </p>
                            </div>
                        </label>

                        {uploadedImages.length ===
                            0 && (
                                <p className="mt-2 text-xs text-red-600">
                                    At least one image is
                                    required.
                                </p>
                            )}
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            className={labelClass}
                        >
                            Google Maps location
                        </label>

                        <input
                            value={
                                form.googleMapLocation
                            }
                            onChange={(event) =>
                                updateForm(
                                    "googleMapLocation",
                                    event.target.value,
                                )
                            }
                            placeholder="Google Maps URL"
                            className={inputClass}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            className={labelClass}
                        >
                            Description
                        </label>

                        <textarea
                            required
                            rows={4}
                            value={
                                form.description
                            }
                            onChange={(event) =>
                                updateForm(
                                    "description",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        />
                    </div>

                    <label className="flex items-center gap-3 sm:col-span-2">
                        <input
                            type="checkbox"
                            checked={
                                form.negotiable
                            }
                            onChange={(event) =>
                                updateForm(
                                    "negotiable",
                                    event.target
                                        .checked,
                                )
                            }
                            className="h-5 w-5 accent-red-600"
                        />

                        <span className="text-sm font-medium">
                            Price is negotiable
                        </span>
                    </label>

                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-5 sm:col-span-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={
                                isSubmitting ||
                                isUploadingImage
                            }
                            className="rounded-xl border border-gray-200 px-6 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                isUploadingImage ||
                                uploadedImages.length ===
                                0
                            }
                            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting
                                ? "Updating..."
                                : isUploadingImage
                                    ? "Uploading image..."
                                    : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPropertyModal;