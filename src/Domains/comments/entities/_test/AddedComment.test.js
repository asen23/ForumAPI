const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'abc',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDEDCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: -1,
      content: true,
      owner: 'tes',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDEDCOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'dicoding',
      content: 'Dicoding Indonesia',
      owner: 'user-123',
    };

    // Action
    const { content, id, owner } = new AddedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
