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
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortOrder, setSortOrder] = useState("default");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchHotels = async () => {
        try {
            setError("");

            const min = minPrice ? Number(minPrice) : undefined;
            const max = maxPrice ? Number(maxPrice) : undefined;

            if (min !== undefined && max !== undefined && min > max) {
                setError("Minimum price cannot be greater than maximum price.");
                setHotels([]);
                return;
            }

            setLoading(true);

            const params = new URLSearchParams();

            if (city.trim()) {
                params.append("city", city.trim());
            }

            if (minPrice) {
                params.append("minPrice", minPrice);
            }

            if (maxPrice) {
                params.append("maxPrice", maxPrice);
            }

            const response = await fetch(`${API_URL}?${params.toString()}`);

            if (!response.ok) {
                throw new Error("Failed to fetch hotels");
            }

            const data: Hotel[] = await response.json();

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

    const resetFilters = () => {
        setCity("delhi");
        setMinPrice("");
        setMaxPrice("");
        setSortOrder("default");
        setError("");

        setTimeout(() => {
            fetchHotels();
        }, 0);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const sortedHotels = [...hotels].sort((a, b) => {
        if (sortOrder === "asc") {
            return a.price - b.price;
        }

        if (sortOrder === "desc") {
            return b.price - a.price;
        }

        return 0;
    });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-5">
                    <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                        Hotel Offer Orchestrator
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900">
                        Hotel Offers
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Compare hotel offers from multiple suppliers.
                    </p>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                {/* Filters */}
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Search Hotels
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Filter hotel offers by city and optional price range.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-5">
                        {/* City */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                City
                            </label>

                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. Delhi"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Minimum Price */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Minimum Price
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="No minimum"
                                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${error
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                                    }`}
                            />
                        </div>

                        {/* Maximum Price */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Maximum Price
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="No maximum"
                                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${error
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                                    }`}
                            />
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Sort By
                            </label>

                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="default">Default</option>
                                <option value="asc">
                                    Price: Low to High
                                </option>
                                <option value="desc">
                                    Price: High to Low
                                </option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-end gap-2">
                            <button
                                type="button"
                                onClick={fetchHotels}
                                disabled={loading}
                                className="flex-1 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Searching..." : "Search"}
                            </button>

                            <button
                                type="button"
                                onClick={resetFilters}
                                disabled={loading}
                                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            ⚠ {error}
                        </div>
                    )}
                </div>

                {/* Results Header */}
                <div className="mb-4 flex items-end justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Available Hotels
                        </h2>

                        {!loading && (
                            <p className="mt-1 text-sm text-slate-500">
                                {sortedHotels.length}{" "}
                                {sortedHotels.length === 1
                                    ? "hotel"
                                    : "hotels"}{" "}
                                found in{" "}
                                <span className="font-medium capitalize text-slate-700">
                                    {city || "all cities"}
                                </span>
                            </p>
                        )}
                    </div>

                    {!loading && sortedHotels.length > 0 && (
                        <div className="hidden rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 sm:block">
                            {sortOrder === "asc"
                                ? "Price: Low to High"
                                : sortOrder === "desc"
                                    ? "Price: High to Low"
                                    : "Default order"}
                        </div>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="animate-pulse">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className="flex gap-6 border-b border-slate-100 p-5 last:border-0"
                                >
                                    <div className="h-5 w-32 rounded bg-slate-200" />
                                    <div className="h-5 w-24 rounded bg-slate-200" />
                                    <div className="h-5 w-24 rounded bg-slate-200" />
                                    <div className="h-5 w-20 rounded bg-slate-200" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hotel Table */}
                {!loading && sortedHotels.length > 0 && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px] text-left">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Hotel
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            City
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Supplier
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Price
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Commission
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Hotel ID
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {sortedHotels.map((hotel) => (
                                        <tr
                                            key={hotel.hotelId}
                                            className="transition hover:bg-slate-50"
                                        >
                                            {/* Hotel */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">
                                                        🏨
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {hotel.name}
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-slate-400">
                                                            Hotel offer
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* City */}
                                            <td className="px-6 py-5">
                                                <span className="capitalize text-sm text-slate-600">
                                                    {hotel.city}
                                                </span>
                                            </td>

                                            {/* Supplier */}
                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${hotel.supplier ===
                                                            "Supplier A"
                                                            ? "bg-blue-50 text-blue-700"
                                                            : "bg-purple-50 text-purple-700"
                                                        }`}
                                                >
                                                    {hotel.supplier}
                                                </span>
                                            </td>

                                            {/* Price */}
                                            <td className="px-6 py-5">
                                                <span className="text-base font-bold text-slate-900">
                                                    {formatPrice(hotel.price)}
                                                </span>

                                                <p className="mt-0.5 text-xs text-slate-400">
                                                    per night
                                                </p>
                                            </td>

                                            {/* Commission */}
                                            <td className="px-6 py-5">
                                                <span className="font-semibold text-emerald-600">
                                                    {hotel.commissionPct}%
                                                </span>
                                            </td>

                                            {/* Hotel ID */}
                                            <td className="px-6 py-5">
                                                <code className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                                                    {hotel.hotelId}
                                                </code>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3">
                            <p className="text-xs text-slate-500">
                                Showing{" "}
                                <span className="font-semibold text-slate-700">
                                    {sortedHotels.length}
                                </span>{" "}
                                hotel offers
                            </p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && sortedHotels.length === 0 && (
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
            </main>
        </div>
    );
}