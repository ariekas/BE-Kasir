const BwipJs = require('bwip-js')
const prisma = require('../../../config/db')

const generateBarcode = async (productId) => {
    const product = await prisma.product.findUnique({
        where:{id: productId}
    })

    if(!product){
        throw new Error("product not found")
    }

    const barcode = String(`PROD-${productId}`)

    const barcodeData = await prisma.barcode.create({
        data:{
            productId,
            barcode :barcode,
        }
    })

    const barcodeImg = await new Promise((resolve, reject) => {
        BwipJs.toBuffer({
            bcid: "code128",
            text: barcodeData.barcode, 
            scale: 3,
            height: 10,
            includetext : true
        },
        (err, png) => {
            if (err) reject(err);
            else resolve(png);
          }
        )
    })

    return {barcodeData, barcodeImg}
}

module.exports = {
    generateBarcode
}