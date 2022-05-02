/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      references: 'users(id)',
      referencesConstraintName: 'comment_likes_owner',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      references: 'comments(id)',
      referencesConstraintName: 'comment_likes_comment_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comment_likes');
};
