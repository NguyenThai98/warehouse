const helpers = require('handlebars-helpers')();
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
// const numeral = require('numeral');
module.exports = function (app) {
    app.engine('hbs', exphbs({
        defaultLayout: 'main.hbs',
        helpers: {
            section: hbs_sections(),
        }
    }));
    app.set('view engine', 'hbs');
}