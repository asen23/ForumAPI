const CommentLikeRepository = require('../../Domains/comment_likes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async toggleCommentLike(commentId, owner) {
    const id = `comment_like-${this._idGenerator()}`;

    const searchQuery = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(searchQuery);

    if (result.rows.length === 0) {
      const query = {
        text: 'INSERT INTO comment_likes(id, comment_id, owner) VALUES($1, $2, $3)',
        values: [id, commentId, owner],
      };

      await this._pool.query(query);
    } else {
      const query = {
        text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND owner = $2',
        values: [commentId, owner],
      };

      await this._pool.query(query);
    }
  }

  async getCommentLikesByCommentIds(ids) {
    const commentsQuery = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = ANY($1::text[])',
      values: [ids],
    };

    const comments = await this._pool.query(commentsQuery);

    return comments.rows;
  }
}

module.exports = CommentLikeRepositoryPostgres;
