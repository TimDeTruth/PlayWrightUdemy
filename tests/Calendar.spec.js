const { test, expect } = require("@playwright/test");
const exp = require("constants");

test.only("Calendar Validations", async ({ page }) => {
  const month = "6";
  const day = "15";
  const year = "2027";

  const expectedDate = [month, day, year];

  await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");

  await page.locator(".react-date-picker__inputGroup").click();

  //twice to select and click
  await page.locator(".react-calendar__navigation__label").click();
  await page.locator(".react-calendar__navigation__label").click();

  await page.getByText(year).click();

  //should not hardcode
  await page
    .locator(".react-calendar__year-view__months__month")
    .nth(Number(month) - 1)
    .click();

  //using xpath for day
  await page.locator("//abbr[text()='" + day + "']").click();

  //parent to child, common locator
  const selectedDates = await page.locator(
    ".react-date-picker__inputGroup input"
  );

  //iterate through pulling and make sure it the same
  for (let i = 0; i < selectedDates.length; i++) {
    const value = selectedDates[i].getAttritute("value");
    expect(value).toEqual(expectedDate[value]); //6=6, 15=15, 2027=2027
  }
});
