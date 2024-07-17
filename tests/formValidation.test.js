const puppeteer = require("puppeteer");

describe("UI Tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Calendar displays fitness classes", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForTimeout(2000); // Wait for potential dynamic content to load

    console.log("Current URL:", await page.url());
    console.log("Page content:", await page.content());

    const classes = await page.$$eval(".workout", (elements) =>
      elements.map((el) => el.textContent)
    );
    console.log("Found classes:", classes);

    expect(classes.length).toBeGreaterThan(0);
  }, 10000);

  test("Pop-up displays correct class details", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector(".workout", { timeout: 5000 });
    await page.click(".workout");
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
  }, 10000);

  test("Form adds a new fitness class", async () => {
    console.log("Starting test: Form adds a new fitness class");

    await page.goto("http://localhost:3000/staff");
    console.log("Navigated to staff page");
    await page.screenshot({ path: "staff-page-initial.png", fullPage: true });

    await page.waitForSelector("#add-class-btn", {
      visible: true,
      timeout: 5000,
    });
    console.log("Add New Class button is visible");
    await page.click("#add-class-btn");
    console.log("Clicked Add New Class button");
    await page.screenshot({
      path: "after-click-add-class.png",
      fullPage: true,
    });

    await page.waitForSelector("#fitness-class-form", {
      visible: true,
      timeout: 5000,
    });
    console.log("Fitness class form is visible");
    await page.screenshot({ path: "form-visible.png", fullPage: true });

    const formExists = (await page.$("#fitness-class-form")) !== null;
    console.log("Form exists:", formExists);

    await page.type("#class_name", "Spinning");
    await page.type("#instructor", "Charlie");
    await page.type("#date", "2024-07-12");
    await page.type("#time", "11:00");
    await page.type("#duration", "30");
    await page.type("#details", "A high-intensity spinning class.");
    await page.select("#class_type", "Spinning");
    console.log("Filled out form fields");

    await page.waitForSelector('button[type="submit"]', {
      visible: true,
      timeout: 5000,
    });
    await page.click('button[type="submit"]');
    console.log("Clicked submit button");

    try {
      await page.waitForFunction(
        () =>
          document.body.innerText.includes("Class added successfully") ||
          document.querySelector(".workout"),
        { timeout: 10000 }
      );
      console.log("Page updated after submission");
    } catch (error) {
      console.error("Timeout waiting for page update:", error);
      console.log("Current page content:", await page.content());
    }

    await page.screenshot({ path: "after-submission.png", fullPage: true });

    const newClass = await page.$$eval(".workout", (elements) =>
      elements.map((el) => el.textContent)
    );
    console.log("Classes after submission:", newClass);
    expect(newClass.some((text) => text.includes("Spinning"))).toBeTruthy();

    console.log("Test completed");
  }, 60000); // Increase timeout to 60 seconds
});
