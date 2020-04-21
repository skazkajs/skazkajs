class Email {
  constructor() {
    this.subject = '';
    this.source = '';
    this.text = '';
    this.html = '';
    this.to = [];
    this.cc = [];
  }

  setSubject(subject) {
    this.subject = subject;

    return this;
  }

  setSource(source) {
    this.source = source;

    return this;
  }

  setText(text) {
    this.text = text;

    return this;
  }

  setHtml(html) {
    this.html = html;

    return this;
  }

  addTo(to) {
    if (Array.isArray(to)) {
      this.to.push(...to);
    } else {
      this.to.push(to);
    }

    return this;
  }

  addCc(cc) {
    this.cc.push(cc);

    return this;
  }

  getParams() {
    const Body = {};

    if (this.text) {
      Body.Text = {
        Charset: 'UTF-8',
        Data: this.text,
      };
    }

    if (this.html) {
      Body.Html = {
        Charset: 'UTF-8',
        Data: this.html,
      };
    }

    return {
      Destination: {
        ToAddresses: this.to,
        CcAddresses: this.cc,
      },
      Message: {
        Body,
        Subject: {
          Charset: 'UTF-8',
          Data: this.subject,
        },
      },
      Source: this.source,
    };
  }
}

module.exports = Email;
