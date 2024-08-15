// const { base } = require("@playwright/test");
// //visible to all my test files

// module.exports.customtest = base.test.extend({
//   testDataForOrder: {
//     username: "anshika@gmail.com",
//     password: "Iamking@000",
//     productName: "adidas original",
//   },
// });
const { base } = require("@playwright/test");

// Define the custom test
const customTest = base.test.extend({
  testDataForOrder: {
    username: "anshika@gmail.com",
    password: "Iamking@000",
    productName: "adidas original",
  },
});

// Export the custom test
module.exports = customTest;
