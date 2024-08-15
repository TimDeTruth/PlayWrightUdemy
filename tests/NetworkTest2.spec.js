const { expect, test, request } = require("@playwright/test");
const { APIUtils } = require("../util/APIUtils");

test("securite test queust incerpt", async ({ page }) => {
  //login and reach orders page
  await page.goto("https://rahulshettyacademy.com/client");

  const email = "anshika@gmail.com";
  await page.locator("#userEmail").fill(email);
  await page.locator("#userPassword").type("Iamking@000");
  await page.locator("[value='Login']").click();
  await page.waitForLoadState("networkidle");

  await page.locator("button[routerlink*='myorders']").click();

  // prepare intercept  after clicing the butotn, * for a regex for any, when encounter this url, intercept, interally we tweak and give anotehr id
  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    (route) =>
      route.continue({
        url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=31241", //not a l URL
      })
  );

  await page.locator("button:has-text('View')").first().click();

  await expect(page.locator("p").last()).toHaveText(
    "You are not authorize to view this order"
  );
});
