const cheerio = require('cheerio');
const axios = require('axios');


async function asyncFunction(){
    const htmlData = await axios.get('https://perlmanclinic.com/our-team/');
    // console.log("bigger data", htmlData.data);
 

    const $ = cheerio.load(htmlData.data);
    const urlElems = $('.elementor-image a').map((i, el) =>{
        return $(el).attr('href');      
    }).get();
    urlElems.shift();
    // console.log("elems", urlElems);
    let finalArray = urlElems.map(async(url)=>{
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);
        const name = $('h3', '.elementor-widget-heading').text();
            // console.log('name', name);
        const bio = $('p','.elementor-widget-theme-post-content').text();
            // console.log("text", bio);

        const image = $('img', '.elementor-widget-theme-post-featured-image').attr('src');
            // console.log('name', image);
        
        const provider = {
                name,
                bio,
                image,
        };
        return provider;
    })
    const resolveMoFo = await Promise.all(finalArray);

    console.log("finalArray", resolveMoFo.length);

};

asyncFunction();
// console.log(asyncFunction);

// console.log(asyncFunction);

// .then((urlElems) => {
//     const providers = [];
//     console.log("elms", urlElems);
//     for (let i = 0; i < urlElems.length; i++){
//         axios.get(urlElems[i]).then((res) => {
//             // console.log("data time", res.data);
//             const $ = cheerio.load(res.data);
//             const name = $('h3', '.elementor-widget-heading').text();
//             // console.log('name', name);
//             const bio = $('p','.elementor-widget-theme-post-content').text();
//             // console.log("text", bio);

//             const image = $('img', '.elementor-widget-theme-post-featured-image').attr('src');
//             // console.log('name', image);

//             const provider = {
//                 name,
//                 bio,
//                 image,
//             };
//             // providers.push(provider);
//             // console.log("provider", provider);
//             return provider
//         }).then((provider)=>{
//             providers.push(provider);
//         })
//     }
//     console.log("providers length", providers.length);
//     return providers;
// }).then((providers)=>{
//     // console.log("providers", providers);
// })
        // 
        //     axios.get(urlElems[i]).then((res) =>{
        //         const $ = cherio.load(res.data);
    
        //         const 
        //     })
        // }
// elementor-element 
// elementor-element-1af55ec elementor-widget 
// elementor-widget-theme-post-featured-image 
// elementor-widget-image