class CreateFolderDialog extends BaseDialog {
  constructor(folder, callback) {
    super();

    // enable editing existing folders
    if (folder instanceof Folder) {
      this.__folder = folder;
      folder = folder.json;
    } else {
      if (!folder.notebook) throw new Error("Cannot create new folder without a notebook specified!");
      this.__folder = new Folder(folder, folder.notebook);
      delete folder.notebook;
    }

    this.folder = folder;
    this.callback = callback || (x => x);

    this.events = {
      'submit form': e => {
        e.preventDefault();
        this.action();
      }
    }

    this.open();
  }

  action() {
    let name = this.$('input#name').value.trim();
    this.__folder.setName(name);
    this.callback(this.__folder.save());
    this.close();
  }

  getContent() {
    return `<form class="input-field">
      <input class="validate" required type="text" id="name" autofocus placeholder="name" value="${escapeHtml(this.folder.name || '')}" pattern="[^\\s].*[^\\s]"/>
      <span class="helper-text" data-error="You need to enter at least one letter!" data-success=""></span>
    </form>`;
  }
}

CreateFolderDialog.asPromise = folder => new Promise(res => new CreateFolderDialog(folder, res));
