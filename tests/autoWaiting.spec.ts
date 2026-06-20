import {test, expect} from '@playwright/test'

test.beforeEach(async({page}, testInfo) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 20000) //modify the default timeout +2 seconds, applied for each test in the suite
})

test('auto waiting', async({page}) => {
    const successBtn = page.locator('.bg-success')
    await successBtn.click()

    //const text = await successBtn.textContent()
    //expect(text).toEqual('Data loaded with AJAX get request.')

    //await successBtn.waitFor({state: "attached"})
    //const text = await successBtn.allTextContents()
    //expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successBtn).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})

})

test('alternative waits', async({page}) => {
    const successBtn = page.locator('.bg-success')

    // ___wait for element 
    //await page.waitForSelector('.bg-success')

    // ___wait for particular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // ___wait for network calls to be completed (NOT RECOMMENDED - because if an API call is stuck, the test will be stuck too)
    await page.waitForLoadState('networkidle')

    const text = await successBtn.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')

})

test('timeouts', async({page}) => {

    //test.setTimeout(10000) //overwrite the configured timeout for the specific test 
    test.slow() //increase the configured or default timeout by 3 times
    const successBtn = page.locator('.bg-success')
    await successBtn.click({timeout: 16000}) //overwrite the configured timeout for the specific action

})