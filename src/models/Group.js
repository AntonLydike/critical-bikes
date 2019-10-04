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
}

Group.getPath = ({group = ''}) => `/groups/${group}`;

Group.getAll = () => server.fetch('/groups')
