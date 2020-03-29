const App = require('@skazka/server'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const { expect, axios, host } = require('../../../test.config');

const mongoose = require('./mongoose');
const mongooseModule = require('.');

describe('Server mongoose test', async () => {
  const { Schema } = mongoose;

  const UserSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Name is required.'],
    },
  });

  const User = mongoose.model('user', UserSchema);

  let app;
  let server;

  beforeEach(() => {
    app = new App();
    app.all([
      error(),
      mongooseModule(),
      response(),
    ]);
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  after(() => {
    mongoose.connection.close();
  });

  it('It should check mongoose in context', async () => {
    app.then(async (ctx) => {
      expect(ctx.mongoose).not.to.be.an('undefined');

      return ctx.response();
    });

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });
  });

  it('It should test User', async () => {
    app.then(async (ctx) => {
      const test = new User({ name: 'Test' });

      await test.save();

      const users = await User.find({ name: 'Test' });

      expect(users[0]._id.toString()).equal(test._id.toString()); // eslint-disable-line

      const user = await User.findOne({ _id: test._id }); // eslint-disable-line
      expect(user.name).equal('Test');

      await test.remove();

      return ctx.response(test);
    });

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data.name).equal('Test');
    });
  });
});
