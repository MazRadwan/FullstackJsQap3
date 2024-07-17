const puppeteer = require("puppeteer"); // I'm using puppeteer for UI testing

// as a user i want to ensure that the calendar displays fitness classes
describe("UI Tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
  });

  afterAll(async () => {
    await browser.close();
  });

  //  as a user i want to ensure that the pop-up displays the correct class details

  test("Calendar displays fitness classes", async () => {
    const classes = await page.$$eval(".workout", (elements) =>
      elements.map((el) => el.textContent)
    );
    expect(classes.length).toBeGreaterThan(0);
  });

  test("Pop-up displays correct class details", async () => {
    await page.click(".workout"); // click the first workout
    const className = await page.$eval(
      "#modal-class-name",
      (el) => el.textContent
    );
    const instructor = await page.$eval(
      "#modal-instructor",
      (el) => el.textContent
    );
    expect(className).toBeTruthy();
    expect(instructor).toBeTruthy();
  });
});
