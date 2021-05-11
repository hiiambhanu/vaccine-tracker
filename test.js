
const { DateTime } = require("luxon");

let now = DateTime.now().setZone('Asia/Kolkata');
console.log( now.day, now.month);