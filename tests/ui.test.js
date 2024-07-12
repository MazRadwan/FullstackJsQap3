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

  //As a staff member user, I want to be able to add a new fitness class to the schedule.

  test("Form adds a new fitness class", async () => {
    await page.goto("http://localhost:3000/staff");
    await page.type("#class_name", "Spinning");
    await page.type("#instructor", "Charlie");
    await page.type("#date", "2024-07-12");
    await page.type("#time", "11:00");
    await page.type("#duration", "30");
    await page.type("#details", "A high-intensity spinning class.");
    await page.select("#class_type", "Spinning");
    await page.click("#submit");
    await page.waitForNavigation();
    const newClass = await page.$eval(".workout", (el) => el.textContent);
    expect(newClass).toContain("Spinning");
  });
});
