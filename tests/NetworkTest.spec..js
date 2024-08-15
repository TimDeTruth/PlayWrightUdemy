const { expect, test, request } = require("@playwright/test");
const { APIUtils } = require("../util/APIUtils");

const loginPayload = {
  userEmail: "anshika@gmail.com",
  userPassword: "Iamking@000",
};

const orderPayload = {
  orders: [
    {
      country: "Australia",
      productOrderedId: "6581cade9fd99c85e8ee7ff5",
    },
  ],
};

const fakePayLoadOrders = { data: [], message: "No Orders" };

let response;

test.beforeAll(async () => {
  const apiContext = await request.newContext(); //we also make a new context like browser
  const apiUtils = new APIUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
});

test("@Web Client App login Plac an order ", async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);

  await page.goto("https://rahulshettyacademy.com/client");

  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/620c7bf148767f1f1215d2ca",
    async (route) => {
      //intercepting the response - API gives gave reponse -> (intercepting and injecting fake here) browser->render data on front end
      const response = await page.request.fetch(route.request()); // catch the response

      let body = JSON.stringify(fakePayLoadOrders);
      route.fulfill({
        response, //send back the same response but override the body
        body,
      });
    }
  );

  await page.locator("button[routerlink*='myorders']").click();
  await page.waitForResponse(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*"
  );

  // await page.pause();
  console.log(await page.locator(".mt-4").textContent());
});
