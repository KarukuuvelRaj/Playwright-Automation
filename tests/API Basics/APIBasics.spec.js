import {test,expect,request} from "@playwright/test"
const creds = {userEmail:"k.velu93@gmail.com",userPassword:"Raj@1993"}
let token
test.beforeAll(async()=>{
    const apiRequest = await request.newContext()
    const apiResponse = await apiRequest.post("https://rahulshettyacademy.com/api/ecom/auth/login",
    {
        data:creds
    })
    expect (apiResponse.ok()).toBeTruthy()
     const apiResJson=await apiResponse.json()
     token=apiResJson.token
     console.log(token)
})
test.beforeEach(async({page})=>{
    await page.addInitScript(myToken=>{
        window.localStorage.setItem('token',myToken)
    },token)
})
test("Add to Cart", async({page})=>{
    // await page.addInitScript(auth=>{
    //     window.localStorage.setItem('token',auth)
    // },token)
    await page.goto("https://rahulshettyacademy.com/client/")
    await page.locator(".card-body:visible").last().waitFor()
    await page.getByRole("button",{name:' Add To Cart'}).nth(1).click()
    await page.locator(".card-body:visible").last().waitFor()
})
test("Place Order",async({page})=>{
    await page.goto("https://rahulshettyacademy.com/client/")
    await page.locator(".card-body:visible").last().waitFor()
    await page.getByRole("button",{name:' Add To Cart'}).nth(1).click()
    await page.locator(".card-body:visible").last().waitFor()
    await page.locator("[routerlink='/dashboard/cart']").click()
    await page.getByRole("button",{name:'Checkout'}).click()
    await page.getByPlaceholder("Select Country").pressSequentially("seyc",{timeout:2000})
    await page.locator(".ta-results:visible").getByRole("button").click()
    await page.locator(".action__submit").click()
    await expect(page.getByText(" Thankyou for the order. ")).toBeVisible()
})