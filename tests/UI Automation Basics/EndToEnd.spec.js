import {test,expect} from "@playwright/test"
test("Test Case 001", async({browser})=>{
    const context=await browser.newContext()
    const page=await context.newPage()
    const productName = "ZARA COAT 3"
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
    await page.locator('#userEmail').fill("k.velu93@gmail.com")
    await page.locator('[id="userPassword"]').fill("Raj@1993")
    await page.locator('[name="login"]').click()
    const products=page.locator(".card-body")
    await products.first().waitFor()
    for(let i=0; i<await products.count(); i++){
        if(await products.nth(i).locator("b").textContent() == productName){
            await products.nth(i).locator("text= Add To Cart").click()
            break
        }
    }
    await page.locator("[routerlink*='/dashboard/cart']").click()
    await page.locator("div li").first().waitFor()
    expect(await page.locator("h3:has-text('ZARA COAT 3')").isVisible()).toBeTruthy()
    await page.locator("text=Checkout").click()
    await page.locator("[placeholder*='Select C']").pressSequentially("Ind", {delay:150})
    const dropDown=page.locator("[class='ta-results list-group ng-star-inserted']")
    await dropDown.first().waitFor()
    for(let i=0; i< await dropDown.locator("button").count(); i++){
        if(await dropDown.locator("button").nth(i).textContent() == " India"){
            await dropDown.locator("button").nth(i).click()
            break
        }
    }
    await page.locator("[class='actions'] a").click()
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ")
    const orderID=await page.locator(".em-spacer-1 .ng-star-inserted").textContent()
    console.log(orderID)
    await page.locator("[routerlink='/dashboard/myorders']").first().click()
    await page.locator("tbody").first().waitFor()
    const table = await page.locator(".table tbody")
    await table.waitFor()
    const totalOrders=await table.locator("tr")
        for(let i=0; i<await totalOrders.count(); i++){
            const ord = await totalOrders.nth(i).locator("th").textContent()
            if(orderID.includes(ord)){
            console.log("Matched")
            await totalOrders.nth(i).locator("button:has-text('View')").click()
            break
        }
    }
    const orderDetail= await page.locator(".col-text").textContent()
    expect(orderID.includes(orderDetail)).toBeTruthy()
    //await page.pause()
    }
)