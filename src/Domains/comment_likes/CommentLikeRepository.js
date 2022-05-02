class CommentLikeRepository {
  async toggleCommentLike(id, owner) {
    throw new Error('COMMENTLIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentLikesByCommentIds(ids) {
    throw new Error('COMMENTLIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentLikeRepository;
