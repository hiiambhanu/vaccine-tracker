require("dotenv").config();
const fetch = require("node-fetch");
const { DateTime } = require("luxon");
const nodemailer = require("nodemailer");
let baseURL = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict";

let districts = [149, 150];
let emails = [ "hiiambhanu@gmail.com" ];

async function sendMail(data) {
  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: "Sam Whitman <whitmansam@codingee.com>", 
    to: emails, 
    subject: "Vaccine available", 
    text: `Vaccine available at ${data.name}, vaccine: ${data.vaccine}, availability : ${data.available_capacity}, date: ${data.date}`, 
  });

  console.log("Message sent", info.messageId);
}


async function checkForSlots(){
    console.log("Checking for slots");
    for (let district of districts){
        let now = DateTime.now().setZone('Asia/Kolkata');
        let [date, month] = [ now.day, now.month ];
        for(let i=0;i<7;i++){
            let url = `${baseURL}?district_id=${district}&date=`;
            url += `${date+i}-${month}-2021`;
            fetch(url, {
                headers:{
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0"
                }
            }).then(blob => blob.json()).then(data=>{
                // console.log(data);
                if(data.sessions){
                    for(let session of data.sessions){
                        // if session is free and for 18+
                        if(session.fee_type==="Free" && session.min_age_limit === 18){
                            sendMail(session);
                        } 
                    }
                }
            }).catch(e => console.log(e))
        }
    }
}

checkForSlots();

setInterval(checkForSlots, 900000)