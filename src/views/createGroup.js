class CreateGroupView extends BaseDialog {
  constructor(app, group) {
    super([], 1024, {autodestroy: false});

    this.app = app;
    this.group = group || new Group();

    this.isOpen = false;

    this.events = {
      'click #open-create-group-window': e => {
        e.preventDefault();
        this.open();
      },
      'submit form': (e) => {
        e.preventDefault();
        this.setLoading(true);

        geocode_find(e.target.elements.address.value.trim()).then(results => {
          this.setLoading(false);

          if (results.length == 0) {
            this.$('#errors').innerText = "Could not find any address matching your input...";
          } else if (results.length == 1) {
            this.createGroup(results[0]);
          } else {
            LocationSelectionDialog.asPromise(results).then(location => this.createGroup(location)).catch(abort => {
              console.error(abort);
              this.$('#errors').innerText = "Please select a location from the list!";
            })
          }
        })
      }
    }
  }

  getHtml() {
    return super.getHtml() + ` <div class="btn-floating btn-large waves-effect waves-light primary-fg-flat" id="open-create-group-window">
      <i class="material-icons">add</i>
    </div>`;
  }

  getContent() {
    return `<form class="row">
        <h2>Create a new group</h2>
        <div class="input-field col s12 m6 l8">
          <input type="text" name="address" id="address" required/>
          <label for="address">Meeting point</label>
        </div>
        <div class="input-field col s12 m3 l2">
          <input type="date" name="date" id="date" required value="${(new Date()).toISOString().split('T')[0]}"/>
          <label for="date">Date</label>
        </div>
        <div class="input-field col s12 m3 l2">
          <input type="time" name="time" id="time" step="60" required/>
          <label for="time">Time</label>
        </div>
        <div class="input-field col s12 m6 l8">
          <input type="text" name="target" id="target"/>
          <label for="target">Destination (optional)</label>
        </div>
        <div class="col s12 m6 l4 center submit-col flex-row">
          <span class="red-text left flex-grow" id="errors"></span>
          <button class="btn primary-fg right" type="submit">
            <div class="ring-loader small hide" id="loader"></div>
            Create
          </button>
        </div>
      </form>`;
  }

  createGroup(loc) {
    this.group.setAddress(address_to_string(loc));
    this.group.setLatLon(loc.lat, loc.lon);
    this.group.setDestination(this.$('#target').value.trim());

    this.group.setTime(this.$('#date').valueAsDate.setHours(0) + this.$('#time').valueAsNumber);

    SignupDialog.ensureSignedIn(this.app.server).then(() => {
      this.group.setCreator(this.app.server.username);
      this.group.save().then(() => {
        this.app.addGroup(this.group);
        this.reset();
      })
    }).catch(err => {
      console.error(err);
      this.$('#errors').innerText = "You have to choose a username to create a group!";
    })
  }

  setLoading(state) {
    if (state) return this.$('#loader').classList.remove('hide');

    this.$('#loader').classList.add('hide');
  }

  reset() {
    this.group = new Group();
    this.redraw();
    this.close();
  }
}
