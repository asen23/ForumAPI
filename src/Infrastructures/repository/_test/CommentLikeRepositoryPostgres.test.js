const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');
const pool = require('../../database/postgres/pool');

describe('CommentLikeRepositoryPostgres', () => {
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

  describe('toggleCommentLike function', () => {
    afterEach(async () => {
      await CommentLikesTableTestHelper.cleanTable();
    });

    it('should persist like', async () => {
      // Arrange
      const owner = 'user-123';
      const commentId = 'comment-123';
      const fakeIdGenerator = () => '123'; // stub!
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentLikeRepositoryPostgres.toggleCommentLike(commentId, owner);

      // Assert
      const commentLikes = await CommentLikesTableTestHelper.findCommentLikesByCommentId(commentId);
      expect(commentLikes).toHaveLength(1);
    });

    it('should delete like if existed', async () => {
      // Arrange
      const owner = 'user-123';
      const commentId = 'comment-123';
      const fakeIdGenerator = () => '123'; // stub!
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentLikeRepositoryPostgres.toggleCommentLike(commentId, owner);
      await commentLikeRepositoryPostgres.toggleCommentLike(commentId, owner);

      // Assert
      const commentLikes = await CommentLikesTableTestHelper.findCommentLikesByCommentId(commentId);
      expect(commentLikes).toHaveLength(0);
    });
  });

  describe('getCommentLikesByCommentIds function', () => {
    it('should get commentLikes from comments', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});
      const commentLikeId1 = 'comment_like-123';
      const commentLikeId2 = 'comment_like-124';
      const commentId1 = 'comment-123';
      const commentId2 = 'comment-124';
      const owner1 = 'user-123';
      const owner2 = 'user-124';
      const commentIds = [commentId1, commentId2];
      await UsersTableTestHelper.addUser({ id: owner2, username: 'heyhey' });
      await CommentsTableTestHelper.addComment({ id: commentId2 });
      await CommentLikesTableTestHelper.addLikes({ id: commentLikeId1, commentId: commentId1, owner: owner1 });
      await CommentLikesTableTestHelper.addLikes({ id: commentLikeId2, commentId: commentId2, owner: owner2 });

      // Action
      const commentLikes = await commentLikeRepositoryPostgres.getCommentLikesByCommentIds(commentIds);

      // Assert
      expect(commentLikes.length).toEqual(2);

      await CommentLikesTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
    });
  });
});
