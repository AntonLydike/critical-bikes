class GroupItemView extends BaseView {
  constructor(group) {
    super();
    this.group = group;
  }

  getHtml() {
    return `<div class="group-item z-depth-2 flex flex-row ${this.group.isCreator() ? 'is-creator' : ''}">
      <div class="map-part" style="width: 300px">
      </div>
      <div class="group-body">
        <div class="group-location">${escapeHtml(this.group.getAddress())}</div>
        <div class="group-date">${escapeHtml((new Date(this.group.getTime())).toLocaleString())}</div>
        <div class="group-note">${escapeHtml(this.group.getDescription()) || '<p class="grey-text">No description provided.</p>'}</div>
      </div>
      <div class="btn-floating btn-large waves-effect waves-light primary-fg-flat">
        <i class="material-icons">add</i>
      </div>
      ${this.group.isCreator() ? '<div class="edit-button primary-fg-flat"><i class="material-icons">edit</i></div>' : ''}
    </div>`
  }

  rendered() {
    const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const OSM_ATTRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    this.leaflet = L.map(this.$('.map-part')).setView(this.group.getLatLon(), 16);

    L.tileLayer(OSM_URL, {
  	   attribution: OSM_ATTRIB,
    }).addTo(this.leaflet);

    L.marker(this.group.getLatLon()).addTo(this.leaflet);

  }
}
