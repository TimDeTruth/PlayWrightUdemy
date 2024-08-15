// @ts-check
const { defineConfig, devices } = require("@playwright/test");

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  //scans the test directory to trigger the test
  testDir: "./tests",

  //for assertions
  // so when i use the expect assetion in my test
  // expect:{
  //   timeout:5000
  // },

  // timeout: 30 * 1000,//max time one test can run for, this is like a global timeout

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  //your test cases will read all these properties here and adhere to them, what browser, screenshots etc
  use: {
    browserName: "chromium",

    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // trace: "on-first-retry",
    // trace: "on",
    // screenshot: "on",
  },

  /* Configure projects for major browsers */
  // projects: [
  //   {
  //     name: "chromium",
  //     use: { ...devices["Desktop Chrome"],

  //   },

  //   {
  //     name: "firefox",
  //     use: { ...devices["Desktop Firefox"] },
  //   },

  //   {
  //     name: "webkit",
  //     use: { ...devices["Desktop Safari"] },
  //   },

  projects: [
    {
      name: "safariexc",
      use: {
        browserName: "webkit",
        headless: false,
        screenshot: "on",
        trace: "on",
        ...devices["Galaxy S9+ landscape"],
      },
    },
    {
      name: "chromeexc",
      use: {
        browserName: "chromium",
        headless: false,
        screenshot: "on",
        trace: "on",
        video: "retain-on-failure",
        ignoreHTTPSErrors: true,
        permissions: ["geolocation"],
        viewport: { width: 720, height: 720 },
      },
    },
  ],

  /* Test against mobile viewports. */
  // {
  //   name: 'Mobile Chrome',
  //   use: { ...devices['Pixel 5'] },
  // },
  // {
  //   name: 'Mobile Safari',
  //   use: { ...devices['iPhone 12'] },
  // },

  /* Test against branded browsers. */
  // {
  //   name: 'Microsoft Edge',
  //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
  // },
  // {
  //   name: 'Google Chrome',
  //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  // },
  // ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
