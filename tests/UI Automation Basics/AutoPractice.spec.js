import {test,expect} from "@playwright/test"
test("Playwright Actions", async({browser})=>{
    const context=await browser.newContext()
    const page=await context.newPage()
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/")
    //Radio Button
    await page.locator("#radio-btn-example input").nth(1).click()
    //Suggession class example
    await page.getByPlaceholder("Type to Select Countries").pressSequentially("ger")
    await page.locator("#ui-id-1 li").nth(2).click()
    //Dropdown example
    await page.locator("#dropdown-class-example").selectOption({value:'option3'})
    //Checkbox example
    await page.locator("#checkBoxOption2").check()
    //Switch Window example
    const [page2]=await Promise.all([
        context.waitForEvent('page'),
        page.locator("#openwindow").click()
    ])
    await expect(page2.locator("#cf-error-details .inline-block").nth(1)).toHaveText("Invalid SSL certificate")
    await page2.close()
    //Switch Window example
    const [page3]=await Promise.all([
        context.waitForEvent('page'),
        page.locator(".cen-align #opentab").click()
    ])
    await expect(page3.locator("#cf-error-details .code-label")).toContainText("Error code 526")
    await page3.close()
    //Switch To Alert Example
    await page.locator("#name").fill("John")  
    await page.locator("#alertbtn").click()
    page.on("dialog",dialog=>dialog.accept())   
    await page.locator("#confirmbtn").click()
    //Mouse Hover Example
    const hoverr = page.getByRole("button",{name:'Mouse Hover'})
    await hoverr.hover()
    await page.locator(".mouse-hover-content a").nth(1).click()
    //Element Displayed Example
    const textBox=page.getByPlaceholder("Hide/Show Example")
    await page.locator("#hide-textbox").click()
    await expect(textBox).toBeHidden()
    await page.locator("#show-textbox").click()
    await expect(textBox).toBeVisible()
    //iFrame Example
    const frame = page.frameLocator("#courses-iframe")
    await frame.getByRole("link",{name:'All Access plan'}).click()
    await expect(frame.locator(".inner-box h1")).toHaveText("All Access Subscription")
    //Web table example
    //Task 1: Find a course and verify its price
    const task1=page.locator("tr").filter({hasText:'WebServices / REST API Testing with SoapUI'})
    await expect(task1.locator("td").nth(0)).toHaveText("Rahul Shetty")
    await expect(task1.locator("td").nth(2)).toHaveText("35")
    //Task 2: Scroll the fixed-header table and find an employee
    const task2=page.locator("tr").filter({hasText:'Raymond'})
    await expect(task2).toHaveCount(1)
    await task2.evaluate(myElement=>{
        myElement.scrollIntoView({block:"center"})
    })
    await expect(task2.locator("td").nth(1)).toHaveText("Businessman")
    await expect(task2.locator("td").nth(2)).toHaveText("Mumbai")
    await expect(task2.locator("td").nth(3)).toHaveText("37")
    //Task 3 — Intermediate to Complex: Calculate Total Course Price
    await page.locator(".table-display tr").last().waitFor()
    const rows = page.locator(".table-display tr")
    let total = 0
    for(let i=1;i<await rows.count();i++){
        let prices=await rows.nth(i).locator("td").last().textContent()
        total = total+parseInt(prices)
    }   
    expect(total).toBe(235)
    //Task 4 — Complex: Calculate Total Amount Collected
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