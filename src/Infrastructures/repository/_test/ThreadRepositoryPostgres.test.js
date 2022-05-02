const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
    });

    it('should persist thread', async () => {
      // Arrange
      const thread = new Thread({
        title: 'dicoding',
        body: 'Dicoding Indonesia',
      });
      const owner = 'user-123';
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(thread, owner);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const thread = new Thread({
        title: 'dicoding',
        body: 'Dicoding Indonesia',
      });
      const owner = 'user-123';
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const returnedThread = await threadRepositoryPostgres.addThread(thread, owner);

      // Assert
      expect(returnedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'dicoding',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyThreadExist function', () => {
    it('should throw NotFoundError when thread does not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExist('thread-000')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread exist', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExist('thread-123')).resolves.not.toThrowError(NotFoundError);

      await ThreadsTableTestHelper.cleanTable();
    });
  });

  describe('getThreadDetail function', () => {
    it('should return detail of requested thread', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId });

      // Action
      const result = await threadRepositoryPostgres.getThreadDetail(threadId);

      // Assert
      expect(result.id).toBeDefined();
      expect(result.title).toBeDefined();
      expect(result.body).toBeDefined();
      expect(result.date).toBeDefined();
      expect(result.username).toBeDefined();

      await ThreadsTableTestHelper.cleanTable();
    });
  });
});
