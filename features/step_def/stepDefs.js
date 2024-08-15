const { Given, When, Then } = require("@cucumber/cucumber");
const { POManager } = require("../../pageobjects/POManager");
const { test, expect } = require("@playwright/test");
const playwright = require("@playwright/test");
Given(
  "a login to Ecommerce applicaiton with {string} and {string}",
  { timeout: 100 * 1000 },
  async function (username, password) {
    // Write code here that turns the phrase above into concrete actions

    // const browser = await playwright.chromium.launch({
    //   headless: false,
    // });
    // const context = await browser.newContext();
    // this.page = await context.newPage();
    // this.poManager = new POManager(page);

    const products = this.page.locator(".card-body");
    const loginPage = this.poManager.getLoginPage();
    await loginPage.goToLoginPage();
    await loginPage.validLogin(username, password);
  }
);

When("Add {string} to Cart", async function (productName) {
  // Write code here that turns the phrase above into concrete actions
  this.dashboardPage = this.poManager.getDashboardPage();
  await this.dashboardPage.searchProductAddToCart(productName);
  await this.dashboardPage.navigateToCart();
});

Then("Verify {string} is displayed in the Cart", async function (productName) {
  // Write code here that turns the phrase above into concrete actions
  const cartPage = this.poManager.getCartPage();
  await cartPage.VerifyProductIsDisplayed(productName);
  await cartPage.Checkout();
});
When("Enter valid details and Place the Order", async function () {
  // Write code here that turns the phrase above into concrete actions
  const ordersReviewPage = this.poManager.getOrdersReviewPage();
  await ordersReviewPage.searchCountryAndSelect("ind", "India");
  const orderId = await ordersReviewPage.SubmitAndGetOrderId();
  console.log(orderId);

  return "pending";
});

Then("Verify order is present in the OrderHistory", async function () {
  // Write code here that turns the phrase above into concrete actions
  this.dashboardPage.navigateToOrders();
  const ordersHistoryPage = this.poManager.getOrdersHistoryPage();
  await ordersHistoryPage.searchOrderAndSelect(orderId);
  expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();

  return "pending";
});

Given(
  "a login to Ecommerce2 applicaiton with {string} and {string}",
  async function (username, password) {
    // Write code here that turns the phrase above into concrete actions

    await this.page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await this.page.locator("#username").fill(username);
    await this.page.locator("[type='password']").fill(password);
    await this.page.locator("#signInBtn").click();
  }
);

Then("Verify error mesage is displayed", async function () {
  console.log(await this.page.locator("[style*='block']").textContent());
  await expect(this.page.locator("[style*='block']")).toContainText(
    "Incorrect"
  );
});
