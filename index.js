const app = require('express')();
const PORT = 8000;

const axios = require('axios')
const cheerio = require('cheerio')

const bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

const cors = require('cors')
app.use(cors())

const URLL = 'https://github.com/kubowania/nodejs-webscraper/blob/main/src/app.js'

app.get('/', function(req, res) {
    res.sendFile(__dirname+"/index.html")
})

app.post('/link-preview', (req, res) => {
    console.log(req.body.name)
    axios(req.body.name)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            // console.log(html)
 
            const data = []

            const title = $('meta[property="og:title"]').attr('content') || $('title').text() || $('meta[name="title"]').attr('content')
            const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content')

            let domain = (new URL(req.body.name));
            domain = domain.hostname

            // const site_name = $('meta[property="og:site_name"]').attr('content')
            const image = $('meta[property="og:image"]').attr('content') || $('meta[property="og:image:url"]').attr('content')

            data.push({
                title,
                description,
                domain,
                image,
                URLL
            })
            
            console.log(data)
            // res.json(data)
            res.send(`
            <body>
            <h2>DO you remember something?! Whatsapp link previews!</h2>
            <div class="previewCard">
            <a href="`+URLL+`"><span class="link"></span></a>
            <img class="urlImg" src="`+image+`" alt=""></img>
            <p class="urlTitle">`+title+`</p>
            <p class="urlDesc">`+description+`</p>
            <p class="urlDomain">www.`+domain+`</p>
            </div>
  <a href="default.asp" class="button-76" target="_blank">Back to Home</a>



            </body>

            <style>
            body{
                margin: 100px;
                padding: 0;
                background-color: #EFEAE2;
            }
            h2{
                
                text-align: center;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

            }
            .previewCard{
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                max-width: 300px;
                margin: auto;
                font-family: arial;
            
                border: 5px solid #D9FDD3;
                border-radius: 19px;
            
                background-color: #D1F4CC;
                color: black;
            }
            
            .link {
                position: absolute;
                width: 100px;
                height: 100px;
                top: 0;
                left: 0;
                z-index: 1;
              }
            
            .urlImg{
                width: 300px;
                border-radius: 15px 15px 0px 0px;
                padding: 0px;
            }
            
            .urlTitle{
                font-size: 18px;
                font-weight: 550;
                font-family:Arial, Helvetica, sans-serif;
                line-height: 18px;
            
                padding: 0px 10px 0px 10px;
            
            }
            
            .urlDesc{
                font-size: 14px;
                font-family: Arial, Helvetica, sans-serif;
                padding: 0px 10px 0px 10px;
                line-height: 18px;
                color: #393d3f;
            }
            
            .urlDomain{
                font-size: 12px;
                line-height: 1px;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                padding: 0px 10px 5px 10px;
                color: #667781;
            }
            .button-76 {
                background-color: #cf245f;
                background-image: linear-gradient(to bottom right, #fcd34d, #ef4444, #ec4899);
                border: 0;
                border-radius: .25rem;
                box-sizing: border-box;
                color: #fff;
                cursor: pointer;
                font-family: ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
                font-size: 1.125rem; /* 18px */
                font-weight: 600;
                line-height: 1.75rem; /* 28px */
                padding: 1rem 1.25rem;
                text-align: center;
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
              }
              
              .button-76:hover {
                box-shadow: none;
              }
              
              @media (min-width: 1024px) {
                .button-76 {
                  font-size: 1.5rem; /* 24px */
                  padding: 1rem 1.5rem;
                  line-height: 2rem; /* 32px */
                }
              }
            </style>`)

        }).catch((err) => {
            return res.json({
              error: err+" & An error has occured, you may have inputted an incorrect url.",
              
            });
        });
        
})

app.listen(
    PORT,
    ()=> console.log(`Server running on ${PORT}`)
);
