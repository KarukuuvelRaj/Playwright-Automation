// const {test}=require('@playwright/test')
// test('Invoke Browser', async({page})=>{
// await page.goto("www.google.com")
// })

import {test,expect} from '@playwright/test'
test("Invoke Browser 01", async ({page})=>{
await page.goto("https://www.google.com/")
await expect(page).toHaveTitle("Google")
})

test("Invoke Browser 02", async ({browser})=>{
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    let pageTitle=await page.title()
    await expect(page).toHaveTitle(pageTitle)
    const userName=page.locator("#username")
    const passWord=page.locator("[type='password']")
    const signIn=page.locator('#signInBtn')
    const cardBody=page.locator(".card-body a")
    await userName.fill("rahulshettyacademi")
    await passWord.fill("Learning@830$3mK2")
    await signIn.click()
    console.log(await page.locator("[style*='block']").textContent())
    await expect(page.locator("[style*='block']")).toContainText("Incorrect")
    await userName.fill("")
    await userName.fill("rahulshettyacademy")
    await signIn.click()
    console.log(await cardBody.nth(0).textContent())
    console.log(await cardBody.last().textContent())
    let allTitles=await cardBody.allTextContents()
    for(let i in allTitles){
        console.log(allTitles[i])
    }
})