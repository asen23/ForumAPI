/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
  async addLikes({
    id = 'comment_like-123', commentId = 'comment-123', owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comment_likes(id, owner, comment_id) VALUES($1, $2, $3)',
      values: [id, owner, commentId],
    };

    await pool.query(query);
  },

  async findCommentLikesByCommentId(id) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;
