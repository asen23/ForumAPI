const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const Reply = require('../../../Domains/replies/entities/Reply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('verifyReplyExist function', () => {
    it('should throw NotFoundError when reply does not exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyExist('reply-000')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply exist', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123', threadId: 'thread-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyExist('reply-123')).resolves.not.toThrowError(NotFoundError);

      await RepliesTableTestHelper.cleanTable();
    });
  });

  describe('verifyReplyOwner function', () => {
    beforeAll(async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123' });
    });

    afterAll(async () => {
      await RepliesTableTestHelper.cleanTable();
    });

    it('should throw AuthorizationError when reply does not owned by user', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-121')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when reply is owned by user', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('addReply function', () => {
    afterEach(async () => {
      await RepliesTableTestHelper.cleanTable();
    });

    it('should persist reply', async () => {
      // Arrange
      const reply = new Reply({
        content: 'dicoding',
        commentId: 'comment-123',
      });
      const owner = 'user-123';
      const commentId = 'comment-123';
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(reply, owner, commentId);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesByCommentId(commentId);
      expect(replies).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      const reply = new Reply({
        content: 'dicoding',
      });
      const owner = 'user-123';
      const commentId = 'comment-123';
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const returnedReply = await replyRepositoryPostgres.addReply(reply, owner, commentId);

      // Assert
      expect(returnedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'dicoding',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteReply function', () => {
    it('should update deleted reply', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const replyId = 'reply-123';
      const commentId = 'comment-123';
      await RepliesTableTestHelper.addReply({ id: replyId, commentId: commentId });

      // Action
      await replyRepositoryPostgres.deleteReply(replyId);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesByCommentId(commentId);
      expect(replies[0].is_deleted).toEqual(true);

      await RepliesTableTestHelper.cleanTable();
    });
  });

  describe('getRepliesByCommentIds function', () => {
    it('should get replies from comments', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const replyId1 = 'reply-123';
      const replyId2 = 'reply-124';
      const commentId1 = 'comment-123';
      const commentId2 = 'comment-124';
      const commentIds = [commentId1, commentId2];
      await CommentsTableTestHelper.addComment({ id: commentId2 });
      await RepliesTableTestHelper.addReply({ id: replyId1, commentId: commentId1 });
      await RepliesTableTestHelper.addReply({ id: replyId2, commentId: commentId2 });

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentIds(commentIds);

      // Assert
      expect(replies.length).toEqual(2);

      await RepliesTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
    });
  });
});
