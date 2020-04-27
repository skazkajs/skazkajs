const { expect } = require('../../../test.config');

const Email = require('./email');

describe('SES sms test', () => {
  it('It should test HTML email', async () => {
    const to = 'to';
    const source = 'source';
    const subject = 'subject';
    const html = 'html';
    const cc = 'cc';

    const params = new Email()
      .addTo(to)
      .addCc(cc)
      .setSource(source)
      .setSubject(subject)
      .setHtml(html)
      .getParams();

    expect(params.Destination.ToAddresses.length).to.be.equal(1);
    expect(params.Destination.ToAddresses[0]).to.be.equal(to);
    expect(params.Destination.CcAddresses.length).to.be.equal(1);
    expect(params.Destination.CcAddresses[0]).to.be.equal(cc);
    expect(params.Message.Body.Html.Charset).to.be.equal('UTF-8');
    expect(params.Message.Body.Html.Data).to.be.equal(html);
    expect(params.Message.Subject.Charset).to.be.equal('UTF-8');
    expect(params.Message.Subject.Data).to.be.equal(subject);
    expect(params.Source).to.be.equal(source);
  });

  it('It should test text email', async () => {
    const to = 'to';
    const source = 'source';
    const subject = 'subject';
    const text = 'text';

    const params = new Email()
      .addTo(to)
      .setSource(source)
      .setSubject(subject)
      .setText(text)
      .getParams();

    expect(params.Destination.ToAddresses.length).to.be.equal(1);
    expect(params.Destination.ToAddresses[0]).to.be.equal(to);
    expect(params.Destination.CcAddresses.length).to.be.equal(0);
    expect(params.Message.Body.Text.Charset).to.be.equal('UTF-8');
    expect(params.Message.Body.Text.Data).to.be.equal(text);
    expect(params.Message.Subject.Charset).to.be.equal('UTF-8');
    expect(params.Message.Subject.Data).to.be.equal(subject);
    expect(params.Source).to.be.equal(source);
  });

  it('It should test to array', async () => {
    const to1 = 'to1';
    const to2 = 'to2';
    const source = 'source';
    const subject = 'subject';
    const text = 'text';

    const params = new Email()
      .addTo([to1, to2])
      .setSource(source)
      .setSubject(subject)
      .setText(text)
      .getParams();

    expect(params.Destination.ToAddresses.length).to.be.equal(2);
    expect(params.Destination.ToAddresses[0]).to.be.equal(to1);
    expect(params.Destination.ToAddresses[1]).to.be.equal(to2);
    expect(params.Destination.CcAddresses.length).to.be.equal(0);
    expect(params.Message.Body.Text.Charset).to.be.equal('UTF-8');
    expect(params.Message.Body.Text.Data).to.be.equal(text);
    expect(params.Message.Subject.Charset).to.be.equal('UTF-8');
    expect(params.Message.Subject.Data).to.be.equal(subject);
    expect(params.Source).to.be.equal(source);
  });
});
