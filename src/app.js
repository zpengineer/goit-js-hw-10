import countryListTpl from '../src/template/country-list.hbs';
import countryInfoTpl from '../src/template/country-info.hbs';
import fetchCountries from '../src/components/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
    input: document.querySelector('#search-box')
}
let countryName = '';

refs.input.addEventListener('input', debounce(getCountryName, DEBOUNCE_DELAY));

function getCountryName(e) {

    countryName = e.target.value.trim();
    clearList();

    fetchCountries(countryName)
        .then(data => {
            
            let dataLength = data.length;
            console.log(dataLength);

            if (1 < dataLength && dataLength < 10) {

                const markupList = countryListTpl(data);
                isertMarkup(markupList);

            } else if ( dataLength === 1) {
                const markupInfo = countryInfoTpl(data);
                isertMarkup(markupInfo);
            } else {
                Notify.info("Too many matches found. Please enter a more specific name.");
            }
        })
        .catch(onFetchError);

}

function clearList() {
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
}

function onFetchError(error) {
    console.log(error);
    if (countryName === '') {
        Notify.info('Please enter country name');
    } else {
        Notify.failure('Oops, there is no country with that name');
    }

}

function isertMarkup(item) {
    refs.info.insertAdjacentHTML('beforeend', item);
}