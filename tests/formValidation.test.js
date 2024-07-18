const puppeteer = require("puppeteer");
const path = require("path");

// as a sweatSpot staff member, i want to be able to use a form to add a new fitness class

describe("UI Tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();

    // Log browser console messages
    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
    // Log any page errors
    page.on("error", (err) => console.log("PAGE ERROR:", err));
    // Log any request failures
    page.on("requestfailed", (request) =>
      console.log("REQUEST FAILED:", request.url(), request.failure().errorText)
    );
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Form adds a new fitness class", async () => {
    console.log("Starting test: Form adds a new fitness class");

    try {
      await page.goto("http://localhost:3000/staff");
      console.log("Navigated to staff page");

      const initialScreenshotPath = path.resolve(
        __dirname,
        "debug-initial.png"
      );
      await page.screenshot({ path: initialScreenshotPath, fullPage: true });
      console.log(`Took initial screenshot: ${initialScreenshotPath}`);

      // Wait for and click the "Add New Class" button
      await page.waitForSelector("#add-class-btn", { visible: true });
      console.log("Add New Class button is visible");
      await page.click("#add-class-btn");
      console.log("Clicked Add New Class button");

      const afterClickScreenshotPath = path.resolve(
        __dirname,
        "debug-after-click.png"
      );
      await page.screenshot({ path: afterClickScreenshotPath, fullPage: true });
      console.log(
        `Took screenshot after clicking Add New Class button: ${afterClickScreenshotPath}`
      );

      // Wait for the form to appear
      await page.waitForSelector("#class_name", {
        visible: true,
        timeout: 10000,
      });
      console.log("Class name input is visible");

      const beforeTypingScreenshotPath = path.resolve(
        __dirname,
        "debug-before-typing.png"
      );
      await page.screenshot({
        path: beforeTypingScreenshotPath,
        fullPage: true,
      });
      console.log(
        `Took screenshot before typing into form fields: ${beforeTypingScreenshotPath}`
      );

      // Interact with the form fields
      await page.type("#class_name", "Punchout");
      console.log("Typed class name");
      await page.type("#instructor", "Jorge");
      console.log("Typed instructor name");
      await page.type("#date", "2024-07-23");
      console.log("Typed date");
      await page.type("#time", "15:09"); // 24-hour format for time input
      console.log("Typed time");
      await page.type("#duration", "60");
      console.log("Typed duration");
      await page.type("#details", "Boxing class");
      console.log("Typed details");
      await page.select("#class_type", "Boxing");
      console.log("Selected class type");

      // Set up a listener for the alert
      page.on("dialog", async (dialog) => {
        console.log("Dialog message:", dialog.message());
        expect(dialog.message()).toBe("Operation successful!");
        await dialog.accept();
      });

      // Click the submit button and handle the alert
      await page.click('button[type="submit"]');
      console.log("Clicked submit button");

      //delay to ensure the form has time to reset
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Verify that the form has been reset (indicating successful submission)
      const classNameValue = await page.$eval("#class_name", (el) => el.value);
      expect(classNameValue).toBe("");
      console.log("Form reset successfully");

      console.log("Test completed");
    } catch (error) {
      console.error("Test failed:", error);
      throw error;
    }
  }, 10000); // Increase timeout to 90 seconds
});
