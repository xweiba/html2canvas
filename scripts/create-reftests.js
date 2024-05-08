// @ts-check

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const express = require('express');
// @ts-ignore
const reftests = require('../tests/reftests');

const app = express();
app.use('/', express.static(path.resolve(__dirname, '../')));

const listener = app.listen(0, async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const address = listener.address()
    const port = typeof address === 'string' ? `:${address}` : !address ? '' : `:${address.port}`

    for (const filename of Object.keys(reftests.testList)) {
        await page.goto(`http://localhost${port}${filename}?reftest&run=false`);
        const reftest = await page.evaluate(() => {
            // @ts-ignore
            return html2canvas(document.documentElement, {
                windowWidth: 800,
                windowHeight: 600,
                // @ts-ignore
                target: new RefTestRenderer()
            });
        });
        fs.writeFileSync(
            path.resolve(__dirname, `..${filename.replace(/\.html$/i, '.txt')}`),
            reftest
        );
    }

    await browser.close();
    process.exit(0);
});