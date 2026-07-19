type Property = {
    id: number;
    title: string;
    location: string;
    price: string;
    type: string;
    bedrooms: number;
    area: string;
    image: string;
};

export const properties: Property[] = [
    {
        id: 1,
        title: "Modern Family Apartment",
        location: "Chembur, Mumbai",
        price: "₹1.25 Cr",
        type: "Apartment",
        bedrooms: 2,
        area: "950 sq. ft.",
        image:
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: 2,
        title: "Premium City Residence",
        location: "Powai, Mumbai",
        price: "₹2.10 Cr",
        type: "Apartment",
        bedrooms: 3,
        area: "1,350 sq. ft.",
        image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: 3,
        title: "Peaceful Independent Villa",
        location: "Thane West, Mumbai",
        price: "₹3.40 Cr",
        type: "Villa",
        bedrooms: 4,
        area: "2,400 sq. ft.",
        image:
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: 4,
        title: "Compact Urban Home",
        location: "Andheri East, Mumbai",
        price: "₹95 Lakh",
        type: "Apartment",
        bedrooms: 1,
        area: "620 sq. ft.",
        image:
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: 5,
        title: "Spacious Garden Villa",
        location: "Navi Mumbai",
        price: "₹2.75 Cr",
        type: "Villa",
        bedrooms: 3,
        area: "1,900 sq. ft.",
        image:
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: 6,
        title: "Ready-to-Move Apartment",
        location: "Ghatkopar, Mumbai",
        price: "₹1.45 Cr",
        type: "Apartment",
        bedrooms: 2,
        area: "1,020 sq. ft.",
        image:
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
    },
];