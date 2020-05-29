const cheerio = require('cheerio');
const axios = require('axios');
const PCPs = require('./PCPs');

const fs = require('fs');


async function asyncFunction() {
    try {
        const htmlData = await axios.get('https://perlmanclinic.com/our-team/');

        const $ = cheerio.load(htmlData.data);
        const urlElems = $('.elementor-image a').map((i, el) => {
            return $(el).attr('href');
        }).get();
        urlElems.shift();


        let index = 0;
        var wrapped = urlElems.map(function (url, index) {
            return { index, url };
        })

        let finalArray = wrapped.map((url) => axios.get(url.url));

        axios.all(finalArray).then((value) => {
            console.log("fired", value.length);
            const providerArray = [];
            for (let m = 0; m < value.lenth; m++) {


                const $ = cheerio.load(value[m].data);
                const name = $('h3', '.elementor-widget-heading').text();


                const bio = $('p', '.elementor-widget-container').map((i, el) => {
                    return $(el).text();
                }).get();
                bio.pop();


                let gender, providerID;
                for (let i = 0; i < PCPs.length; i++) {
                    if (PCPs[i].src === url.url) {
                        gender = PCPs[i].gender;
                        providerID = PCPs[i].myChartID;
                        firstName = PCPs[i].firstName;
                        lastName = PCPs[i].lastName;
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
                if (provider.providerID) {
                    console.log("provider ID", provider.name, index, provider.providerID);
                    providerArray.push(provider);
                }
            }
            return providerArray;
        }).catch(err => console.error(err));
    } catch (err) {
        console.error(err);
    }





    //     const $ = cheerio.load(res.data);
    //     const name = $('h3', '.elementor-widget-heading').text();


    //     const bio = $('p', '.elementor-widget-container').map((i, el) => {
    //         return $(el).text();
    //     }).get();
    //     bio.pop();


    //     let gender, providerID;
    //     for (let i = 0; i < PCPs.length; i++) {
    //         if (PCPs[i].src === url.url) {
    //             gender = PCPs[i].gender;
    //             providerID = PCPs[i].myChartID;
    //         }
    //     }

    //     const image = $('img', '.elementor-widget-theme-post-featured-image').attr('src');

    //     index++;
    //     const provider = {
    //         index: url.index,
    //         name,
    //         bio,
    //         image,
    //         gender,
    //         providerID
    //     };
    //     if (provider.providerID) {
    //         console.log("provider ID", provider.name, index, provider.providerID);
    //         return provider;
    //     }
    // });
    //     Promise.all(finalArray).then(resolver => {
    //         console.log("resolver length", resolver.length);
    //         let finalObj = {};
    //         for (let i = 0; i < resolver.length; i++) {
    //             console.log("provider id resolver index ", resolver[i]['providerID'] + ' ' + i);
    //             finalObj[resolver[i].providerID] = {
    //                 name: resolver[i]['name'],
    //                 bio: resolver[i]['bio'],
    //                 image: resolver[i]['image'],
    //                 gender: resolver[i]['gender'],
    //                 providerID: resolver[i]['providerID']
    //             }
    //             // console.log("final Obj", finalObj[resolver[i]['providerID']]['name'])
    //         }

    //         const jsonResolved = JSON.stringify({ finalObj });

    //         fs.writeFile('providers.json', jsonResolved, () => {
    //             console.log("completed");
    //         })
    //     }).catch(err => console.error(err));

    // }
    // catch (err) {
    //     console.error(err);
    // }

}
asyncFunction();

// elementor-element 
// elementor-element-1af55ec elementor-widget 
// elementor-widget-theme-post-featured-image 
// elementor-widget-image