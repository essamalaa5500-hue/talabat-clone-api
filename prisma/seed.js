const seed = require("./seeds");

seed()
  .then(() => {
    console.log("🌱 Database seeded successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
