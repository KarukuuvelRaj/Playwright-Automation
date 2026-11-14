import {test, expect, request} from "@playwright/test"
const creds = {userEmail:"k.velu93@gmail.com",userPassword:"Raj@1993"}
const orderPayload = {orders:[{country:"Cuba",productOrderedId:"6960eae1c941646b7a8b3ed3"}]}
let fakePayLoad = { data: [], message: "No Orders" }
let token
test.beforeAll(async()=>{
    const context=await request.newContext()
    const loginResponse=await context.post("https://rahulshettyacademy.com/api/ecom/auth/login",{
        data: creds
    })
    expect(loginResponse.status()).toBe(200)
    const loginApiResponse=await loginResponse.json()
    token=loginApiResponse.token
})
test("No Orders Placed",async({page})=>{
    await page.addInitScript(auth=>{
        window.localStorage.setItem('token',auth)
    },token)
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route=>{
           const response=await page.request.fetch(route.request())
           let body = JSON.stringify(fakePayLoad)
           route.fulfill({
            body,
            response
           })
        }
    )
    await page.goto("https://rahulshettyacademy.com/client/#/dashboard/myorders")
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")
    console.log(await page.locator(".mt-4").textContent())
})