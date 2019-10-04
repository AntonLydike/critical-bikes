class Group extends BaseModel {
  constructor(json = {}) {
    super(json);

    if (!json.participants) {
      json.participants = [];
    }
  }

  __getPath() {
    return Group.getPath({
      group: this.getId()
    });
  }

  isAtCapacity() {
    return this.json.capacity > 15;
  }

  getAddress() {
    return this.json.address;
  }

  getAddress() {
    return this.json.address;
  }

  isCreator() {
    return this.json.isCreator;
  }

  getTime() {
    return new Date(this.json.time);
  }

  getParticipants() {
    return this.json.participants;
  }

  setAddress(string) {
    this.json.address = string;
  }

  setLatLon(lat, lon) {
    this.json.lat = lat;
    this.json.lon = lon;
  }

  getLatLon() {
    return [this.json.lat, this.json.lon];
  }

  hasLatLon() {
    return !!this.json.lat && !!this.json.lon;
  }

  setCreator(username) {
    this.json.creator = username;
    this.json.isCreator = true;
  }
}

Group.getPath = ({group = ''}) => `/groups/${group}`;

Group.getAll = () => server.fetch('/groups')
