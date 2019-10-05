class Group extends BaseModel {
  constructor(json = {}) {
    super(json);

    if (!json.participants) {
      json.participants = [];
    }

    if (json.time) {
      json.time = +json.time;
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
    return new Date(+this.json.time);
  }

  setTime(date) {
    if (date instanceof Date) {
      date = date.valueOf();
    }

    this.json.time = date;
  }

  getParticipants() {
    return this.json.participants;
  }

  getCount() {
    return this.json.participants.length;
  }

  setAddress(string) {
    this.json.address = string;
  }

  getDestination() {
    return this.json.destination;
  }

  setDestination(dest) {
    this.json.destination = dest;
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

  getDescription() {
    return this.json.description;
  }

  setDescription(desc) {
    this.json.description = desc;
  }

  isParticipating() {
    return this.json.participants.some(part => part.isMe);
  }
}

Group.getPath = ({group = ''}) => `/groups/${group}`;

Group.getAll = () => server.fetch('/groups')
