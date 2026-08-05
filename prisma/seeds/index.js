const seedAdmin = require("./admin.seed");

const seedUsers = require("./users.seed");
const seedDrivers = require("./drivers.seed");

const seedRestaurantCuisines = require("./cuisines.seed");

const seedRestaurants = require("./restaurants.seed");

const seedBranches = require("./branches.seed");
const seedAddresses = require("./addresses.seed");
const seedWorkingHours = require("./working-hours.seed");

const seedMenuCategories = require("./menu-categories.seed");

const seedProducts = require("./products.seed");
const seedProductVariants = require("./productVariants.seed");
const seedProductOptions = require("./productOptions.seed");
const seedProductOptionValues = require("./productOptionValues.seed");
const seedProductImages = require("./productImages.seed");

const seedCoupons = require("./coupons.seed");

async function seed() {
  try {
    console.log(" Starting database seeding...\n");

    await seedAdmin();
    await seedUsers();
    await seedDrivers();

    await seedRestaurants();
    await seedRestaurantCuisines();

    await seedBranches();
    await seedAddresses();
    await seedMenuCategories();
    await seedWorkingHours();

    await seedProducts();
    await seedProductVariants();
    await seedProductOptions();
    await seedProductOptionValues();
    await seedProductImages();

    await seedCoupons();

    console.log("\n Database seeded successfully");
  } catch (error) {
    console.error(" Seeding failed");
    console.error(error);
    process.exit(1);
  }
}

seed();
