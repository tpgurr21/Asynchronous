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
    // countriesContainer.style.opacity = 1;
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

*/

navigator.geolocation.getCurrentPosition()