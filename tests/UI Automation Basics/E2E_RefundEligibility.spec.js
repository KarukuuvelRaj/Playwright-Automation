import {test,expect} from "@playwright/test"
const BASE_URL = "https://eventhub.rahulshettyacademy.com"
const userEmail = "john@gmail.com"
const pwd = "Raj@1993"

async function login(page) {
    await page.goto(`${BASE_URL}/login`)
    await page.locator("#email").fill(`${userEmail}`)
    await page.getByLabel("Password").fill(pwd)
    await page.getByRole("button",{name:'Sign In'}).click()
    await expect(page.getByText("Browse Events →")).toBeVisible()
}

test("Single ticket booking is eligible for refund", async({page})=>{
    //Step 1 — Login
    await login(page)
    //Step 2 — Book first event with 1 ticket (default)
    await page.goto(`${BASE_URL}/events`)
    await page.getByRole("article").nth(3).getByTestId("book-now-btn").click()
    await page.getByLabel("Full Name").fill("Jane Doe")
    await page.locator("#customer-email").fill(`${userEmail}`)
    await page.getByLabel("Phone Number").fill("9876543211")
    await page.getByRole("button",{name:'Confirm Booking'}).click()
    await expect(page.getByText("Your tickets are reserved.")).toBeVisible()
    //Step 3 — Navigate to booking detail
    await page.getByRole("button",{name:'View My Bookings'}).click()
    await page.getByTestId("booking-card").first().waitFor()
    await expect(page).toHaveURL(`${BASE_URL}/bookings`)
    await page.getByRole("button",{name:'View Details'}).first().click()
    await expect(page.getByText("Booking Information")).toBeVisible()
    //Step 4 — Validate booking ref
    const bookingRef=await page.locator(".__className_f367f3 span.font-mono").first().textContent()
    console.log(bookingRef)
    const eventTitle=await page.getByRole("heading").first().textContent()
    console.log(eventTitle)
    expect(bookingRef[0]).toBe(eventTitle[0])
    //Step 5 — Check refund eligibility
    await page.getByTestId("check-refund-btn").click()
    await expect(page.getByTestId("refund-spinner")).toBeVisible()
    await expect(page.getByTestId("refund-spinner")).toBeHidden({timeout:6000})
    //Step 6 — Validate result
    const eligibility=page.locator("#refund-result")
    await expect(eligibility).toBeVisible()
    await expect(eligibility).toContainText('Eligible for refund')
    await expect(eligibility).toContainText('Single-ticket bookings qualify for a full refund')
})

test("Group ticket booking is NOT eligible for refund", async({page})=>{
    //Step 1 — Login
    await login(page)
    //Step 2 — Book first event with 3 tickets
    await page.goto(`${BASE_URL}/events`)
    await page.getByRole("article").nth(0).getByTestId("book-now-btn").click()
    await page.getByRole("button",{name:'+'}).click({clickCount:2})
    await expect(page.locator("#ticket-count")).toHaveText("3")
    await page.getByLabel("Full Name").fill("Robert Clive")
    await page.locator("#customer-email").fill(`${userEmail}`)
    await page.getByLabel("Phone Number").fill("9876543211")
    await page.getByRole("button",{name:'Confirm Booking'}).click()
    await expect(page.getByText("Your tickets are reserved.")).toBeVisible()
    //Step 3 — Navigate to booking detail
    await page.getByRole("button",{name:'View My Bookings'}).click()
    await page.getByTestId("booking-card").first().waitFor()
    await expect(page).toHaveURL(`${BASE_URL}/bookings`)
    await page.getByRole("button",{name:'View Details'}).first().click()
    await expect(page.getByText("Booking Information")).toBeVisible()
    //Step 4 — Validate booking ref
    const bookingRef=await page.locator(".__className_f367f3 span.font-mono").first().textContent()
    console.log(bookingRef)
    const eventTitle=await page.getByRole("heading").first().textContent()
    console.log(eventTitle)
    expect(bookingRef[0]).toBe(eventTitle[0])
    //Step 5 — Check refund eligibility
    await page.getByTestId("check-refund-btn").click()
    await expect(page.getByTestId("refund-spinner")).toBeVisible()
    await expect(page.getByTestId("refund-spinner")).toBeHidden({timeout:6000})
    //Step 6 — Validate result (different assertions)
    const eligibility=page.locator("#refund-result")
    await expect(eligibility).toBeVisible()
    await expect(eligibility).toContainText('Not eligible for refund')
    await expect(eligibility).toContainText('Group bookings (3 tickets) are non-refundable')
})