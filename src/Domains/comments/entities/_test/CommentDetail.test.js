const CommentDetail = require('../CommentDetail');
const ReplyDetail = require('../../../replies/entities/ReplyDetail');

describe('a CommentDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'abc',
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError('COMMENTDETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: -1,
      content: true,
      username: 'tes',
      date: 1.0,
      likeCount: 'yes',
      isDeleted: 'yes',
      replies: true,
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError('COMMENTDETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'dicoding',
      content: 'Dicoding Indonesia',
      username: 'user',
      date: 'date',
      likeCount: 1,
      isDeleted: false,
      replies: [{
        id: 'id',
        content: 'reply',
        username: 'user',
        date: 'date',
        isDeleted: false,
      }],
    };

    // Action
    const { content, id, username, date, likeCount, replies } = new CommentDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(likeCount).toEqual(payload.likeCount);
    expect(replies[0]).toEqual(new ReplyDetail(payload.replies[0]));
  });

  it('should display deleted comment content correctly', () => {
    // Arrange
    const payload = {
      id: 'dicoding',
      content: 'Dicoding Indonesia',
      username: 'user-123',
      date: 'date',
      likeCount: 1,
      isDeleted: true,
      replies: [{
        id: 'id',
        content: 'reply',
        username: 'user',
        date: 'date',
        isDeleted: false,
      }],
    };

    // Action
    const { content, id, username, date, likeCount, replies } = new CommentDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**komentar telah dihapus**');
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(likeCount).toEqual(payload.likeCount);
    expect(replies[0]).toEqual(new ReplyDetail(payload.replies[0]));
  });
});
