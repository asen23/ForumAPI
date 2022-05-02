const Comment = require('../../Domains/comments/entities/Comment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, owner, threadId) {
    await this._threadRepository.verifyThreadExist(threadId);
    const comment = new Comment(useCasePayload);
    return this._commentRepository.addComment(comment, owner, threadId);
  }
}

module.exports = AddCommentUseCase;
