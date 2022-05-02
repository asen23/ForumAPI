const Reply = require('../../Domains/replies/entities/Reply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, owner, threadId, commentId) {
    await this._threadRepository.verifyThreadExist(threadId);
    await this._commentRepository.verifyCommentExist(commentId);
    const reply = new Reply(useCasePayload);
    return this._replyRepository.addReply(reply, owner, commentId);
  }
}

module.exports = AddReplyUseCase;
