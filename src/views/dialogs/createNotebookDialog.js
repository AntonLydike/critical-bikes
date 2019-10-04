class CreateNotebookDialog extends BaseDialog {
  constructor(notebook, callback) {
    if (typeof notebook == 'function') {
      callback = notebook;
      notebook = null;
    }

    super();

    // enable editing existing notebooks
    if (notebook instanceof Notebook) {
      this.__notebook = notebook;
      notebook = notebook.json;
    } else {
      this.__notebook = new Notebook({name: null});
    }

    this.callback = callback || (x => x);

    this.events = {
      'click #btn_update': e => {
        this.$('form').submit();
      },
      'click #btn_create': e => {
        this.$('form').submit();
      },
      'submit form': e => {
        e.preventDefault();
        this.action();
      }
    }

    this.open();
  }

  action() {
    let name = this.$('input#name').value.trim();
    this.__notebook.setName(name);
    this.callback(this.__notebook.save());
    this.close();
  }

  getContent() {
    return `<form class="input-field">
      <input class="validate" required type="text" id="name" autofocus placeholder="name" value="${escapeHtml(this.__notebook.getName() || '')}" pattern="[^\\s].*[^\\s]"/>
      <span class="helper-text" data-error="You need to enter at least one letter!" data-success=""></span>
    </form>`;
  }
}

CreateNotebookDialog.asPromise = (book) => new Promise(res => new CreateNotebookDialog(book ? book : res, res));
