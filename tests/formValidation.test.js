const puppeteer = require("puppeteer");

// as a user i want to ensure that the form validation works correctly

describe("Form Validation", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/staff");
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Displays error messages for empty required fields", async () => {
    await page.click("#submit"); // Assume there's a submit button with ID 'submit'
    const errorMessage = await page.$eval(
      ".error-message",
      (el) => el.textContent
    ); // Assume error messages have class 'error-message'
    expect(errorMessage).toContain("This field is required");
  });

  test("Displays error messages for invalid data", async () => {
    await page.type("#date", "invalid-date"); // Assume date field has ID 'date'
    await page.click("#submit");
    const errorMessage = await page.$eval(
      ".error-message",
      (el) => el.textContent
    );
    expect(errorMessage).toContain("Invalid date format");
  });

  test("Submits form successfully with valid data", async () => {
    await page.type("#class_name", "Yoga");
    await page.type("#instructor", "Alice");
    await page.type("#date", "2024-07-10");
    await page.type("#time", "09:00");
    await page.type("#duration", "60");
    await page.type("#details", "A relaxing yoga class.");
    await page.select("#class_type", "Yoga");
    await page.click("#submit");
    await page.waitForNavigation();
    const successMessage = await page.$eval(
      ".success-message",
      (el) => el.textContent
    ); // Assume success messages have class 'success-message'
    expect(successMessage).toContain("Class added successfully");
  });
});
