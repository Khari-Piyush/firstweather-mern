import mongoose from "mongoose";

// Canonical category names — single source of truth for enum + seeding
export const CATEGORY_NAMES = [
  "Wiper Blades",
  "Wiper Arms",
  "Wiper Linkage Assemblies",
  "Wiper Motors",
  "Wiper Motor Gear",
  "Wiper Wheel Box",
  "Wiper Rods",
  "Complete Wiper Kits",
  "Bus Wiper Systems",
  "Wiper Spare Parts",
];
// Seed data — used by the /seed endpoint and the migration script
export const SEED_CATEGORIES = [
  {
    name: "Wiper Blades",
    slug: "wiper-blades",
    description: "Replacement wiper blades for commercial and passenger vehicles.",
    order: 1,
  },
  {
    name: "Wiper Arms",
    slug: "wiper-arms",
    description: "Heavy-duty wiper arms compatible with all major vehicle brands.",
    order: 2,
  },
  {
    name: "Wiper Linkage Assemblies",
    slug: "wiper-linkage-assemblies",
    description: "Complete linkage assemblies for smooth wiper operation.",
    order: 3,
  },
  {
    name: "Wiper Motors",
    slug: "wiper-motors",
    description: "Reliable wiper motors for buses, trucks, and commercial vehicles.",
    order: 4,
  },
  {
    name: "Wiper Motor Gear",
    slug: "wiper-motor-gear",
    description: "Gear assemblies and components for wiper motor systems.",
    order: 5,
  },
  {
    name: "Wiper Wheel Box",
    slug: "wiper-wheel-box",
    description: "Wheel box components for wiper pivot and transmission systems.",
    order: 6,
  },
  {
    name: "Wiper Rods",
    slug: "wiper-rods",
    description: "Connecting rods for wiper linkage and drive systems.",
    order: 7,
  },
  {
    name: "Complete Wiper Kits",
    slug: "complete-wiper-kits",
    description: "Full wiper system kits including all components for easy installation.",
    order: 8,
  },
  {
    name: "Bus Wiper Systems",
    slug: "bus-wiper-systems",
    description: "Complete wiper system solutions designed for buses.",
    order: 9,
  },
  {
    name: "Wiper Spare Parts",
    slug: "wiper-spare-parts",
    description: "Individual spare parts and accessories for all wiper systems.",
    order: 10,
  },
];

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    catalogPdfUrl: { type: String, default: null },
    order: { type: Number, default: 99 },
  },
  { timestamps: true }
);

categorySchema.index({ order: 1 });

const Category = mongoose.model("Category", categorySchema);
export default Category;
