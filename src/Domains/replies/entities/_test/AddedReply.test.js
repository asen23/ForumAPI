const AddedReply = require('../AddedReply');

describe('a AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'abc',
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDEDREPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: -1,
      content: true,
      owner: 'tes',
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDEDREPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Dicoding Indonesia',
      owner: 'user-123',
    };

    // Action
    const { content, id, owner } = new AddedReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
