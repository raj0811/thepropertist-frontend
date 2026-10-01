import { useEffect, useState } from "react";

interface Hotel {
    hotelId: string;
    name: string;
    price: number;
    city: string;
    commissionPct: number;
    supplier: string;
}

const API_URL = "http://localhost:4000/api/hotels";

export default function HotelList() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [city, setCity] = useState("delhi");
    const [minPrice, setMinPrice] = useState("5000");
    const [maxPrice, setMaxPrice] = useState("7000");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchHotels = async () => {
        try {
            setError("");

            const min = Number(minPrice);
            const max = Number(maxPrice);

            if (min > max) {
                setError("Minimum price cannot be greater than maximum price.");
                setHotels([]);
                return;
            }

            setLoading(true);

            const params = new URLSearchParams({
                city,
                minPrice,
                maxPrice,
            });

            const response = await fetch(`${API_URL}?${params}`);

            if (!response.ok) {
                throw new Error("Failed to fetch hotels");
            }

            const data = await response.json();

            setHotels(data);
        } catch (error) {
            console.error("Hotel fetch error:", error);
            setError("Unable to load hotels. Please try again.");
            setHotels([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
                        Hotel Offer Orchestrator
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Find your perfect hotel
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Compare hotel offers from multiple suppliers.
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-4">
                        {/* City */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                City
                            </label>

                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Enter city"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Min Price */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Minimum Price
                            </label>

                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="5000"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Max Price */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Maximum Price
                            </label>

                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="7000"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Search */}
                        <div className="flex items-end">
                            <button
                                onClick={fetchHotels}
                                disabled={loading}
                                className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Searching..." : "Search Hotels"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Result Header */}
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Available Hotels
                        </h2>

                        {!loading && (
                            <p className="mt-1 text-sm text-slate-500">
                                {hotels.length} hotels found in{" "}
                                <span className="font-medium capitalize">{city}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className="h-64 animate-pulse rounded-2xl bg-slate-200"
                            />
                        ))}
                    </div>
                )}

                {/* Hotels */}
                {!loading && hotels.length > 0 && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {hotels.map((hotel) => (
                            <div
                                key={hotel.hotelId}
                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                            >
                                {/* Hotel Image Placeholder */}
                                <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600">
                                    <span className="text-5xl">🏨</span>

                                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
                                        {hotel.supplier}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-slate-900">
                                            {hotel.name}
                                        </h3>

                                        <p className="mt-1 text-sm capitalize text-slate-500">
                                            📍 {hotel.city}
                                        </p>
                                    </div>

                                    <div className="flex items-end justify-between border-t border-slate-100 pt-4">
                                        <div>
                                            <p className="text-xs text-slate-500">Price per night</p>

                                            <p className="mt-1 text-xl font-bold text-indigo-600">
                                                {formatPrice(hotel.price)}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-slate-500">Commission</p>

                                            <p className="mt-1 text-sm font-semibold text-emerald-600">
                                                {hotel.commissionPct}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && hotels.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                        <div className="text-4xl">🏨</div>

                        <h3 className="mt-4 text-lg font-semibold text-slate-900">
                            No hotels found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Try changing your city or price range.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}