import {test,expect} from "@playwright/test"
test("Learn Multi tabs",async({browser})=>{
const context=await browser.newContext()
const page1=await context.newPage()
await page1.goto("https://rahulshettyacademy.com/loginpagePractise/")
const blinkText = await page1.locator(".blinkingText").nth(0)
const userName = await page1.locator("#username")
await expect(blinkText).toHaveAttribute("class","blinkingText")
const [page2]=await Promise.all([
context.waitForEvent('page'),
blinkText.click()])
const textLine = await page2.locator(".red").nth(0)
const text=await textLine.textContent()
const text1=text.split("@")
const uName=text1[1].split(".com")[0]
await userName.fill(uName)
console.log(await userName.inputValue())
}
)