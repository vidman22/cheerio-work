const cheerio = require('cheerio');
const axios = require('axios');
// const PCPs = require('./PCPs');
const PCPs = require('./newpcps.json');
const PCPsAndIDs = require('./PCPsAndIDs.json');

const fs = require('fs');

const newArray = [];

// PCPsAndIDs.forEach(pcpid => {
//     PCPs.forEach(pcp => {
//         if (pcpid.NPI == pcp.NPI) {
//             pcp['providerID'] = pcpid.ID;
//             let newObj = {};
//             newObj['firstName'] = pcp.firstName;
//             newObj['lastName'] = pcp.lastName;
//             newObj['providerID'] = pcpid.ID;
//             newObj['src'] = pcp.src;
//             newObj['img'] = pcp.img;

//             newArray.push(newObj);
//         }
//     })

// })

// fs.writeFile('newpcps.json', JSON.stringify(newArray), () => {
//     console.log("completed", newArray.length);
// })

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

        let finalArray = wrapped.map(async (url) => {
            try {
                const res = await axios.get(url.url, { timeout: 60000 });
                const $ = cheerio.load(res.data);

                const name = $('h3', '.elementor-widget-heading').text();

                let bio = $('p', '.elementor-widget-container').map((i, el) => {
                    return $(el).text();
                }).get();
                bio = bio.filter(line => {
                    if ((line.indexOf("Copyright") !== -1) || (line.indexOf('Employee Login') !== -1)) {
                        console.log(line.indexOf("Copyright") !== -1)
                        return false;
                    } else {
                        return true;
                    }
                });

                let providerID, lastName, firstName;
                for (let i = 0; i < PCPs.length; i++) {
                    if (PCPs[i].src === url.url) {
                        // gender = PCPs[i].gender;
                        providerID = PCPs[i].providerID;
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
                    providerID,
                    lastName,
                    firstName,
                };
                if (provider.providerID) {
                    console.log("provider ID", provider.name, index, provider.providerID);
                    return provider;
                }
            } catch (err) {
                console.error(err);
            }
        });

        Promise.all(finalArray).then(resolver => {
            // console.log("resolver length", resolver.length);
            let finalObj = {};
            for (let i = 0; i < resolver.length; i++) {
                if (resolver[i]) {
                    console.log("provider id, index ", resolver[i]['providerID'] + ' ' + i);
                    finalObj[resolver[i].providerID] = {
                        name: resolver[i]['name'],
                        bio: resolver[i]['bio'],
                        image: resolver[i]['image'],
                        providerID: resolver[i]['providerID'],
                        index: resolver[i]['index'],
                        firstName: resolver[i]['firstName'],
                        lastName: resolver[i]['lastName']
                    }
                }
            }
            const jsonResolved = JSON.stringify({ finalObj });

            fs.writeFile('providers.json', jsonResolved, () => {
                console.log("completed");
            })
        }).catch(err => console.error(err));

    }
    catch (err) {
        console.error(err);
    }
};

asyncFunction();

// elementor-element 
// elementor-element-1af55ec elementor-widget 
// elementor-widget-theme-post-featured-image 
// elementor-widget-image