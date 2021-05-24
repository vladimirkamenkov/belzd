const cron = require('node-cron');
const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

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
    subject: 'ATTANTION BEL ZD!!!',
    text: 'That was easy!'
};

const getHTMLUrl = async (url) => {
    const res = await axios.get(url);

    return res.data;
};

const urls = [
    'https://pass.rw.by/ru/route/?from=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA&from_esr=&from_exp=&to=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&to_esr=&to_exp=&date=2021-05-26',
    'https://pass.rw.by/ru/route/?from=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA&from_esr=&from_exp=&to=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&to_esr=&to_exp=&date=2021-05-27',
    'https://pass.rw.by/ru/route/?from=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA&from_esr=&from_exp=&to=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&to_esr=&to_exp=&date=2021-05-30',
    'https://pass.rw.by/ru/route/?from=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA&from_esr=&from_exp=&to=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&to_esr=&to_exp=&date=2021-05-31',
    'https://pass.rw.by/ru/route/?from=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA&from_esr=&from_exp=&to=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&to_esr=&to_exp=&date=2021-06-01',
    'https://pass.rw.by/ru/route/?from=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA&from_esr=&from_exp=&to=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&to_esr=&to_exp=&date=2021-06-02',
    'https://pass.rw.by/ru/route/?from=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA&from_esr=&from_exp=&to=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&to_esr=&to_exp=&date=2021-06-03',
    'https://pass.rw.by/ru/route/?from=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA&from_esr=&from_exp=&to=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&to_esr=&to_exp=&date=2021-06-04'
];

cron.schedule('* * * * *', function() {
    urls.forEach(async url => {
        const html = await getHTMLUrl(url);
        const $ = cheerio.load(html);
        const elems = $('.sch-table__row[data-train-number="722Б"] .cell-4.empty, .sch-table__row[data-train-number="718Б"] .cell-4.empty');
    
        if (elems.length < 2 && !sendedUrls.includes(url)) {
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
    });
    
    console.log('all urls cheked');
});