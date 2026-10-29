import {test,expect} from "@playwright/test"
test("E2E Client App with playwright Locators", async({browser})=>{
    const context=await browser.newContext()
    const page=await context.newPage()
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
    await page.getByPlaceholder("email@example.com").fill("k.velu93@gmail.com")
    await page.getByPlaceholder("enter your passsword").fill("Raj@1993")
    await page.getByText("Login").click()
    await page.locator(".card-body").filter({hasText:'ZARA COAT 3'}).getByRole("button",{name:' Add To Cart'}).click()
    await page.getByRole("listitem").getByRole("button",{name:'Cart'}).click()
    await page.getByRole("button",{name:'Checkout'}).click()
    await expect(page.getByText("k.velu93@gmail.com")).toBeVisible()
    await page.getByPlaceholder("Select Country").pressSequentially("Ind",{timeout:2000})
    await page.getByRole("button",{name:'India'}).nth(1).click()
    await page.getByText("Place Order ").click()
    await expect(page.getByText(" Thankyou for the order. ")).toBeVisible()
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent()
    //const cleanOrder=orderId.replace(/\|/g,'')
    //console.log(cleanOrder)
    await page.getByRole("button",{name:'ORDERS'}).click()
    await page.locator("tbody tr").last().waitFor()
    // const rowId=await page.locator("tr").filter({hasText:cleanOrder})
    // await rowId.getByRole("button",{name:'View'}).click()
    const orderCount=await page.locator("tbody tr").count()
    for(let i=0;i<orderCount;i++){
        const itr=await page.locator("tbody tr").nth(i).locator("th").textContent()
        if(orderId.includes(itr)){
            await page.locator("tbody tr").nth(i).getByRole("button",{name:'View'}).click()
            break
        }
    }
   // await page.pause()
})