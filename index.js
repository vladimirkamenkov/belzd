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
    subject: 'ATTANTION BELAVIA TICKETS!!!',
    text: 'That was easy!'
};

const getHTMLUrl = async (url) => {
    const res = await axios.get(url);

    return res.data;
};

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
    'https://ibe.belavia.by/select?journeyType=Ow&journey=MSQBUS20220328&adults=1&children=0&infants=0&lang=ru'
];

urls.forEach(async url => {
        const html = await getHTMLUrl(url);
        const $ = cheerio.load(html);
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
    });

console.log('all urls cheked');
