const puppeteer = require('puppeteer');
const cotacao = require('./getCotacao');

async function run() {
    const browser = await puppeteer.launch();

    const cenarioBaseSelic2023 = await cotacao.getCotacao('159', browser);
    const cenarioBaseSelic2024 = await cotacao.getCotacao('171', browser)

    console.log(cenarioBaseSelic2023)
    console.log(cenarioBaseSelic2024)
    browser.close();
}
run();