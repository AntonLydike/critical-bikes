class GroupItemView extends BaseView {
  constructor(group) {
    super();
    this.group = group;

    this.events = {
      'click .edit-button': e => {
        EditGroupDialog.asPromise(this.group).then(g => this.redraw());
      },
      'click .join-leave-button': e => {
        SignupDialog.ensureSignedIn(server).then(empty => {
          if (this.group.isParticipating()) {
            this.group.leave().then(x => this.redraw());
          } else {
            this.group.join().then(x => this.redraw());
          }
        })
      }
    }
  }

  getHtml() {
    if (this.group.deleted) return null;

    return `<div class="group-item z-depth-2 flex flex-row ${this.group.isCreator() ? 'is-creator' : ''}">
      <div class="map-part" style="width: 300px">
      </div>
      <div class="group-body flex-col flex-grow">
        <div class="group-location">
          ${escapeHtml(this.group.getAddress())}
          ${this.group.getDestination() ? `<i class="material-icons">arrow_forward</i> ${escapeHtml(this.group.getDestination())}` : ''}
        </div>
        <div class="group-date grey-text">Every weekday at ${this.prettyTime(this.group.getTime())}</div>
        <i class="group-note flex-grow">${escapeHtml(this.group.getDescription()) || '<i class="grey-text">No description provided.</i>'}</i>
        <div class="group-participants">With: ${this.group.getParticipants().map(p => `<span class="${p.isMe ? 'is-me primary-text' : ''}">${escapeHtml(p.name)}</span>`).join(", ")}</div>
        <div class="group-buttons align-right">
          <a class="join-leave-button btn primary-fg-flat waves-effect waves-light">
            ${this.group.isParticipating() ? 'I can\'t make it' : 'I\'ll be there'}
          </a>
        </div>
      </div>
      ${this.group.isCreator() ? '<div class="edit-button primary-fg-flat"><i class="material-icons">edit</i></div>' : ''}
    </div>`
  }

  prettyTime(date) {
    return date.getHours() + ':' + ("0" + date.getMinutes()).substr(-2);
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
