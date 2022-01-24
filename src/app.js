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

refs.input.addEventListener('input', debounce(getCountryName, DEBOUNCE_DELAY));

function getCountryName(e) {

    let countryName = e.target.value.trim();
    clearList();

    fetchCountries(countryName)
        .then(data => {
            if (data.length > 10) {

                Notify.info("Too many matches found. Please enter a more specific name.");

            } else if (2 < data.length && data.length < 10) {

                const markupList = countryListTpl(data);
                isertMarkup(markupList);

            } else if (data.length < 2) {
                const markupInfo = countryInfoTpl(data);
                isertMarkup(markupInfo);
            }
        })
        .catch(onFetchError);

}

function clearList() {
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
}

function onFetchError(error) {
    Notify.failure('Oops, there is no country with that name');
}

function isertMarkup(item) {
    refs.info.insertAdjacentHTML('beforeend', item);
}