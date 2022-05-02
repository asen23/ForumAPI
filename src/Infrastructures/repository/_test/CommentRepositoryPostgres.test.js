const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const Comment = require('../../../Domains/comments/entities/Comment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('verifyCommentExist function', () => {
    it('should throw NotFoundError when comment does not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExist('comment-000')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment exist', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExist('comment-123')).resolves.not.toThrowError(NotFoundError);

      await CommentsTableTestHelper.cleanTable();
    });
  });

  describe('verifyCommentOwner function', () => {
    beforeAll(async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
    });

    afterAll(async () => {
      await CommentsTableTestHelper.cleanTable();
    });

    it('should throw AuthorizationError when comment does not owned by user', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-121')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment is owned by user', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('addComment function', () => {
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
    });

    it('should persist comment', async () => {
      // Arrange
      const comment = new Comment({
        content: 'dicoding',
        threadId: 'thread-123',
      });
      const owner = 'user-123';
      const threadId = 'thread-123';
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(comment, owner, threadId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsByThreadId(threadId);
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const comment = new Comment({
        content: 'dicoding',
      });
      const owner = 'user-123';
      const threadId = 'thread-123';
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const returnedComment = await commentRepositoryPostgres.addComment(comment, owner, threadId);

      // Assert
      expect(returnedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'dicoding',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should update deleted comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';
      const threadId = 'thread-123';
      await CommentsTableTestHelper.addComment({ id: commentId, threadId: threadId });

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsByThreadId(threadId);
      expect(comments[0].is_deleted).toEqual(true);

      await CommentsTableTestHelper.cleanTable();
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments from thread', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';
      const threadId = 'thread-123';
      await CommentsTableTestHelper.addComment({ id: commentId, threadId: threadId });

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(comments.length).toEqual(1);

      await CommentsTableTestHelper.cleanTable();
    });
  });
});
