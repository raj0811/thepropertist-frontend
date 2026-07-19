import axios from "axios";
import {
    useEffect,
    useState,
} from "react";
import { toast } from "react-toastify";

type DeletePropertyModalProps = {
    isOpen: boolean;
    propertyId: string | null;
    propertyName?: string;
    onClose: () => void;
    onSuccess: () => void;
};

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";

const CONFIRMATION_TEXT = "i am sure";

const DeletePropertyModal = ({
    isOpen,
    propertyId,
    propertyName,
    onClose,
    onSuccess,
}: DeletePropertyModalProps) => {
    const [confirmation, setConfirmation] =
        useState("");

    const [isDeleting, setIsDeleting] =
        useState(false);

    useEffect(() => {
        if (isOpen) {
            setConfirmation("");
        }
    }, [isOpen]);

    if (!isOpen || !propertyId) {
        return null;
    }

    const isConfirmed =
        confirmation.trim().toLowerCase() ===
        CONFIRMATION_TEXT;

    const handleDelete = async () => {
        if (!isConfirmed) {
            toast.error(
                `Type "${CONFIRMATION_TEXT}" to continue`,
            );
            return;
        }

        try {
            setIsDeleting(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                toast.error(
                    "Please log in to delete a property",
                );
                return;
            }

            await axios.delete(
                `${API_URL}/properties/delete/${propertyId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            toast.success(
                "Property deleted successfully",
            );

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
                        "Unable to delete property",
                );
            } else {
                toast.error(
                    "Unable to delete property",
                );
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-600">
                    !
                </div>

                <h2 className="mt-5 text-2xl font-bold text-gray-900">
                    Delete property?
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                    You are about to permanently delete{" "}
                    <span className="font-semibold text-gray-900">
                        {propertyName || "this property"}
                    </span>
                    . This action cannot be undone.
                </p>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">
                        Type{" "}
                        <span className="font-bold text-red-600">
                            {CONFIRMATION_TEXT}
                        </span>{" "}
                        to confirm
                    </label>

                    <input
                        type="text"
                        autoFocus
                        autoComplete="off"
                        value={confirmation}
                        onChange={(event) =>
                            setConfirmation(event.target.value)
                        }
                        placeholder={CONFIRMATION_TEXT}
                        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />
                </div>

                <div className="mt-7 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={!isConfirmed || isDeleting}
                        className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {isDeleting
                            ? "Deleting..."
                            : "Delete Property"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeletePropertyModal;