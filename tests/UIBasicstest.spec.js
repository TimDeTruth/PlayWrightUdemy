const { test, expect } = require("@playwright/test"); //import playwright module

// async()=> same as fucntion() same as ananomouy fucntion
//{} for browser, else passing in a variable browser right
test("First Playwright test", async ({ browser, page }) => {
  //chrome create an instanc, a context, fresh browser instance,
  // const context = await browser.newContext();
  // const page = (await context).newPage();
  await page.goto("https://www.google.com/");
  // console.log(await page.title());
  await expect(page).toHaveTitle("Google");
});

test.describe.configure({ mode: "parallel" });
test("Rahul Website test", async ({ browser, page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  //css selector, type or fill method after locating, but type is dprecated
  const username = page.locator("#username");
  const signIn = page.locator("#signInBtn");
  const cardTitles = page.locator(".card-body a");

  await page.locator("#username").fill("rahulshetty");
  await page.locator("[type='password']").fill("learning");
  await page.locator("#signInBtn").click();

  //has intelligent waiting, cause the error message takes some time
  console.log(await page.locator("[style*='block']").textContent());
  await expect(page.locator("[style*='block']")).toContainText("Incorrect");

  await username.fill("");
  await username.fill("rahulshettyacademy");
  await page.locator("#signInBtn").click();

  //getting the cards
  // console.log(await page.locator(".card-body a").nth(0).textContent());

  // console.log(await cardTitles.first().textContent());
  // console.log(await cardTitles.nth(0).textContent());
  //get all the cardstitles
  const allTitle = await cardTitles.allTextContents();

  console.log(allTitle);
});

test("@Web Dropdown", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const username = page.locator("#username");
  const signIn = page.locator("#signInBtn");
  const dropwdown = page.locator("select.form-control");
  const radioButtionUser = page.locator(".radiotextsty").last();
  const documentLink = page.locator("[href*='documents-request']");

  await dropwdown.selectOption("consult");
  await radioButtionUser.click();

  await page.locator("#okayBtn").click();

  //console loggin boolean
  console.log(await radioButtionUser.isChecked());

  //assertion
  await expect(radioButtionUser).toBeChecked();

  await page.locator("#terms").click();
  await expect(page.locator("#terms")).toBeChecked();

  await page.locator("#terms").uncheck();
  expect(await page.locator("#terms").isChecked()).toBeFalsy();

  await expect(documentLink).toHaveAttribute("class", "blinkingText");
  await page.pause();
});

//new tabs
test("@Web Child windows", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const documentLink = page.locator("[href*='documents-request']");

  const [newPage] = await Promise.all([
    context.waitForEvent("page"), //listen for any new pages to open
    documentLink.click(), //new page is opened
  ]);

  //searching the child window now
  const text = await newPage.locator(".red").textContent();
  console.log(text);

  //split sotres in aray, 0 is left side of @ and 1 is right side of @
  const arrayText = text.split("@");
  const domain = arrayText[1].split(" ")[0];
  console.log(domain);

  //
  const username = await page.locator("#username");
  await username.fill(domain + "123");

  await page.pause();
  console.log(await username.textContent());
});

test("Client Login", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client");
  const userEmail = page.locator("#userEmail");
  const emailEntered = "anshika@gmail.com";
  const userPassword = page.locator("#userPassword");

  await userEmail.fill("anshika@gmail.com");
  await userPassword.fill("Iamking@000");

  const products = page.locator(".card-body");
  const cart = page.locator("[routerlink*='cart']");

  await page.locator("input.btn").click();
  await page.waitForLoadState("domcontentloaded");

  const title = await page.locator(".card-body b").allTextContents();
  console.log(title);
  //zara coat 4
  // await page.locator("text='ZARA COAT 3'");//by isolating and doing it by text
  /**
   * but we can look for all the same cards, then extract the nth, via parent to child
   */

  // iterate through and check if title matches
  const count = await products.count();
  const productName = "ZARA COAT 3";
  for (let i = 0; i < count; i++) {
    // products.nth(i).toContainText(productName);//just and idea i had that might work
    // if(await products.nth(i).locator("b").toContainText(productName)){
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      // await page.waitForTimeout(3000);

      //add product to cart, the scope is only within the products.nth(i) scope
      await products.nth(i).locator("button.btn.w-10.rounded").click();
      // await products.nth(i).locator("text= Add To Cart").click();
      await page.waitForTimeout(3000);

      break; //exit the for loop when we found, we dont need to iterate anymore
    }
  }

  await cart.click();
  // await cart.waitFor().then(await cart.click());
  // await cart
  //   .locator(cart)
  //   .isVisible()
  //   .then(await cart.click());

  // await page.locator("div li").first().waitFor(); //how to search if an element is not elgible for auto wait

  const coatIsAdded = await products
    .locator("h3:has-text('ZARA COAT 3')")
    .isVisible(); //check if the item was added
  expect(coatIsAdded).toBeTruthy(); //assertion to make sure its true

  await page.locator("text=Checkout").click();
  await page
    .locator("[placeholder*='Select Country']")
    .pressSequentially("ind"); //dropdown now drops down and shows us

  const dropdownOptions = page.locator(".ta-results");
  await dropdownOptions.waitFor();
  const dropdownOptionsCount = page.locator("button").count();

  for (let i = 0; i < dropdownOptionsCount; i++) {
    const text = await dropdownOptions.locator("button").nth(i).textContent;

    //cases sensitive, there is a space in the HTML lol, can use .trim(), or .includes
    if (text === " India") {
      await dropdownOptions.locator("button").nth(i).click();
      break;
    }
  }

  //verify the email used to login is the same displayed on checkout
  await expect(page.locator(".user_name [type='text']").first()).toHaveText(
    emailEntered
  );

  //go to sucessful page
  await page.locator(".action_submit").click();

  //assertion
  await expect(
    await page.locator(".hero-primary").toHaveText(" Thankyou for the order. ")
  );

  //print out order ID paretn tranverse to child, grab the text, store then prin
  const orderID = await page.locator(".em-spacer-1 ng-star-inserted")
    .textContent;
  console.log("the user orderid = " + orderID);
});

test("@Client App login", async ({ page }) => {
  //js file- Login js, DashboardPage
  const email = "anshika@gmail.com";
  const productName = "zara coat 3";
  const products = page.locator(".card-body");
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill(email);
  await page.locator("#userPassword").type("Iamking@000");
  await page.locator("[value='Login']").click();
  await page.waitForLoadState("networkidle");
  const titles = await page.locator(".card-body b").allTextContents();

  page.route("**/*.css {jpg, png,jpeg}", (route) => {
    route.abort();
  });

  page.on("request", (request) => console.log(request.url()));
  page.on("response", (response) =>
    console.log(response.url(), response.status())
  );

  console.log(titles);
  const count = await products.count();
  for (let i = 0; i < count; ++i) {
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      //add to cart
      await products.nth(i).locator("text= Add To Cart").click();
      await page.waitForTimeout(3000);
      break;
    }
  }

  await page.locator("[routerlink*='cart']").click();
  //await page.pause();

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

test("Check Orders", async ({ page }) => {
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
});

test.only("using get bys", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/angularpractice/");

  //any text in the lable tag, playwright intelligently knows that if you click, it means the checkbox zone
  await page.getByLabel("Check me out if you Love IceCreams!").click();
  await page.getByLabel("Employed").check();
  await page.getByLabel("Gender").selectOption("Male");
  await page.getByPlaceholder("Password").fill("123ewqasd"); //usually text fields

  //favourite, rolles in on the UI page
  //1st playwright will filer ALLLLL the buttons
  await page.getByRole("button", { name: "Submit" }).click();

  //scans the page for the text
  await page
    .getByText("Success! The Form has been submitted successfully!.")
    .isVisible();

  //gets all the links, then filer by "Shop"
  await page.getByRole("link", { name: "Shop" }).click();

  // chaining - this returns the 4 cards, then filter with text, then getting the button by getByRole
  await page
    .locator("app-card")
    .filter({ hasText: "Nokia Edge" })
    .getByRole("button")
    .click();
});
