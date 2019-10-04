class CreateGroupView extends BaseView {
  constructor(app, group) {
    super();

    this.app = app;
    this.group = group || new Group();

    this.events = {
      'submit form': (e) => {
        this.setLoading(true);
        e.preventDefault();

        geocode_find(e.target.elements.address.value.trim()).then(results => {
          this.setLoading(false);

          if (results.length == 0) {
            this.$('#errors').innerText = "Could not find any address matching your input...";
          } else if (results.length == 1) {
            this.createGroup(results[0]);
          } else {
            LocationSelectionDialog.asPromise(results).catch(abort => {
              this.$('#errors').innerText = "Please select a location from the list!";
            }).then(location => this.createGroup(location))
          }
        })
      }
    }
  }

  getHtml() {
    return `<form class="row">
        <h2>Create a new group</h2>
        <div class="input-field col s12 m8">
          <input type="text" name="address" id="address" required/>
          <label for="address">Address</label>
        </div>
        <div class="input-field col s12 m2">
          <input type="date" name="date" id="date" required value="${(new Date()).toISOString().split('T')[0]}"/>
          <label for="date">Date</label>
        </div>
        <div class="input-field col s12 m2">
          <input type="time" name="time" id="time" step="60" required/>
          <label for="time">Time</label>
        </div>
        <div class="col s12 center">
          <span class="red-text left" id="errors"></div>
          <button class="btn primary-fg right" type="submit">
            <div class="ring-loader small hide" id="loader"></div>Create</button>
        </div>
      </form>`;
  }

  createGroup(loc) {
    this.group.setAddress(loc.display_name);
    this.group.setLatLon(loc.lat, loc.lon);
    this.group.set
  }

  setLoading(state) {
    if (state) return this.$('#loader').classList.remove('hide');

    this.$('#loader').classList.add('hide');
  }
}
