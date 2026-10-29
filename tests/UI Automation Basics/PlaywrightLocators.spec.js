import{test,expect} from "@playwright/test"
test("Playwright Locators", async({browser})=>{
    const context=await browser.newContext()
    const page=await context.newPage()
    await page.goto("https://rahulshettyacademy.com/angularpractice/")
    await page.getByLabel("Check me out if you Love IceCreams!").click()
    await page.getByLabel("Gender").selectOption("Female")
    await page.getByLabel("Student").click()
    await page.getByPlaceholder("Password").fill("Hello")
    await page.getByRole("button",{name:'Submit'}).click()
    await page.getByText(" The Form has been submitted successfully!").isVisible()
    await page.getByRole("link",{name: 'Shop'}).click()
    await page.locator("app-card").filter({hasText:'Blackberry'}).getByRole("button").click()
})
