function geocode_find(address, limit = 15, countrycodes = 'de') {
  return fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=${encodeURIComponent(limit)}&countrycodes=${encodeURIComponent(countrycodes)}&accept-language=${encodeURIComponent(navigator.language || navigator.userLanguage)}&addressdetails=1`)
    .then(r => r.json())
    // filter out everything that is not a specific location
    .then(list => list.filter(({address}) => address.neighbourhood || address.suburb || address.postcode || address.road || address.house_number))

}

// extract interesting info from address strings
function address_to_string(a) {
  let whole = a;
  a = a.address;

  let interesting_keys = Object.keys(a).filter(k => address_to_string.uninteresting_keys.indexOf(k) == -1);

  // turn keys into values
  interesting_keys = interesting_keys.map(key => a[key]);

  if (a.road) {
    // we want these after them
    interesting_keys.push(a.road + (a.house_number ? (' ' + a.house_number) : ''));
  }

  return `${interesting_keys.join(", ")}, ${a.neighbourhood || a.suburb || a.postcode}, ${a.city || a.county}`;
}

address_to_string.uninteresting_keys = uninteresting_keys = ['city', 'country', 'country_code', 'house_number', 'neighbourhood', 'postcode', 'road', 'state', 'state_district', 'suburb', 'information'];
