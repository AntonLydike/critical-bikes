class ImpressumDialog extends BaseDialog {
  constructor() {
    super([
      BaseDialog.BTN_CLOSE
    ]);

    this.open();
  }

  getContent() {
    return `<h5>Impressum</h5>
    <p><b>Critical</b>Bikes is an open source project from Students for Future Augsburg, licensed under the <a target="_blank" rel="noopener" href="https://www.gnu.org/licenses/agpl-3.0.html">AGPLv3 License</a>. The source code can be found
    <a target="_blank" rel="noopener" href="https://github.com/AntonLydike/critical-bikes">here</a>. Contributing is encouraged!</p>
    <p>We suggest hosting one instance per local region. since these are strictly a local events, a distributed system is preferable for a multitude of reasons.</p>
    <p>This instance is hosted by __CONTACT__.</p>`
  }
}
