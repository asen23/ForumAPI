const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(id) {
    await this._threadRepository.verifyThreadExist(id);
    const threadDetail = await this._threadRepository.getThreadDetail(id);
    const comments = await this._commentRepository.getCommentsByThreadId(id);
    const commentIds = comments.map((comment) => comment.id);
    const replies = await this._replyRepository.getRepliesByCommentIds(commentIds);
    const commentsWithReplies = comments.map((comment) => {
      const commentReplies = replies.filter((reply) => reply.comment_id === comment.id);
      return {
        ...comment,
        isDeleted: comment.is_deleted,
        date: comment.date.toISOString(),
        replies: commentReplies.map((reply) => ({
          ...reply,
          isDeleted: reply.is_deleted,
          date: reply.date.toISOString(),
        })),
      };
    });

    return new ThreadDetail({
      ...threadDetail,
      comments: commentsWithReplies,
      date: threadDetail.date.toISOString(),
    });
  }
}

module.exports = GetThreadUseCase;
