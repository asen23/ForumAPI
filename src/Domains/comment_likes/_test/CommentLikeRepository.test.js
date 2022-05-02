const CommentLikeRepository = require('../CommentLikeRepository');

describe('CommentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentLikeRepository = new CommentLikeRepository();

    // Action and Assert
    await expect(commentLikeRepository.toggleCommentLike({})).rejects.toThrowError('COMMENTLIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentLikeRepository.getCommentLikesByCommentIds({})).rejects.toThrowError('COMMENTLIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
