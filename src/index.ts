import express, { Express } from 'express';
import { MongoClient } from 'mongodb';
import crypto from 'crypto';

console.log('Connecting to mongodb');
const mongo = new MongoClient('mongodb://127.0.0.1:27017');
mongo.connect()
  .then(() => console.log('Connected successfully to mongodb'))
  .catch(error => console.error(error));

const dbName = 'one-time-secret';

// Create a new express application instance
const app: Express = express();

app.use(express.json());

// Quick hack to work around cors restrictions in the dev
// environment. Not suitable for production.
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

// Define a route to handle GET requests to the root path ('/')
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Handler to create an encrypted message. Must be POST.
// Private data must never be sent via GET parameters
// even if it is expected to be short. Receives a single POST
// argument string `message` that is to be encrypted and stored
// in the database. The message is encrypted and stored in the
// database without the decription `key`, which is handled over
// to the user. The encrypted message is identified with a
// `publicId`, which is a random sequence of letters and numbers,
// unlike mongodb `_id` that has a sequentinal nature to it.
// Returns:
// * success: boolen - always true unless an exception happens
// * publicId: string - encoded message identificator
// * key: string - key to decrypt the message
app.post('/message/create', async (req, res) => {
  const db = mongo.db(dbName);

  const body = req.body as {
    message: string
  }

  const em = encryptMessage(body.message)

  const dbRecord = emToDb(em, randomString(10));

	await db.collection('messages').insertOne(dbRecord);

  res.send({
    success: true,
    publicId: dbRecord.publicId,
    key: em.key
  });
});

// Handler to decrypt the message. The handler accounts for and prevents
// a chance of a race condition when multiple handlers are retrieving
// the same message simultaneously (when the record in DB is found
// simultaneously and before it is deleted).
// Takes two arguments:
// * publicId: string - encoded message identificator
// * key: string - key to decrypt the message
// Returns:
// * success: boolen - true if decrypted successfully
// * message: string | undefined - if `success` if true, contains the
//            decrypted message, otherwise is not present.
// * error: string | undefined - if `success` if false, contains the
//            error message, otherwise is not present.
app.post('/message/retrieve', async (req, res) => {
  const db = mongo.db(dbName);

  const body = req.body as {
    publicId: string
    key: string
  }

  const messagesCl = db.collection('messages');

  const record =
    await db.collection('messages').findOne<DbMessageRecord>({
      publicId: body.publicId
    });

  if (!record) {
    res.send({
      success: false,
      error: "The message is not found"
    });
    return;
  }

  let decrypted
  try {
    decrypted = decryptMessage(dbToEm(record, body.key));
  } catch (error) {
    res.send({
      success: false,
      error: "Failed to decrypt the message"
    });
    return
  }

  const ack = await messagesCl.deleteOne(record);

  // Race condition check. If detected, should act as if the
  // message was not found.
  if (ack.deletedCount === 0) {
    res.send({
      success: false,
      error: "The message is not found"
    });
    return;
  }

  res.send({
    success: true,
    message: decrypted
  });
});

// The record that is stored in the database
export type DbMessageRecord = {
  iv: string
  encrypted: string
  publicId: string
}

// The encrypted representation of the message
export type EncryptedMessage = {
  iv: string
  key: string
  encrypted: string
}

// Produces a database record structure from the encrypted message.
// Omits the decryption `key` so that the record is saved safely.
export function emToDb(em: EncryptedMessage, publicId: string): DbMessageRecord {
  return {
    publicId,
    encrypted: em.encrypted,
    iv: em.iv
  }
}

// Produces an encrypted message object from the database record.
// Requires a `key` for the object to be decryptable.
export function dbToEm(record: DbMessageRecord, key: string) : EncryptedMessage {
  return {
    iv: record.iv,
    encrypted: record.encrypted,
    key: key
  }
}

// The actual function that performs encryption. Takes a single
// argument string `message` to be encoded and returns it's
// encoded representation `EncryptedMessage`.
export function encryptMessage(message: string) : EncryptedMessage {
  const algorithm = "aes-192-cbc";

  const secret = crypto.randomBytes(10);
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(secret, salt, 24);

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(message, 'utf8', 'hex') + cipher.final('hex');

  return {
    iv: Buffer.from(iv).toString("hex"),
    key: key.toString('hex'),
    encrypted
  }
}

// The excact reversal of `encryptMessage`. Takes an encrypted
// representation of the message `EncryptedMessage` and produces
// the original unencripted `string`.
export function decryptMessage(em: EncryptedMessage) : string {
  const algorithm = "aes-192-cbc";
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(em.key, 'hex'),
    Buffer.from(em.iv, 'hex')
  );

  return decipher.update(em.encrypted, 'hex', 'utf8') + decipher.final('utf8');
}

// Start the server listening on port 3000
app.listen(3000, () => {
  console.log('App is listening on port 3000!');
});

export function randomString(length: number): string {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	while (result.length < length) {
		result += characters[crypto.randomInt(characters.length)];
	}
	return result;
}