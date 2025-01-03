const moment = require('moment');
const jsonfile = require('jsonfile');
const simpleGit = require('simple-git');
const FILE_PATH = './data.json';

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const makeCommit = n => {
    if (n === 0) return simpleGit().push();

    // Generate a random year between 2020 and 2024
    const year = getRandomInt(2020, 2024);

    // Generate a random day of the year (1 to 365, accounting for leap years)
    const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const maxDayOfYear = isLeapYear ? 366 : 365;
    const dayOfYear = getRandomInt(1, maxDayOfYear);

    // Define the start of the randomly chosen year
    const startOfYear = moment(`${year}-01-01`);

    // Convert the random day of the year to a date
    const DATE = startOfYear.dayOfYear(dayOfYear).format();

    // Skip future dates
    const today = moment().format('YYYY-MM-DD');
    if (moment(DATE).isAfter(today)) {
        console.log(`Skipping future date: ${DATE}`);
        return makeCommit(n); // Retry with the same count
    }

    const data = { date: DATE };
    console.log(`Creating commit ${n} for date: ${DATE}`); // Log the date

    jsonfile.writeFile(FILE_PATH, data, () => {
        simpleGit().add([FILE_PATH]).commit(DATE, { '--date': DATE }, makeCommit.bind(this, --n));
    });
};

// Call the function to make 100 commits
makeCommit(100);
