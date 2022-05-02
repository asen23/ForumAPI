const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, commentLikeRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
    this._replyRepository = replyRepository;
  }

  async execute(id) {
    await this._threadRepository.verifyThreadExist(id);
    const threadDetail = await this._threadRepository.getThreadDetail(id);
    const comments = await this._commentRepository.getCommentsByThreadId(id);
    const commentIds = comments.map((comment) => comment.id);
    const replies = await this._replyRepository.getRepliesByCommentIds(commentIds);
    const commentLikes = await this._commentLikeRepository.getCommentLikesByCommentIds(commentIds);
    const commentsWithReplies = comments.map((comment) => {
      const commentReplies = replies.filter((reply) => reply.comment_id === comment.id);
      const likeCount = commentLikes.filter((commentLike) => commentLike.comment_id === comment.id).length;
      return {
        ...comment,
        isDeleted: comment.is_deleted,
        date: comment.date.toISOString(),
        likeCount,
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

module.exports = GetThreadDetailUseCase;
