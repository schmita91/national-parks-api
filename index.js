'use strict';

const API_KEY = 'dI8kfxBM2eD4LaOVtCneEq0TfC1TvTmTf6DrfEJz';
const endpoint = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params, readyStateCodes) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
        console.log(queryItems);
    const stateCodeString = readyStateCodes;
    console.log(stateCodeString);
    console.log(queryItems);
    return queryItems.join('&') + '&' + stateCodeString;
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
        limit: maxResults,
    }

    function formatStateCodes (query){let stateCodeString = ('stateCode=' + query);
    console.log(stateCodeString);
    return stateCodeString;
    }

    const readyStateCodes = formatStateCodes(query);

    
    const queryString = formatQueryParams(params, readyStateCodes);
    const url = endpoint + '?' + queryString;
    console.log(url);
    

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
        const stateArray = state.split(',');
        console.log(stateArray);
        const maxResults = $('#js-max-results').val();
        findParks(stateArray, maxResults);
    });
}

$(function () {
    console.log('App loaded')
    watchForm();
});