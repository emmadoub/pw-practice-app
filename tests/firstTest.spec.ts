import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})
 

test('Locator Syntax Rules', async({page}) => {
    //by Tag name
    await page.locator('input').first().click()

    //by ID
    await page.locator('#inputEmail1').click()

    //by Class value
    page.locator('.shape-rectangle')

    //by Attribute
    page.locator('[placeholder="Email"]')

    //by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //Combine different selectors
    page.locator('input[placeholder="Email"][nbinput]')

    //by XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')

    //by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')

})

test('User facing locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign In"}).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    await page.getByTestId('SignIn').click()

    await page.getByTitle('IoT Dashboard').click()

})

test('Locating child elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name: "Sign In"}).first().click()

    await page.locator('nb-card').nth(3).getByRole('button').click()

})

test('Locating parent elements', async({page}) =>{
await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

await page.locator('nb-card').filter({hasText: "Basic Form"}).getByRole('textbox', {name: "Email"}).click()
await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"})
.getByRole('textbox', {name: "Password"}).click()

await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()

})

test('Reusing the same locators', async({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"})
    const emailInputField = basicForm.getByRole('textbox', {name: "Email"})
    await emailInputField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailInputField).toHaveValue('test@test.com')

})

test('Extracting values', async({page}) => {
    //single text value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"})
    const btnText = await basicForm.locator('button').textContent()
    expect(btnText).toEqual('Submit')

    //all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1")

    //input value 
    const emailInputField = basicForm.getByRole('textbox', {name: "Email"})
    await emailInputField.fill('test@test.com')
    const emailValue = await emailInputField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    //attributes
    const placeholderValue = await emailInputField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')


})

test('Assertions', async({page}) => {
    const basicFormBtn = page.locator('nb-card').filter({hasText: "Basic Form"}).locator('button')

    //General Assertions 
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormBtn.textContent()
    expect(text).toEqual("Submit")

    //Locator Assertions
    await expect(basicFormBtn).toHaveText('Submit') //wait up to 5 seconds

    //Soft Assertion 
    await expect.soft(basicFormBtn).toHaveText('Submit!!') //fails but the test run continues the execution
    await basicFormBtn.click()

})

