/**
 * Category migration script — maps legacy "F.W ..." product categories
 * to the 11 canonical category names.
 *
 * Usage (from the firstweather-app/firstweather-app/ directory):
 *
 *   Dry run (preview only — no writes):
 *     DRY_RUN=true node --env-file=backend/.env backend/scripts/migrateCategories.improved.js
 *
 *   Live run (updates MongoDB):
 *     node --env-file=backend/.env backend/scripts/migrateCategories.improved.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "backend/.env" });

const DRY_RUN = process.env.DRY_RUN === "true";

// Mapping: legacy value (trimmed, lowercase for matching) → new canonical name
const MIGRATION_MAP = {
  "f.w wiper blade":              "Wiper Blades",
  "f.w wiper blades":             "Wiper Blades",
  "f.w wiper arm":                "Wiper Arms",
  "f.w wiper arms":               "Wiper Arms",
  "f.w wiper linkage":            "Wiper Linkage Assemblies",
  "f.w wiper linkage assembly":   "Wiper Linkage Assemblies",
  "f.w wiper linkage assemblies": "Wiper Linkage Assemblies",
  "f.w wiper motor gear":         "Wiper Motor Gear",
  "f.w wiper motor":              "Wiper Motors",
  "f.w wiper motors":             "Wiper Motors",
  "f.w wiper wheel box":          "Wiper Wheel Box",
  "f.w wiper rod":                "Wiper Rods",
  "f.w wiper rods":               "Wiper Rods",
  "f.w power window accessories": "Wiper Spare Parts",
  "f.w wiper kit":                "Complete Wiper Kits",
  "f.w wiper kits":               "Complete Wiper Kits",
  "f.w complete wiper kit":       "Complete Wiper Kits",
};

// New canonical names — products already using these are skipped
const CANONICAL = new Set([
  "Wiper Blades",
  "Wiper Arms",
  "Wiper Linkage Assemblies",
  "Wiper Motors",
  "Wiper Motor Gear",
  "Wiper Wheel Box",
  "Wiper Rods",
  "Complete Wiper Kits",
  "Bus Wiper Systems",
  "Truck Wiper Systems",
  "Wiper Spare Parts",
]);

async function run() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Run with --env-file=backend/.env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.\n");

  const collection = mongoose.connection.collection("products");
  const all = await collection.find({}, { projection: { _id: 1, productName: 1, category: 1 } }).toArray();

  console.log(`Total products: ${all.length}`);
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (no writes)" : "LIVE (will write)"}\n`);

  const toUpdate = [];
  const alreadyCanonical = [];
  const unmapped = [];
  const noCategory = [];

  for (const doc of all) {
    if (!doc.category) {
      noCategory.push(doc);
      continue;
    }

    const key = doc.category.trim().toLowerCase();

    if (CANONICAL.has(doc.category.trim())) {
      alreadyCanonical.push(doc);
      continue;
    }

    const newName = MIGRATION_MAP[key];
    if (newName) {
      toUpdate.push({ _id: doc._id, productName: doc.productName, from: doc.category, to: newName });
    } else {
      unmapped.push(doc);
    }
  }

  // Report
  console.log(`Already using canonical names: ${alreadyCanonical.length}`);
  console.log(`Will be updated:               ${toUpdate.length}`);
  console.log(`No category set:               ${noCategory.length}`);
  console.log(`Unmapped (need manual review): ${unmapped.length}\n`);

  if (toUpdate.length > 0) {
    console.log("── Updates ──────────────────────────────────────");
    for (const u of toUpdate) {
      console.log(`  "${u.productName}"  ·  "${u.from}"  →  "${u.to}"`);
    }
    console.log("");
  }

  if (unmapped.length > 0) {
    console.log("── Unmapped (no change applied) ────────────────");
    for (const u of unmapped) {
      console.log(`  "${u.productName}"  ·  category = "${u.category}"`);
    }
    console.log("");
  }

  if (DRY_RUN) {
    console.log("DRY RUN complete — no documents written.");
    await mongoose.disconnect();
    return;
  }

  // Apply updates
  let updated = 0;
  for (const u of toUpdate) {
    await collection.updateOne({ _id: u._id }, { $set: { category: u.to } });
    updated++;
  }

  console.log(`Migration complete. Updated ${updated} product(s).`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
