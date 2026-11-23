import {test,expect,request} from "@playwright/test"
const creds = {userEmail:"k.velu93@gmail.com",userPassword:"Raj@1993"}
let token
test.beforeAll(async()=>{
const apiContext=await request.newContext()
const apiResponse=await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
    {
        data: creds
    }
)
const apiLoginData=await apiResponse.json()
token=apiLoginData.token
})
test("Wrong Order",async({page})=>{
    await page.addInitScript(
        auth=>{
            window.localStorage.setItem('token',auth)
        },token
    )
await page.goto("https://rahulshettyacademy.com/client/#/dashboard/myorders")
await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    route => route.continue({url:'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6af52c3892a4141n4c12v1a6'})
)
await page.getByRole("button", {name:'View'}).first().click()
await expect(page.locator(".blink_me").first()).toHaveText("You are not authorize to view this order")   
})