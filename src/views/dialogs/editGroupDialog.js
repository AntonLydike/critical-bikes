class EditGroupDialog extends BaseDialog {
  constructor(group, callback, err) {
    super([
      {
        id: 'btn_delete',
        text: 'delete group',
        color: 'red',
        close: false
      },
      BaseDialog.BTN_ACCEPT,
      BaseDialog.BTN_DISCARD,
    ], 800);

    this.group = group;

    this.events = {
      'click #btn_accept': e => {
        this.save().catch(err => {
          console.error("Error while editing group:", err);
          throw (err)
        }).then(callback).catch(err);
        this.close();
      },
      'click #btn_discard': e => {
        this.close();
        err();
      },
      'click #btn_delete': e => {
        ConfirmationDialog.asPromise('Do you really want to delete this group? This is not reversible.').then(() => {
          this.group.delete().then(callback).catch(err);
          this.close();
        })
      }
    }

    this.open();
  }

  getContent() {
    return `<form class="row">
      <h2>Change group details</h2>
        <div class="input-field col s12 m8">
          <input type="text" name="address" id="address" required value="${escapeHtml(this.group.getAddress())}"/>
          <label for="address">Meeting point</label>
        </div>
        <div class="input-field col s12 m4">
          <input type="time" name="time" id="time" step="60" required value="${this.group.getTime().toTimeString().substr(0,5)}"/>
          <label for="time">Time</label>
        </div>
        <div class="input-field col s12 m8">
          <input type="text" name="target" id="target" value="${escapeHtml(this.group.getDestination())}"/>
          <label for="target">Destination (optional)</label>
        </div>
        <div class="col s12 m4 center submit-col flex-row">
          <span class="red-text left flex-grow" id="errors"></span>
          <div class="ring-loader small hide" id="loader"></div>
        </div>
        <div class="col input-field s12">
          <textarea id="description" class="materialize-textarea" data-length="1024">${escapeHtml(this.group.getDescription())}</textarea>
          <label for="description">Description</label>
        </div>
      </form>`;
  }

  async save() {
    let oldAddress = this.group.getAddress();
    if (oldAddress != this.$('#address').value.trim()) {
      let locations = await geocode_find(this.$('#address').value.trim());
      if (locations.length == 0) {
        this.showError('Could not find any addresses for you input!');
        throw new Error("No location found");
      }

      let loc;
      if (locations.length == 0) {
        loc = locations[0];
      } else {
        loc = await LocationSelectionDialog.asPromise(locations);
      }

      this.group.setAddress(address_to_string(loc));
      this.group.setLatLon(loc.lat, loc.lon);
    }

    this.group.setTime((new Date()).setHours(0) + this.$('#time').valueAsNumber);

    this.group.setDestination(this.$('#target').value.trim())

    this.group.setDescription(this.$('#description').value.trim().substr(0,1024));

    return this.group.save();
  }

  showError(err) {
    this.$('#errors').innerText = escapeHtml(err);
  }

  opened() {
    new M.CharacterCounter(this.$('textarea[data-length]'))
  }
}

EditGroupDialog.asPromise = group => new Promise((res, rej) => new EditGroupDialog(group, res, rej));
