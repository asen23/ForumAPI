class ToggleCommentLikeUseCase {
  constructor({ threadRepository, commentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(owner, threadId, commentId) {
    await this._threadRepository.verifyThreadExist(threadId);
    await this._commentRepository.verifyCommentExist(commentId);
    return this._commentLikeRepository.toggleCommentLike(commentId, owner);
  }
}

module.exports = ToggleCommentLikeUseCase;
