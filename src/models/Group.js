class Group extends BaseModel {
  constructor(json, notebook) {
    super(json);
  }

  __getPath() {
    return Group.getPath({
      group: this.getId()
    });
  }

  isAtCapacity() {
    return this.json.capacity > 16;
  }
}

Group.getPath = ({group = ''}) => `/groups/${group}`;

Group.getAll = () => server.fetch('/groups')
