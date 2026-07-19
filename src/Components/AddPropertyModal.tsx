import axios from "axios";
import {
    useEffect,
    useState,
    type FormEvent,
} from "react";
import { toast } from "react-toastify";

type AddPropertyModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";

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
    nearestStationName: "",
    nearestStationDistance: "",
    description: "",
    imageUrls: "",
    estimatedPrice: "",
    negotiable: false,
    propertyAgeType: "NEW",
    propertyAgeInYears: "",
    benefits: [] as string[],
};

const AddPropertyModal = ({
    isOpen,
    onClose,
    onSuccess,
}: AddPropertyModalProps) => {
    const [form, setForm] =
        useState(initialForm);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

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
            benefits: current.benefits.includes(benefit)
                ? current.benefits.filter(
                    (item) => item !== benefit,
                )
                : [...current.benefits, benefit],
        }));
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        try {
            setIsSubmitting(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                toast.error(
                    "Please log in to add a property",
                );
                return;
            }

            const images = form.imageUrls
                .split(",")
                .map((url) => url.trim())
                .filter(Boolean);

            const requestBody: Record<string, unknown> = {
                name: form.name.trim(),
                city: form.city.trim(),

                address: {
                    address: form.address.trim(),
                    city: form.city.trim(),
                    state: form.state.trim(),
                    pincode: form.pincode.trim(),
                },

                listingType: form.listingType,
                carpetArea: Number(form.carpetArea),
                carpetAreaUnit: form.carpetAreaUnit,
                configuration: form.configuration,
                benefits: form.benefits,
                description: form.description.trim(),
                images,
                estimatedPrice: Number(
                    form.estimatedPrice,
                ),
                negotiable: form.negotiable,
                propertyAgeType:
                    form.propertyAgeType,
            };

            if (
                form.nearestStationName.trim() &&
                form.nearestStationDistance
            ) {
                requestBody.nearestStation = {
                    name: form.nearestStationName.trim(),
                    distanceInKm: Number(
                        form.nearestStationDistance,
                    ),
                };
            }

            if (
                form.propertyAgeType === "EXISTING"
            ) {
                requestBody.propertyAgeInYears =
                    Number(form.propertyAgeInYears);
            }

            await axios.post(
                `${API_URL}/properties/create`,
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            toast.success(
                "Property added successfully",
            );

            setForm(initialForm);
            onClose();
            onSuccess();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message;

                toast.error(
                    Array.isArray(message)
                        ? message[0]
                        : message ||
                        "Unable to add property",
                );
            } else {
                toast.error("Unable to add property");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100";

    const labelClass =
        "mb-1.5 block text-sm font-medium text-gray-700";

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
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
                    New listing
                </p>

                <h2 className="mt-1 text-3xl font-bold text-gray-900">
                    Add Property
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    Enter the property information below.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-7 grid gap-5 sm:grid-cols-2"
                >
                    <div className="sm:col-span-2">
                        <label className={labelClass}>
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
                            placeholder="Premium 2 BHK Apartment"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Listing type
                        </label>

                        <select
                            value={form.listingType}
                            onChange={(event) =>
                                updateForm(
                                    "listingType",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        >
                            <option value="SELL">Sell</option>
                            <option value="RENT">Rent</option>
                            <option value="LEASE">Lease</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>
                            Configuration
                        </label>

                        <select
                            value={form.configuration}
                            onChange={(event) =>
                                updateForm(
                                    "configuration",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        >
                            <option value="1RK">1 RK</option>
                            <option value="1BHK">1 BHK</option>
                            <option value="2BHK">2 BHK</option>
                            <option value="3BHK">3 BHK</option>
                            <option value="4BHK">4 BHK</option>
                            <option value="DUPLEX">
                                Duplex
                            </option>
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <label className={labelClass}>
                            Full address
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
                            placeholder="Tilak Nagar, Chembur"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
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
                            placeholder="Mumbai"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
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
                            placeholder="Maharashtra"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
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
                            placeholder="400089"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Estimated price
                        </label>

                        <input
                            type="number"
                            required
                            min="0"
                            value={form.estimatedPrice}
                            onChange={(event) =>
                                updateForm(
                                    "estimatedPrice",
                                    event.target.value,
                                )
                            }
                            placeholder="12500000"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Carpet area
                        </label>

                        <input
                            type="number"
                            required
                            min="1"
                            value={form.carpetArea}
                            onChange={(event) =>
                                updateForm(
                                    "carpetArea",
                                    event.target.value,
                                )
                            }
                            placeholder="850"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Area unit
                        </label>

                        <select
                            value={form.carpetAreaUnit}
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
                                Square meters
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>
                            Property age
                        </label>

                        <select
                            value={form.propertyAgeType}
                            onChange={(event) =>
                                updateForm(
                                    "propertyAgeType",
                                    event.target.value,
                                )
                            }
                            className={inputClass}
                        >
                            <option value="NEW">New</option>

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
                                <label className={labelClass}>
                                    Property age in years
                                </label>

                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={form.propertyAgeInYears}
                                    onChange={(event) =>
                                        updateForm(
                                            "propertyAgeInYears",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="5"
                                    className={inputClass}
                                />
                            </div>
                        )}

                    <div>
                        <label className={labelClass}>
                            Nearest station
                        </label>

                        <input
                            value={form.nearestStationName}
                            onChange={(event) =>
                                updateForm(
                                    "nearestStationName",
                                    event.target.value,
                                )
                            }
                            placeholder="Tilak Nagar Station"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Station distance (km)
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
                            placeholder="1.2"
                            className={inputClass}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className={labelClass}>
                            Benefits
                        </label>

                        <div className="flex flex-wrap gap-3">
                            {availableBenefits.map(
                                (benefit) => (
                                    <label
                                        key={benefit}
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

                                        {benefit.replaceAll("_", " ")}
                                    </label>
                                ),
                            )}
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label className={labelClass}>
                            Image URLs
                        </label>

                        <input
                            value={form.imageUrls}
                            onChange={(event) =>
                                updateForm(
                                    "imageUrls",
                                    event.target.value,
                                )
                            }
                            placeholder="Separate multiple URLs with commas"
                            className={inputClass}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className={labelClass}>
                            Description
                        </label>

                        <textarea
                            required
                            rows={4}
                            value={form.description}
                            onChange={(event) =>
                                updateForm(
                                    "description",
                                    event.target.value,
                                )
                            }
                            placeholder="Describe the property..."
                            className={inputClass}
                        />
                    </div>

                    <label className="flex items-center gap-3 sm:col-span-2">
                        <input
                            type="checkbox"
                            checked={form.negotiable}
                            onChange={(event) =>
                                updateForm(
                                    "negotiable",
                                    event.target.checked,
                                )
                            }
                            className="h-5 w-5 accent-red-600"
                        />

                        <span className="text-sm font-medium text-gray-700">
                            Price is negotiable
                        </span>
                    </label>

                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-5 sm:col-span-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting
                                ? "Adding property..."
                                : "Add Property"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPropertyModal;