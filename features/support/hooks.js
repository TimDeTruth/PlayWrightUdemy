const playwright = require("@playwright/test");
const { POManager } = require("../../pageobjects/POManager");
const {
  Before,
  After,
  BeforeStep,
  AfterStep,
  Status,
} = require("@cucumber/cucumber");

Before({ tags: "@Regression or @Web" }, async function () {
  const browser = await playwright.chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  this.page = await context.newPage();
  this.poManager = new POManager(this.page);
});

After(async function () {
  console.log("Teardown is donw ");
});

BeforeStep(function ({ result }) {});

AfterStep(async function ({ result }) {
  if (result.status === Status.FAILED) {
    await this.page.screenshot({ path: "screenshotafter1.png" });
  }
});
