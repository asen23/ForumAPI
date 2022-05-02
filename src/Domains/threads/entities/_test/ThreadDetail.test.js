const CommentDetail = require('../../../comments/entities/CommentDetail');
const ThreadDetail = require('../ThreadDetail');

describe('a ThreadDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'abc',
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREADDETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: -1,
      title: -1,
      body: true,
      date: true,
      username: true,
      comments: true,
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREADDETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'id',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date: 'date',
      username: 'dicoding',
      comments: [{
        id: 'id',
        content: 'content',
        username: 'username',
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
      }],
    };

    // Action
    const { id, title, body, date, username, comments } = new ThreadDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments[0]).toEqual(new CommentDetail(payload.comments[0]));
  });
});
