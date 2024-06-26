import { randomString, encryptMessage, decryptMessage } from './index';

test('Start delay', async () => {
  await new Promise((r) => setTimeout(r, 2000));
})

test('randomString test', () => {
  expect(randomString(10).length).toBe(10);
  expect(randomString(10) === randomString(10)).toBe(false);
});

test('message encrypt, decrypt API', async () => {
  const message = 'Test message';
  const em1 = encryptMessage(message);
  const em2 = encryptMessage(message);

  expect(em1.iv.length).toBe(32);
  expect(em1.key.length).toBe(48);
  expect(em1.encrypted.length).toBe(32);

  expect(em2.iv.length).toBe(32);
  expect(em2.key.length).toBe(48);
  expect(em2.encrypted.length).toBe(32);

  expect(em1.iv === em2.iv).toBe(false);
  expect(em1.key === em2.key).toBe(false);
  expect(em1.encrypted === em2.encrypted).toBe(false);

  const dec1 = decryptMessage(em1);
  const dec2 = decryptMessage(em2);

  expect(dec1 === message).toBe(true);
  expect(dec2 === message).toBe(true);
});

// Way more tests are actually needed...