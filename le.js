
const axios = require('axios');
const FormData = require('form-data');



async function sendWebhook(style,title,color,price,matchedSkus,launch,image) {
    const webhookUrl = '';
    const stockInfo = matchedSkus.map((sku) => `Size: ${sku.size} : ${sku.level}`).join('\n');
    try {
        
      const embed = {
        title: `${title}` ,
        description: `${color}`,
        color: 5763719,
        fields: [
          { name: 'SKU', value: `${style}`, inline: true },
          { name: 'Price', value: `${price}`, inline: true },
          { name: 'Stock', value: `${stockInfo}`, inline: false },
          { name: 'Launch Info', value: `${launch}`, inline: false },
         
        ],
        thumbnail: {
            url: `${image}`
        }
      };
  
      const formData = new FormData();
      formData.append('payload_json', JSON.stringify({ embeds: [embed] }));
  
      const response = await axios.post(webhookUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
  
      console.log('Webhook sent successfully');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error sending webhook:', error);
    }
  }



let availableGtins 
let style 
let title
let color 
let price
let matchedSkus
let launch
let image

async function main() {
  let headers = {
    method: "get",
    maxBodyLength: Infinity,
    credentials: 'omit',
    Accept: '*/*',
    url: 'https://api.nike.com/product_feed/threads/v3/?filter=marketplace(US)&filter=language(EN)&filter=channelName(Nike.com)&filter=productInfo.merchProduct.styleColor(FZ3124-200)&filter=exclusiveAccess(true,false)',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Appid': 'com.nike.commerce.snkrs.web',
    'Content-Type': 'application/json; charset=UTF-8',
    'Origin': 'https://www.nike.com',
    'Referer': 'https://www.nike.com/',
    'Sec-Ch-Ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
    'X-B3-Parentspanid': 'e694760461552808, 66a836d33c5fd569',
    'X-B3-Spanid': '957f88b5bde9281f',
    'X-B3-Traceid': '5bca6574725e1e5f, 5bca6574725e1e5f',
  };

  try {
    const response = await axios.request(headers);
 
    
    const productInfoArray = response.data.objects[0].productInfo[0].skus;

    
     availableGtins = response.data.objects[0].productInfo[0].availableGtins || [];
 style = response.data.objects[0].productInfo[0].merchProduct.styleColor
 title = response.data.objects[0].productInfo[0].productContent.fullTitle
 color = response.data.objects[0].productInfo[0].productContent.colorDescription
 price = response.data.objects[0].productInfo[0].merchPrice.fullPrice
launch = response.data.objects[0].productInfo[0].launchView.method
image = response.data.objects[0].publishedContent.properties.productCard.properties.squarishURL



    const gtinToLevelMap = {};
    availableGtins.forEach((gtinEntry) => {
      gtinToLevelMap[gtinEntry.gtin] = gtinEntry.level;
    });

     matchedSkus = productInfoArray.map((sku) => {
      const level = gtinToLevelMap[sku.gtin] || "UNKNOWN"; 
      return {
        size: sku.nikeSize,
        level: level,
      };
    });

    console.log(matchedSkus)

    sendWebhook(style,title,color,price,matchedSkus,launch,image);

  } catch (error) {
    console.error('Error fetching data:', error);
  }


  
}


main();
