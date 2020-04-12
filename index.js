const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');


async function asyncFunction(){
    const htmlData = await axios.get('https://perlmanclinic.com/our-team/');
    // console.log("bigger data", htmlData.data);
 

    const $ = cheerio.load(htmlData.data);
    const urlElems = $('.elementor-image a').map((i, el) =>{
        return $(el).attr('href');      
    }).get();
    urlElems.shift();
    // console.log("elems", urlElems);
    let index = 0;
    var wrapped = urlElems.map(function(url, index){
        return {index, url};
    })
    let finalArray = wrapped.map(async(url)=>{
        const res = await axios.get(url.url);
        const $ = cheerio.load(res.data);
        const name = $('h3', '.elementor-widget-heading').text();
            
        const bio = $('p','.elementor-widget-theme-post-content').text();

        const image = $('img', '.elementor-widget-theme-post-featured-image').attr('src');
        // console.log(index);
        index++;
        const provider = {
                index: url.index,
                name,
                bio,
                image,
        };
        return provider;
    })
    const resolver = await Promise.all(finalArray);
    const jsonResolved = JSON.stringify({resolver});
    // console.log("json", jsonResolved);
    fs.writeFile('providers.json', jsonResolved, (err)=>{
        console.error("oh, no!", err);
    })
};

asyncFunction();

// elementor-element 
// elementor-element-1af55ec elementor-widget 
// elementor-widget-theme-post-featured-image 
// elementor-widget-image