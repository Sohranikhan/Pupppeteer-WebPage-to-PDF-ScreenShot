const express = require('express')
const puppeteer = require('puppeteer')
require("dotenv").config();
const bodyParser = require('body-parser')

const app = express()
app.use(express.json())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname+"/views/"))
app.use(express.static(__dirname+"/public/"))

app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/views/')
})

app.get('/pdf',async(req,res)=>{
try {
        const url = req.query.url
        const option = req.query.option
        if (url=='' && option =='') {
          res.json( {success:false ,error: 'Please Fill Fields.'})
        }
        const browser = await puppeteer.launch({headless: 'new'});
        const page = await browser.newPage();
        await page.goto(url, {
                visible: true,
                waitUntil: "load",
                waitUntil: "domcontentloaded",
                timeout: 90 * 1000,
              });
        await page.setViewport({ width: 1600, height: 1024 });
        await page.waitForNetworkIdle()
      if (option==='pdf') {
        // {path :`./public/pdf${randomData}.pdf`}
        const pdf = await page.pdf({format:'A4'})
        res.json({success:true,pdf:pdf,type:'pdf'}) 
        await browser.close();   
      }
      if (option==='image') {
        const image = await page.screenshot({fullPage:true})
        res.json( {success:true ,image:image,type:'image'}) 
        await browser.close();
      }
      await browser.close();   
       } catch (error) {
        res.json( {success:false ,error: error})
       }
       })

app.listen(3000,()=>console.log('Server is running on: http://localhost:3000'))