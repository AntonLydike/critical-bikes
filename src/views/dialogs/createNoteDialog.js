class CreateNoteDialog extends BaseDialog {
  constructor(note, callback) {
    super();

    // enable editing existing notes
    if (note instanceof Note) {
      this.__note = note;
      note = note.json;
    } else {
      if (!note.folder) throw new Error("Cannot create new note without a folder specified!");
      this.__note = new Note(note, note.folder);
      delete note.folder;
    }

    this.note = note;
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
    this.__note.setName(name);
    this.callback(this.__note.save());
    this.close();
  }

  getContent() {
    return `<form class="input-field">
      <input class="validate" required type="text" id="name" autofocus placeholder="name" value="${escapeHtml(this.note.name || '')}" pattern="[^\\s].*[^\\s]"/>
      <span class="helper-text" data-error="You need to enter at least one letter!" data-success=""></span>
    </form>`;
  }
}

CreateNoteDialog.asPromise = note => new Promise(res => new CreateNoteDialog(note, res));
