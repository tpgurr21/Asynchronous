'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
    const html = `
<article class="country ${className}">
      <img class="country__img" src="${data.flag}" />
      <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} mil.</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
      </div>
    </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html) 
    countriesContainer.style.opacity = 1;
}

const renderError = function(msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
    // countriesContainer.style.opacity = 1;
}
///////////////////////////////////////


/*

const getCountryAndNeighbour = function(country) {

    // AJAX call country 1
    const request = new XMLHttpRequest();
    request.open('GET', `https://countries-api-836d.onrender.com/countries/name/${country}`);
    request.send();


    request.addEventListener('load', function() {
        const [data] = JSON.parse(this.responseText);
        console.log(data);  

        // Render country 1
        renderCountry(data);

        // Get neighbour country (2)
        const neighbour = data.borders?.[0]

        if(!neighbour) return;

        // AJAX call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://countries-api-836d.onrender.com/countries/alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function() {
        const data2 = JSON.parse(this.responseText)
        console.log(data2);

        renderCountry(data2, 'neighbour');
        });
    });
};
// getCountryData('portugal');
// getCountryData('usa');
// getCountryData('spain');
getCountryAndNeighbour('monaco');

////// Welcome to Callback Hell

setTimeout(() => {
    console.log('1 second passed');
    setTimeout(() => {
        console.log('2 seconds passed');
            setTimeout(() => {
            console.log('3 seconds passed');
                setTimeout(() => {
                console.log('4 seconds passed');
            }, 1000)
        }, 1000)
    }, 1000)
}, 1000)


// const request = new XMLHttpRequest();
//     request.open('GET', `https://countries-api-836d.onrender.com/countries/name/${country}`);
//     request.send();

// const request = fetch('https://countries-api-836d.onrender.com/countries/name/portugal')
// console.log(request);

//////////////////// LONG VERSION ////////////////////
// const getCountryData = function(country) {
//     fetch(`https://countries-api-836d.onrender.com/countries/name/${country}`).then(function(response) {
//         console.log(response);
//         return response.json();
//     })
//     .then(function (data) {
//         console.log(data)
//         renderCountry(data[0])
//     });
// };

const getJSON = function(url, errorMsg = 'Something went wrong') {
    return fetch(url).then(response => {

        if(!response.ok) throw new Error(`${errorMsg} (${response.status})`);

        return response.json();
    });
};

//// Before refactored error message ////
//////////////////// SHORT VERSION OF GETCOUNTRYDATA ////////////////////
// const getCountryData = function(country) {
//     // Country 1
//     fetch(`https://countries-api-836d.onrender.com/countries/name/${country}`)
//     .then(response => {
//         console.log(response);

//         if(!response.ok)
//             throw new Error(`Country not found (${response.status})`)

//         return response.json();
//     })
//     .then(data => {
//         renderCountry(data[0]);
//         // const neighbour = data[0].borders?.[0]
//         const neighbour = 'dfsfdsdf';
//         // console.log(data);

//         if (!neighbour) return;

//         // Country 2
//         return fetch(`https://countries-api-836d.onrender.com/countries/alpha/${neighbour}`);
//     })
//     .then(response => {
//         if(!response.ok)
//             throw new Error(`Country not found (${response.status})`)
//         return response.json()})
//     .then(data =>
//         renderCountry(data, 'neighbour'))
//        /////////////////OPTIONAL 3RD COUNTRY///////////////
//     //     const neighbour = data.borders?.[0]

//     //     if (!neighbour) return;

//     //     // Country 3
//     //     return fetch(`https://countries-api-836d.onrender.com/countries/alpha/${neighbour}`);
//     //   })
//     //   .then(response => response.json())
//     //   .then(data => renderCountry(data, 'neighbour'))
//     .catch(err => {
//         console.log(`${err} 💥💥💥`);
//         renderError(`Something went wrong 💥💥 ${err.message}. Try again!`)
//     })
//     .finally(() => {
//         countriesContainer.style.opacity = 1;
//     })
// };

const getCountryData = function(country) {
    // Country 1
    getJSON(`https://countries-api-836d.onrender.com/countries/name/${country}`, 'Country not found')
    .then(data => {
        renderCountry(data[0]);
        const neighbour = data[0].borders?.[0]
        // console.log(data);

        if (!neighbour) throw new Error('No neighbour found');

        // Country 2
        return getJSON(`https://countries-api-836d.onrender.com/countries/alpha/${neighbour}`, 'Country not found');
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
        console.log(`${err} 💥💥💥`);
        renderError(`Something went wrong 💥💥 ${err.message}. Try again!`)
    })
    .finally(() => {
        countriesContainer.style.opacity = 1;
    })
};

btn.addEventListener('click', function() {
    getCountryData('china');
});

getCountryData('australia')


// const timer = function() {
//     setTimeout(() => {
//     console.log('1 second passed')}
//     , 1000);}



const whereAmI = function(lat, lng) {
    // fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`)
    fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(res => {
        if(!res.ok) throw new Error(`Problem with geocoding ${res.status}`)
        return res.json()
    .then(data => {
       console.log(`You are in ${data.city}, ${data.country}`)
      return fetch(`https://countries-api-836d.onrender.com/countries/name/${data.country}`)    
        .then(res => {
           if(!res.ok)
             throw new Error(`Country not found (${res.status})`)
            return res.json()})
        .then(data =>
            renderCountry(data[0]))

      
    })
    .catch(err => {
    console.error(`${err.message} 💥💥💥`);
    }) .finally(() => {
        countriesContainer.style.opacity = 1;
    })
})
};
whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);



console.log('Test start');
setTimeout(()=> console.log('0 sec timer'), 0);
Promise.resolve('Resolved promise 1').then(res =>
    console.log(res));

Promise.resolve('Resolved promise 2').then(res=>{
    for (let i = 0; i < 1000000000; i++) {}
    console.log(res);
})

console.log('Test end');



const lotteryPromise = new Promise(function(resolve, reject){
   
    console.log('Lottery draw is happening 🔮')
    setTimeout(function() {
        if(Math.random() >= 0.5) {
            resolve('You WIN 💰');
        } else {
            reject(new Error('You lost your money 💩'));
    }
    }, 2000)
});

lotteryPromise.then(res => console.log(res)).catch(err => console.log(err));

// const lottery = function(resolve, reject){
//     if(Math.random() >= 0.5){
//         console.log('You WIN 💰')
//     } else {
//         console.log('You lost your money 💩');
//     }
// }

// lottery()

// Promisifying setTimeout
const wait = function(seconds) {
    return new Promise(function(resolve) {
        setTimeout(resolve, seconds * 1000);
    });
};

wait(1)
    .then(() => {
        console.log('1 second passed');
        return wait(1);
    })
    .then(() => {
        console.log('2 second passed');
        return wait(1);
    })
    .then(() => {
        console.log('3 second passed');
        return wait(1);
    })
    .then(() => console.log('4 seconds passed'));

// setTimeout(() => {
//     console.log('1 second passed');
//     setTimeout(() => {
//         console.log('2 seconds passed');
//             setTimeout(() => {
//             console.log('3 seconds passed');
//                 setTimeout(() => {
//                 console.log('4 seconds passed');
//             }, 1000)
//         }, 1000)
//     }, 1000)
// }, 1000)

Promise.resolve('abc').then(x => console.log(x));
Promise.reject(new Error('Problem!')).catch(x => console.log(x));




///////////////////////////////////
// Promisifying the Geolocation API

const getPosition = function() {
    return new Promise(function(resolve, reject) {
        // navigator.geolocation.getCurrentPosition(
        //     position => resolve(position), 
        //     err => reject(err)
        // );
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

// getPosition().then(pos => console.log(pos));


const whereAmI = function() {
    getPosition().then(pos => {
        const { latitude: lat, longitude: lng} = pos.coords;

        return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    })  
    .then(res => {
        if(!res.ok) throw new Error(`Problem with geocoding ${res.status}`)
        return res.json()
    .then(data => {
        /////// WHY DOES THIS NOT WORK /////////////
    //    console.log(`You are in ${data.city}, 
    //     ${data.country = 'United States of America' ? data.state: ''}
    //     , ${data.country}`)
    ////////////// THIS MAKES EVERY COUNTRY AMERICA, WHY??? /////////
    // const returnState = function() {
    //     if(data.country = 'United States of America') {
    //     return data.state
    // } else return ''}
    //    console.log(`You are in ${data.city}, ${returnState()}, ${data.country}`)
       console.log(`You are in ${data.city}, ${data.state}, ${data.country}`)

      return fetch(`https://countries-api-836d.onrender.com/countries/name/${data.country}`)    
        .then(res => {
           if(!res.ok)
             throw new Error(`Country not found (${res.status})`)
            return res.json()})
        .then(data =>
            renderCountry(data[0]))

      
    })
    .catch(err => {
    console.error(`${err.message} 💥💥💥`);
    }) .finally(() => {
        countriesContainer.style.opacity = 1;
    })
})
};

btn.addEventListener('click', whereAmI())

// const returnState = function() {
//     if(this.data.country = 'United States of America') {
//     return this.data.state
// }}


const imgContainer = document.querySelector('.images')

const wait = function(seconds) {
    return new Promise(function(resolve) {
        setTimeout(resolve, seconds * 1000);
    });
};

const createImage = function(imgPath) {
    return new Promise(function(resolve, reject) {
        const img = document.createElement('img');
        img.src = imgPath;

        img.addEventListener('load', function() {
            imgContainer.append(img);
   //     imgContainer.insertAdjacentHTML('beforeend', html) 
    resolve(img)
    })
    img.addEventListener('error', function() {
        reject(new Error('Image not found'))
})
})

}
let currentImg;


createImage('img/img-1.jpg')
    .then(img => {
        currentImg = img;
        console.log('Image 1 loaded');
        return wait(2);
    })
    .then (() => {
        currentImg.style.display = 'none';
        return createImage('img/img-2.jpg')
    })
    .then ((img) => {
        currentImg = img;
        console.log('Image 2 loaded');
        return wait(2);
    })
    .then (() => {
        currentImg.style.display = 'none';
        return createImage('img/img-3.jpg')
    })
    .catch(err => {
    console.error(`${err.message}`)
    })

const lotteryPromise = new Promise(function(resolve, reject){
   
    console.log('Lottery draw is happening 🔮')
    setTimeout(function() {
        if(Math.random() >= 0.5) {
            resolve('You WIN 💰');
        } else {
            reject(new Error('You lost your money 💩'));
    }
    }, 2000)
});

*/

const getPosition = function() {
    return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};



const whereAmI = async function() {
    try {// Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng} = pos.coords;

    // Reverse geocoding
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    if(!resGeo.ok) throw new Error('Problem getting location data')
    const dataGeo = await resGeo.json()

    // Country data
    ////// This is the same thing, and is happening in the background as below
    // fetch(`https://countries-api-836d.onrender.com/countries/name/${country}`).then(res => console.log(res));

   const res = await fetch(`https://countries-api-836d.onrender.com/countries/name/${dataGeo.country}`);
   if(!res.ok) throw new Error('Problem getting country')
   const data = await res.json()
   renderCountry(data[0]);

   return `You are in ${dataGeo.city}, ${dataGeo.country}`;
}       catch(err) {
    console.log(`${err} 💥`);
    renderError(`💥 ${err.message}`);

    // Reject promise returned from async function
    throw err;
   } 
};

console.log('1: Will get location');
// const city = whereAmI();
// console.log(city);
// whereAmI()
//     .then(city => console.log(`2: ${city}`))
//     .catch(err => console.log(`2: ${err.message}`))
//     .finally(() => console.log('3: Finished getting location'))

(async function() {
    try {
        const city = await whereAmI()
        console.log(`2: ${city}`)
    } catch(err) {
        console.log(`2: ${err.message}`)
    }
    console.log('3: Finished getting location')
})();