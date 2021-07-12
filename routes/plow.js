var express = require('express')
var router = express.Router()
var { chromium } = require('playwright')

const config = require('config')
const fs = require('fs')
const cors = require('cors')
const MAXZ = 17

// config constants
const defaultZ = config.get('defaultZ')

// global variables
let busy = false

var app = express()
app.use(cors())


//from plow
const tile2long = (x, z) => {
  return x / 2 ** z * 360 - 180
}

const tile2lat = (y, z) => {
  const n = Math.PI - 2 * Math.PI * y / 2 ** z
  return 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
}


/* GET png */
router.get(`/raster/:Z/:X/:Y.png`, 
 async function(req, res) {
  busy = true
  const Z = parseInt(req.params.Z)
  const X = parseInt(req.params.X)
  const Y = parseInt(req.params.Y)

if (!req.session.userId) {
  // reply error message
    res.status(401).send(`Please log in to get: /plow/raster/${Z}/${X}/${Y}.png`)
   busy = false
    } else {
// const browser = await chromium.launch({ headless: false }) //need when checking
 const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({
    viewport: { width: 768, height: 768 }
  })


  let waitT = 2500 * (MAXZ - Z)
  if (Z < MAXZ - 2){
   waitT = 5000
  }
  await page.goto(
      `https://hfu.github.io/plow/#${Z}/${tile2lat(Y + 0.5, Z)}/${tile2long(X + 0.5, Z)}`//Please replace
  )
  await page.waitForNavigation()
  await page.waitForTimeout(waitT) //gray image appears without this

//var buff //if buff is declared here, an error occur....
let buff
buff = await page.screenshot({
    clip: {
      x: 128,
      y: 128,
      width: 512,
      height: 512
    }
  })




  await browser.close()

//      if (buff.body) {
//        res.set('content-type', 'image/png')
//        res.set('content-encoding', 'gzip')
        res.send(buff)
        //res.send(fs.writeFileSync(buff))
        busy = false
//      } else {
//        res.status(404).send(`tile not found: /plow/raster/${Z}/${X}/${Y}.png`)
//        busy = false
//      }


//  res.status(404).send(`tile not found: /raster/${Z}/${X}/${Y}.pbf`)
  busy = false  

}

}
)








module.exports = router;