function geocode_find(address, limit = 15, countrycodes = 'de') {
  return fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=${encodeURIComponent(limit)}&countrycodes=${encodeURIComponent(countrycodes)}&accept-language=${encodeURIComponent(navigator.language || navigator.userLanguage)}`).then(r => r.json())
}
