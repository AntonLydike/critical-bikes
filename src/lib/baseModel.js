class BaseModel {
  constructor(json) {
    this.json = json;
    this.deleted = false;

    // parse created timestamps
    if (this.json.created !== undefined && typeof this.json.created === 'string') {
      this.json.created = this.__parseDate(this.json.created);
    }

    console.log("[" + this.__proto__.constructor.name + ".constructor] ", json);
  }

  getId() {
    return this.json.id;
  }

  /**
   * Get a new version from the server
   */
  refresh() {
    console.log("[" + this.__proto__.constructor.name + ".refresh#promise] ", this);
    return BaseModel.server.get(this.__getPath()).then(json => {
      this.updateJson(json);
      console.log("[" + this.__proto__.constructor.name + ".refresh#resolve] ", this);
      return this;
    })

  }

  /**
   * save this version to the server
   */
  save() {
    console.log("[" + this.__proto__.constructor.name + ".save#promise] ", this);
    return BaseModel.server.post(this.__getPath(), this.json).then(json => {
      this.updateJson(json);
      console.log("[" + this.__proto__.constructor.name + ".save#resolve] ", this);
      return this;
    })
  }

  delete() {
    console.log("[" + this.__proto__.constructor.name + ".delete#promise] ", this);
    return BaseModel.server.delete(this.__getPath()).then(resp => {
      this.deleted = true;
      console.log("[" + this.__proto__.constructor.name + ".delete#resolve] ", this);
      return this;
    })
  }

  __parseDate(date) {
    return new Date(date + " UTC");
  }

  // a hook for when the model has been reloaded
  reloaded() {
    // noop
  }

  updateJson(newJson) {
    _.extend(this.json, newJson);
    this.reloaded();
  }
}

BaseModel.COLORS = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey'];
