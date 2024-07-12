const puppeteer = require("puppeteer"); // using pupeteer for this test

// as a user i want to ensure the elemets are accessible and usable on different screen sizes

describe("Responsiveness Tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Calendar view switches to list view on small screens", async () => {
    await page.setViewport({ width: 375, height: 812 }); // iPhone resolution
    await page.goto("http://localhost:3000");
    const listView = await page.$(".list-view"); // Assume there's a class or ID for list view
    expect(listView).toBeTruthy();
  });

  test("UI elements are accessible and usable on different screen sizes", async () => {
    await page.setViewport({ width: 768, height: 1024 }); // iPad resolution
    await page.goto("http://localhost:3000");
    const calendarView = await page.$(".calendar-view"); // Assume there's a class or ID for calendar view
    expect(calendarView).toBeTruthy();
  });
});
