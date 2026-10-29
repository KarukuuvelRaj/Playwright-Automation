import {test} from "@playwright/test"
test("Test Case 001", async({browser})=>{
    const context=await browser.newContext()
    const page=await context.newPage()
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
    await page.locator('#userEmail').fill("k.velu93@gmail.com")
    await page.locator('[id="userPassword"]').fill("Raj@1993")
    await page.locator('[name="login"]').click()
    //await page.locator('.card-body b').last().waitFor()
    await page.waitForLoadState('networkidle')
    let allTitles=page.locator('.card-body b').allTextContents()
    console.log(await allTitles)
    console.log("Below are the products displayed:")
    for(let i in allTitles){
        console.log(allTitles[i])
    }   
}
)