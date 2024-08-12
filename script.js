'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderCountry = function (data) {
    const html = `
<article class="country">
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

const getCountryAndNeighbor = function(country) {

    // AJAX call country 1
    const request = new XMLHttpRequest();
    request.open('GET', `https://countries-api-836d.onrender.com/countries/name/${country}`);
    request.send();


    request.addEventListener('load', function() {
        const [data] = JSON.parse(this.responseText);
        console.log(data);  

        // Render country 1
        renderCountry(data);

        // Get neighbor country (2)
        const neighbor = data.borders?.[0]

        if(!neighbor) return;

        // AJAX call country 1
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://countries-api-836d.onrender.com/countries/alpha/${neighbor}`);
    request2.send();

    request2.addEventListener('load', function() {
        const data2 = JSON.parse(this.responseText)
    });
    });
};
// getCountryData('portugal');
// getCountryData('usa');
// getCountryData('spain');
getCountryAndNeighbor('china');

