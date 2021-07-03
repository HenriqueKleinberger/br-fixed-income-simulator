
const puppeteer = require('puppeteer');
const url = 'https://www.tesourodireto.com.br/titulos/calculadora.htm';

const getValueFromList = (list, label) => list[list.findIndex(v => v === label) + 1];

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

const getCotacao = async (titulo, browser) => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.select('#titulos-calc', titulo);
    await page.$eval('#dataInvestimento', el => el.value = '02/07/2021');
    await page.$eval('#valorInvestido', el => el.value = '1.000,00');
    await page.$eval('#taxaRentabilidadeInvestimento', el => el.value = '8,75');
    await page.$eval('#taxaAdmBancoCorretora', el => el.value = '0');
    await page.$eval('#indexadorTituloSelic', el => el.value = '5');
    await page.$eval('#btnCalc', btn => btn.click());
    await delay(300);

    const values = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('.td-calc-table__titulos__row td'))
        return tds.map(td => td.textContent)
    });

    const daysAfterInvestment = getValueFromList(values, 'Dias corridos entre a data do investimento e a data do resgate');
    const aliquotaMedia = getValueFromList(values, 'Alíquota média de imposto de renda');
    const impostoRenda = getValueFromList(values, 'Imposto de Renda');
    const valorLiquidoResgate = getValueFromList(values, 'Valor líquido do resgate');
    const rentabilidadeLiquidaAposTaxasIR = getValueFromList(values, 'Rentabilidade líquida após taxas e I.R.');
    return ({
        daysAfterInvestment,
        aliquotaMedia,
        impostoRenda,
        valorLiquidoResgate,
        rentabilidadeLiquidaAposTaxasIR
    });
}

exports.getCotacao = getCotacao;


