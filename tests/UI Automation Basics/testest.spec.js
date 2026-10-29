import {test,expect} from "@playwright/test"
test.skip("Playwright Actions", async({browser})=>{
    const context=await browser.newContext()
    const page=await context.newPage()
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/")
    const rows = page.locator(".table-display tr")
    await rows.last().waitFor()
    let total = 0
    for(let i=1;i<await rows.count();i++){
        let prices=await rows.nth(i).locator("td").last().textContent()
        total = total+parseInt(prices)
    }   
    expect(total).toBe(235)
})

test("Table", async({browser})=>{
    const context=await browser.newContext()
    const page=await context.newPage()
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/")
    const fixedRows = page.locator(".tableFixHead tbody tr")
    await expect(fixedRows.last()).toBeAttached()
    let fixedTotal = 0
    for(let i=0;i<await fixedRows.count();i++){
        let fixedPrices=await fixedRows.nth(i).locator("td").last().textContent()
        fixedTotal = fixedTotal + Number(fixedPrices)    
    }
    const totalAmount =await page.locator(".totalAmount:visible").textContent()
    // const totPrice=totalAmount.split(":")
    // const finalAmount=totPrice[1].trim()
    const finalAmount = Number(totalAmount?.split(":")[1].trim())
    expect(fixedTotal).toBe(finalAmount)
})