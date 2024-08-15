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

// //accessible to all the tests
// let token;
// //a global orderID to test
// let orderId;

//replace with response
let response;

test.beforeAll(async () => {
  const apiContext = await request.newContext(); //we also make anew context like browser
  const apiUtils = new APIUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
  //   //Login API call
  //   const apiContext = await request.newContext(); //we also make anew context like browser
  //   const loginResponse = await apiContext.post(
  //     "https://rahulshettyacademy.com/api/ecom/auth/login",
  //     {
  //       data: loginPayload,
  //     }
  //   );
  //   //assertion that we get a 200 code
  //   expect(loginResponse.ok).toBeTruthy;
  //   //grabbing the response body,
  //   const loginResponseJson = await loginResponse.json();
  //   //now we need to parse the respone and EXTRACT the token out of the response
  //   /*eg this is the response
  //     {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjBjN2JmMTQ4NzY3ZjFmMTIxNWQyY2EiLCJ1c2VyRW1haWwiOiJhbnNoaWthQGdtYWlsLmNvbSIsInVzZXJNb2JpbGUiOjk4NzY1NDMyMTAsImlhdCI6MTcxMTc4MjU1MiwiZXhwIjoxNzQzMzQwMTUyfQ.p-Pz9d8EOGeaPl4IarjZGJqykPusc5N2cHaCRvt4tVQ",
  //     "userId": "620c7bf148767f1f1215d2ca",
  //     "message": "Login Successfully"}*/
  //   //so we can access the token via using the loginResponseJson object dot .token
  //   token = loginResponseJson.token;
  //   console.log("the token: " + token);
  //   //order API call
  //   const orderResponse = await apiContext.post(
  //     "https://rahulshettyacademy.com/api/ecom/order/create-order",
  //     {
  //       data: orderPayload,
  //       headers: {
  //         Authorization: token,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   const orderReponseJson = await orderResponse.json();
  //   console.log(orderReponseJson.orders[0]);
  //   orderID = orderReponseJson.orders[0];
});

test("@Web Client App login Plac an order ", async ({ page }) => {
  //bypasses /client and goes straight to /dashboard
  //we do a JS mehtod here to insert into session storage
  //inserting a script function, which takes an arugemnt called value, and write the code to insert the item in local storage
  //addInitScript takes (annoymous funciton, string)
  // the function value (ie the token), is sent as a second arugment. whcih is  addinitiscrpt contet:

  //   page.addInitScript((value) => {
  //     window.localStorage.setItem("token", value);
  //   }, token);

  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);

  await page.goto("https://rahulshettyacademy.com/client");

  const productName = "zara coat 3";
  const products = page.locator(".card-body");

  await page.locator(".card-body b").first().waitFor();

  const titles = await page.locator(".card-body b").allTextContents();
  console.log(titles);
  const count = await products.count();
  for (let i = 0; i < count; ++i) {
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      //add to cart
      await products.nth(i).locator("text= Add To Cart").click();
      break;
    }
  }

  //   await page.locator("[routerlink*='cart']").click();
  //   //await page.pause();

  //   await page.locator("div li").first().waitFor();
  //   const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
  //   expect(bool).toBeTruthy();
  //   await page.locator("text=Checkout").click();

  //   await page.locator("[placeholder*='Country']").pressSequentially("ind");
  //   const dropdown = page.locator(".ta-results");
  //   await dropdown.waitFor();
  //   const optionsCount = await dropdown.locator("button").count();
  //   for (let i = 0; i < optionsCount; ++i) {
  //     const text = await dropdown.locator("button").nth(i).textContent();
  //     if (text === " India") {
  //       await dropdown.locator("button").nth(i).click();
  //       break;
  //     }
  //   }

  //   expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
  //   await page.locator(".action__submit").click();
  //   await expect(page.locator(".hero-primary")).toHaveText(
  //     " Thankyou for the order. "
  //   );
  //   const orderId = await page
  //     .locator(".em-spacer-1 .ng-star-inserted")
  //     .textContent();
  //   console.log(orderId);

  await page.locator("button[routerlink*='myorders']").click();
  await page.locator("tbody").waitFor();
  const rows = await page.locator("tbody tr");

  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    // if (orderId.includes(rowOrderId)) {//replaced
    if (response.orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator(".col-text").textContent();
  //   expect(orderId.includes(orderIdDetails)).toBeTruthy();
  expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
});

//verify if order is creaed and shows in history page
//precondition to create an order
