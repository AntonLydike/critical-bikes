class ConfirmationDialog extends BaseDialog {
  constructor(message, acceptCallback, rejectCallback) {
    super([
      BaseDialog.BTN_NO,
      BaseDialog.BTN_YES,
    ]);

    this.acceptCallback = acceptCallback || (x => x);
    this.rejectCallback = rejectCallback || (x => x);

    this.events = {
      'click #btn_yes': e => {
        this.acceptCallback();
        this.close();
      },
      'click #btn_no': e => {
        this.rejectCallback();
        this.close();
      }
    }

    this.message = message;

    this.open();
  }

  getContent() {
    return this.message;
  }
}

ConfirmationDialog.asPromise = message => new Promise((res, rej) => {new ConfirmationDialog(message, res, rej)});
