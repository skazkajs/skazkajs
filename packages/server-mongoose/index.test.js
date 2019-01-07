const App = require('@skazka/server'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const mongoose = require('./mongoose');
const mongooseModule = require('.');

const { host, axios } = global;

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

  afterAll(() => {
    mongoose.connection.close();
  });

  test('It should check mongoose in context', async () => {
    app.then(async (ctx) => {
      expect(ctx.mongoose).not.toBe(undefined);

      return ctx.response();
    });

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
    });
  });

  test('It should test User', async () => {
    app.then(async (ctx) => {
      const test = new User({ name: 'Test' });

      await test.save();

      const users = await User.find({ name: 'Test' });

      expect(users[0]._id.toString()).toEqual(test._id.toString()); // eslint-disable-line

      const user = await User.findOne({ _id: test._id }); // eslint-disable-line
      expect(user.name).toEqual('Test');

      await test.remove();

      return ctx.response(test);
    });

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data.name).toEqual('Test');
    });
  });
});
