function geocode(address, limit = 5, countrycodes = 'de') {
  return fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=${encodeURIComponent(limit)}&countrycodes=${encodeURIComponent(countrycodes)}`).then(r => r.json())
}
