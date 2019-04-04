const puppeteer = require('puppeteer');

function getRestaurants(email, password) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.10bis.co.il/next/');

    await page.click("[data-test='homeHeader-openLogin']");
    await page.type("input[name='email']", email);
    await page.type("input[name='password']", password);
    await page.click("button[data-test='login-submit']");

    await page.waitForNavigation();

    await page.goto('https://www.10bis.co.il/Account/UserReport');

    const restaurants = await page.evaluate(() => {
        return [].slice.call(document.querySelectorAll('.reportDataTd > div.reportActionDiv.hideOnPrint')).map(div => { return { name: div.getAttribute('data-res-name'), id: div.getAttribute('data-res-id') } });
    });

    browser.close();
    return restaurants;
}

module.exports = { getRestaurants };