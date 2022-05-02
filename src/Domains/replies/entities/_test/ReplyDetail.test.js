const ReplyDetail = require('../ReplyDetail');

describe('a ReplyDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'abc',
    };

    // Action and Assert
    expect(() => new ReplyDetail(payload)).toThrowError('REPLYDETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: -1,
      content: true,
      username: 'tes',
      date: 1.0,
      isDeleted: 'yes',
    };

    // Action and Assert
    expect(() => new ReplyDetail(payload)).toThrowError('REPLYDETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'dicoding',
      content: 'Dicoding Indonesia',
      username: 'user',
      date: 'date',
      isDeleted: false,
    };

    // Action
    const { content, id, username, date } = new ReplyDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
  });

  it('should display deleted reply content correctly', () => {
    // Arrange
    const payload = {
      id: 'dicoding',
      content: 'Dicoding Indonesia',
      username: 'user-123',
      date: 'date',
      isDeleted: true,
    };

    // Action
    const { content, id, username, date } = new ReplyDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**balasan telah dihapus**');
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
  });
});
