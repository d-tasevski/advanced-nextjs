import 'dotenv/config';

import { withItemData, statelessSessions } from '@keystone-next/keystone/session';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';

import User from './schemas/User';
import Product from './schemas/Product';
import ProductImage from './schemas/ProductImage';
import { insertSeedData } from './seed-data';

const databaseURL = process.env.DATABASE_URL || 'mongo://localhost:27017/keystone-sick-fits';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long the user should stay signed in
  secret: process.env.COOKIE_SECRET, // the secret used to sign the session token
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
  },
  // TODO: add initial roles
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      async onConnect(keystone) {
        console.log('Connected to mongoDB');
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }
      },
    },
    lists: createSchema({
      // Schema items go in here
      User,
      Product,
      ProductImage,
    }),
    ui: {
      // TODO: roles
      // Show the UI only for people who pass this test
      isAccessAllowed: ({ session }) => {
        return Boolean(session?.data);
      },
    },
    session: withItemData(statelessSessions(sessionConfig), {
      // GQL query, for example we can pass `id email name`
      User: `id`,
    }),
  })
);
