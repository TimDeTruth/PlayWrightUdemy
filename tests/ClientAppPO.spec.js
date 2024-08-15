const { test, expect } = require("@playwright/test");
// const { customTest } = require("../util/test-base");
// const { DashboardPage } = require("../pageobjects/DashboardPage");
// const { LoginPage } = require("../pageobjects/LoginPage").default;

const dataset = JSON.parse(
  JSON.stringify(require("../util/placeorderTestData.json"))
);

const { POManager } = require("../pageobjects/POManager");

for (const data of dataset) {
  test(`@Web Client App login ${data.productName}`, async ({ page }) => {
    //PO JS file

    // const email = "anshika@gmail.com";
    // const password = "Iamking@000";
    // const productName = "zara coat 3";

    const poManager = new POManager(page);

    const loginPage = poManager.getLoginPage();
    await loginPage.goToLoginPage();
    await loginPage.validLogin(data.email, data.password);

    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddToCart(data.productName);
    await dashboardPage.navigateToCart();

    await page.pause();

    await page.locator("div li").first().waitFor();
    const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
    expect(bool).toBeTruthy();
    await page.locator("text=Checkout").click();

    await page.locator("[placeholder*='Country']").pressSequentially("ind");

    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator("button").count();
    for (let i = 0; i < optionsCount; ++i) {
      const text = await dropdown.locator("button").nth(i).textContent();
      if (text === " India") {
        await dropdown.locator("button").nth(i).click();
        break;
      }
    }

    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor(); // since the table takes time to show, make this asynchronous.

    //parent to child = 16 rows matched
    const rows = await page.locator("tbody tr");

    for (let i = 0; i < (await rows.count()); ++i) {
      const rowOrderId = await rows.nth(i).locator("th").textContent(); //row with ID
      if (orderId.includes(rowOrderId)) {
        await rows.nth(i).locator("button").first().click(); //click the "View" button
        break;
      }
    }
    const orderIdDetails = await page.locator(".col-text").textContent(); //textContent() has autowait rememebr
    expect(orderId.includes(orderIdDetails)).toBeTruthy(); //aseert the orderID matches one you got before.

    //full E2E
  });
}

//a custom test object
// customTest(`@Client App login`, async ({ page, testDataForOrder }) => {
//   //getting from fixtures
//   const poManager = new POManager(page);

//   const loginPage = poManager.getLoginPage();
//   await loginPage.goToLoginPage();
//   await loginPage.validLogin(testDataForOrder.email, testDataForOrder.password);

//   const dashboardPage = poManager.getDashboardPage();
//   await dashboardPage.searchProductAddToCart(testDataForOrder.productName);
//   await dashboardPage.navigateToCart();

//   await page.pause();
// });
