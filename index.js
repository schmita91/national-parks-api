'use strict';

const API_KEY = 'dI8kfxBM2eD4LaOVtCneEq0TfC1TvTmTf6DrfEJz';
const endpoint = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson, maxResults) {
    $('#js-results-list').empty();
    for (let i = 0; i < responseJson.data.length & i < maxResults; i++) {
        $('#js-results-list').append(`
      <li>
        <h3>${responseJson.data[i].fullName}</h3>
        <p>${responseJson.data[i].description}</p>
        <a href="${responseJson.data[i].url}">Park Website</a>
      </li>`);
    };
    $('#js-results').removeClass('hidden');
}

function findParks(query, maxResults = 10) {
    const params = {
        api_key: API_KEY,
        stateCode: query,
        limit: maxResults,
    }

    
    const queryString = formatQueryParams(params);
    const url = endpoint + '?' + queryString;
    

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(response.statusText);
            }
        })
        .then(responseJson => displayResults(responseJson, maxResults))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
    $('form').submit(function (event) {
        event.preventDefault();
        const state = $('#js-state').val();
        const maxResults = $('#js-max-results').val();
        findParks(state, maxResults);
    });
}

$(function () {
    console.log('App loaded')
    watchForm();
});