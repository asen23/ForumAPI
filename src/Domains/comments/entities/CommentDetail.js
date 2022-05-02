const ReplyDetail = require('../../replies/entities/ReplyDetail');

class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, username, date, likeCount, isDeleted, replies } = payload;

    this.id = id;
    this.content = content;
    if (isDeleted === true) {
      this.content = '**komentar telah dihapus**';
    }
    this.username = username;
    this.date = date;
    this.likeCount = likeCount;
    this.replies = [];
    for (const reply of replies) {
      this.replies.push(new ReplyDetail(reply));
    }
  }

  _verifyPayload({ id, content, username, date, likeCount, isDeleted, replies }) {
    if (!id || !content || !username || !date || likeCount === undefined || isDeleted === undefined || replies === undefined) {
      throw new Error('COMMENTDETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof likeCount !== 'number' ||
      typeof isDeleted !== 'boolean' ||
      replies.constructor !== Array
    ) {
      throw new Error('COMMENTDETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentDetail;
