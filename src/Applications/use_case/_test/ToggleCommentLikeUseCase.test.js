const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../Domains/comment_likes/CommentLikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ToggleCommentLikeUseCase = require('../ToggleCommentLikeUseCase');

describe('ToggleCommentLikeUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the toggle comment like action correctly', async () => {
    // Arrange
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.toggleCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await toggleCommentLikeUseCase.execute(owner, threadId, commentId);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(
      threadId,
    );
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(
      commentId,
    );
    expect(mockCommentLikeRepository.toggleCommentLike).toBeCalledWith(
      commentId,
      owner,
    );
  });
});
