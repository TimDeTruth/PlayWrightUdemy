const { test, page, expect } = require("@playwright/test");

test("Hidden or Not", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
  await page.goto("http://google.com");
  await page.goBack();

  await expect(page.locator("#displayed-text")).toBeVisible();
  await page.locator("#hide-textbox").click();
  await expect(page.locator("#displayed-text")).toBeHidden();
  page.on("dialog", (dialog) => dialog.accept());

  //   page.pause();

  await page.locator("#confirmbtn").click();
  await page.locator("#mousehover").hover();

  //switch frames, returns a new page object
  const framePage = page.frameLocator("#courses-iframe");
  await framePage.locator("li a[href*='lifetime-access']:visible").click();
  const subscribers = await framePage.locator(".text h2").textContent();
  console.log(subscribers.split(" ")[1]);
});

//capturing screenshot on page
test("screenshot and visual comparison", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

  await expect(page.locator("#displayed-text")).toBeVisible();
  await page.locator("#hide-textbox").click();
  await expect(page.locator("#displayed-text")).toBeHidden();

  //whole page
  await page.screenshot({
    path: "screenshot.png",
  });
  //element only
  await page
    .locator("#displayed-text")
    .screenshot({ path: "elementsScreenshot.png" });

  page.on("dialog", (dialog) => dialog.accept());

  await page.locator("#confirmbtn").click();
  await page.locator("#mousehover").hover();

  //switch frames, returns a new page object
  const framePage = page.frameLocator("#courses-iframe");
  await framePage.locator("li a[href*='lifetime-access']:visible").click();
  const subscribers = await framePage.locator(".text h2").textContent();
  console.log(subscribers.split(" ")[1]);
});

//capturing screenshot on page
test(" visual comparison", async ({ page }) => {
  await page.goto("https://google.com");
  //1st run fails, creates a folder.-darwin.png compares
  expect(await page.screenshot({})).toMatchSnapshot("initialLnading.png");

  await expect(page.locator("#displayed-text")).toBeVisible();
  await page.locator("#hide-textbox").click();
  await expect(page.locator("#displayed-text")).toBeHidden();

  page.on("dialog", (dialog) => dialog.accept());

  await page.locator("#confirmbtn").click();
  await page.locator("#mousehover").hover();

  //switch frames, returns a new page object
  const framePage = page.frameLocator("#courses-iframe");
  await framePage.locator("li a[href*='lifetime-access']:visible").click();
  const subscribers = await framePage.locator(".text h2").textContent();
  console.log(subscribers.split(" ")[1]);
});
