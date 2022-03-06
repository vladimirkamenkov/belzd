const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');

const pass = process.env.YANDEX;

const sendedUrls = [];

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'vl.cm@ya.ru',
        pass
    }
});

const mailOptions = {
    from: 'vl.cm@ya.ru',
    to: 'vl.cm@ya.ru',
    subject: 'ATTANTION BELAVIA TICKETS!!!',
    text: 'That was easy!'
};

async function getData(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const data = await page.content();
    await browser.close();

    processData(data, url);
}

function processData(data, url) {
    const $ = cheerio.load(data);
    const elems = $('.offer-item');

    if (elems.length && !sendedUrls.includes(url)) {
        mailOptions.text = `URL: ${url}`;

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                sendedUrls.push(url);
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

const urls = [
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQBUS20220319&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQBUS20220320&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQBUS20220321&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQBUS20220322&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQBUS20220323&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQBUS20220324&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQBUS20220325&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQBUS20220326&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQBUS20220327&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQBUS20220328&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQKUT20220319&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQKUT20220320&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQKUT20220321&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQKUT20220322&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQKUT20220323&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQKUT20220324&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQKUT20220325&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQKUT20220326&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQKUT20220327&adults=1&children=0&infants=0&lang=ru',
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQKUT20220328&adults=1&children=0&infants=0&lang=ru',
];

urls.forEach(async url => {
    await getData(url);
});
