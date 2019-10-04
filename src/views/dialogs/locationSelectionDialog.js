class LocationSelectionDialog extends BaseDialog {
  constructor(locations, select, discard) {
    super([
      BaseDialog.BTN_DISCARD
    ], 600);

    this.locations = locations;

    this.events = {
      'click #btn_discard': (e) => {
        this.close();
        discard();
      },
      'click .collection-item[data-index]': (e) => {
        let item = this.locations[e.target.getAttribute('data-index')];

        this.close();
        select(item);
      }
    }

    this.open();
  }

  getContent() {
    return `<div class="collection with-header">
      <li class="collection-header"><h4>Please select a location:</h4></li>
      ${this.locations.map((loc, i) => `<a data-index="${i}" class="collection-item">${escapeHtml(loc.display_name)}</a>`).join("")}
    </div>`;
  }
}

LocationSelectionDialog.asPromise = (locations) => new Promise((res, rej) => new LocationSelectionDialog(locations, res, rej));
