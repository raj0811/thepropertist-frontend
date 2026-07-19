import axios from "axios";
import {
    useEffect,
    useState,
    type FormEvent,
} from "react";
import { toast } from "react-toastify";

type EnquiryModalProps = {
    isOpen: boolean;
    onClose: () => void;

    // Pass for property-specific enquiry
    propertyId?: string;
    propertyName?: string;
};

type MovingInTime =
    | "IMMEDIATELY"
    | "WITHIN_1_MONTH"
    | "WITHIN_3_MONTHS"
    | "WITHIN_6_MONTHS"
    | "JUST_EXPLORING";

type ListingType =
    | "SELL"
    | "RENT"
    | "LEASE"
    | "";

type EnquiryForm = {
    name: string;
    email: string;
    number: string;
    listingType: ListingType;
    budget: string;
    preferredArea: string;
    movingInTime: MovingInTime;
    message: string;
};

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";

const initialForm: EnquiryForm = {
    name: "",
    email: "",
    number: "",
    listingType: "",
    budget: "",
    preferredArea: "",
    movingInTime: "JUST_EXPLORING",
    message: "",
};

const EnquiryModal = ({
    isOpen,
    onClose,
    propertyId,
    propertyName,
}: EnquiryModalProps) => {
    const [form, setForm] =
        useState<EnquiryForm>(initialForm);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const isPropertyEnquiry =
        Boolean(propertyId);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (
            event: KeyboardEvent,
        ) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        document.body.style.overflow = "hidden";

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
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const updateForm = <
        Key extends keyof EnquiryForm,
    >(
        field: Key,
        value: EnquiryForm[Key],
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleClose = () => {
        if (isSubmitting) return;

        setForm(initialForm);
        onClose();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!propertyId) {
            toast.error("Property ID is missing");
            return;
        }

        try {
            setIsSubmitting(true);

            const payload = {
                name: form.name.trim(),
                email: form.email.trim(),
                number: form.number.trim(),
                enquiryType: "PROPERTY",
                propertyId,
                movingInTime: form.movingInTime || undefined,
                message: form.message.trim() || undefined,
            };

            console.log("Enquiry payload:", payload);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/enquiries/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    Array.isArray(result.message)
                        ? result.message.join(", ")
                        : result.message || "Failed to submit enquiry",
                );
            }

            toast.success("Enquiry submitted successfully");
            onClose();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to submit enquiry",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-100";

    const labelClass =
        "mb-1.5 block text-sm font-medium text-gray-700";

    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
            onMouseDown={handleClose}
        >
            <div
                className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    aria-label="Close enquiry modal"
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                >
                    ×
                </button>

                <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
                    {isPropertyEnquiry
                        ? "Property enquiry"
                        : "General enquiry"}
                </p>

                <h2 className="mt-1 pr-10 text-3xl font-bold text-gray-900">
                    {isPropertyEnquiry
                        ? "Interested in this property?"
                        : "Tell us what you need"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                    {isPropertyEnquiry
                        ? "Submit your details and the property agent will contact you."
                        : "Share your requirements and an agent will help you find a suitable property."}
                </p>

                {isPropertyEnquiry && (
                    <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                        {propertyName && (
                            <p className="font-semibold text-gray-900">
                                {propertyName}
                            </p>
                        )}

                        <p className="mt-1 text-sm text-gray-500">
                            Property ID: {propertyId}
                        </p>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-7 grid gap-5 sm:grid-cols-2"
                >
                    <div>
                        <label className={labelClass}>
                            Full name
                        </label>

                        <input
                            type="text"
                            required
                            minLength={2}
                            value={form.name}
                            onChange={(event) =>
                                updateForm(
                                    "name",
                                    event.target.value,
                                )
                            }
                            placeholder="Enter your name"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Phone number
                        </label>

                        <input
                            type="tel"
                            required
                            value={form.number}
                            onChange={(event) =>
                                updateForm(
                                    "number",
                                    event.target.value,
                                )
                            }
                            placeholder="9876543210"
                            className={inputClass}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className={labelClass}>
                            Email address
                        </label>

                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(event) =>
                                updateForm(
                                    "email",
                                    event.target.value,
                                )
                            }
                            placeholder="you@example.com"
                            className={inputClass}
                        />
                    </div>

                    {/* General enquiry fields only */}
                    {!isPropertyEnquiry && (
                        <>
                            <div>
                                <label className={labelClass}>
                                    Looking to
                                    <span className="ml-1 text-xs font-normal text-gray-400">
                                        (optional)
                                    </span>
                                </label>

                                <select
                                    value={form.listingType}
                                    onChange={(event) =>
                                        updateForm(
                                            "listingType",
                                            event.target
                                                .value as ListingType,
                                        )
                                    }
                                    className={inputClass}
                                >
                                    <option value="">
                                        Not specified
                                    </option>

                                    <option value="SELL">
                                        Buy
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
                                <label className={labelClass}>
                                    Budget
                                    <span className="ml-1 text-xs font-normal text-gray-400">
                                        (optional)
                                    </span>
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={form.budget}
                                    onChange={(event) =>
                                        updateForm(
                                            "budget",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Estimated budget"
                                    className={inputClass}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClass}>
                                    Preferred area
                                    <span className="ml-1 text-xs font-normal text-gray-400">
                                        (optional)
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={form.preferredArea}
                                    onChange={(event) =>
                                        updateForm(
                                            "preferredArea",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Chembur, BKC..."
                                    className={inputClass}
                                />
                            </div>
                        </>
                    )}

                    <div
                        className={
                            isPropertyEnquiry
                                ? "sm:col-span-2"
                                : "sm:col-span-2"
                        }
                    >
                        <label className={labelClass}>
                            Moving timeline
                        </label>

                        <select
                            value={form.movingInTime}
                            onChange={(event) =>
                                updateForm(
                                    "movingInTime",
                                    event.target
                                        .value as MovingInTime,
                                )
                            }
                            className={inputClass}
                        >
                            <option value="IMMEDIATELY">
                                Immediately
                            </option>

                            <option value="WITHIN_1_MONTH">
                                Within 1 month
                            </option>

                            <option value="WITHIN_3_MONTHS">
                                Within 3 months
                            </option>

                            <option value="WITHIN_6_MONTHS">
                                Within 6 months
                            </option>

                            <option value="JUST_EXPLORING">
                                Just exploring
                            </option>
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <label className={labelClass}>
                            Message
                            <span className="ml-1 text-xs font-normal text-gray-400">
                                (optional)
                            </span>
                        </label>

                        <textarea
                            rows={4}
                            maxLength={1000}
                            value={form.message}
                            onChange={(event) =>
                                updateForm(
                                    "message",
                                    event.target.value,
                                )
                            }
                            placeholder={
                                isPropertyEnquiry
                                    ? "I would like to schedule a property visit..."
                                    : "Describe the property you are looking for..."
                            }
                            className={inputClass}
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-5 sm:col-span-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting
                                ? "Submitting..."
                                : "Submit Enquiry"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EnquiryModal;