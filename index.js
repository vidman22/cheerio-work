const cheerio = require('cheerio');
const axios = require('axios');
const PCPs = require('./PCPs');

const fs = require('fs');


async function asyncFunction(){
    const htmlData = await axios.get('https://perlmanclinic.com/our-team/');
    // console.log("bigger data", htmlData.data);
 

    const $ = cheerio.load(htmlData.data);
    const urlElems = $('.elementor-image a').map((i, el) =>{
        return $(el).attr('href');      
    }).get();
    urlElems.shift();


    let index = 0;
    var wrapped = urlElems.map(function(url, index){
        return {index, url};
    })
    let finalArray = wrapped.map(async(url)=>{
        const res = await axios.get(url.url);
        const $ = cheerio.load(res.data);
        const name = $('h3', '.elementor-widget-heading').text();
            

        const bio = $('p','.elementor-widget-container').map((i, el) =>{
            return $(el).text();
        }).get();
        bio.pop();
  

        let gender, providerID;
        for ( let i = 0; i < PCPs.length; i++){
            if (PCPs[i].src === url.url){
                gender = PCPs[i].gender;
                providerID = PCPs[i].myChartID;
            }
        }

        const image = $('img', '.elementor-widget-theme-post-featured-image').attr('src');

        index++;
        const provider = {
                index: url.index,
                name,
                bio,
                image,
                gender,
                providerID
        };
        return provider;
    })
    const resolver = await Promise.all(finalArray);
    const jsonResolved = JSON.stringify({resolver});
    
    fs.writeFile('providers.json', jsonResolved, ()=>{
        console.log("completed");
    })
};

asyncFunction();

// elementor-element 
// elementor-element-1af55ec elementor-widget 
// elementor-widget-theme-post-featured-image 
// elementor-widget-image