const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const id = 'thread-123';
    const expectedThreadDetail = new ThreadDetail({
      id: id,
      title: 'Thread',
      body: 'body',
      date: '2022-02-01T17:00:00.000Z',
      username: 'username',
      comments: [{
        id: 'id',
        content: 'content',
        username: 'username',
        date: '2022-02-01T17:00:00.000Z',
        isDeleted: false,
        replies: [{
          id: 'id',
          content: 'reply',
          username: 'user',
          date: '2022-02-01T17:00:00.000Z',
          isDeleted: false,
        }],
      }],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadDetail = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: id,
        title: 'Thread',
        body: 'body',
        date: new Date('2022-02-01T17:00:00.000Z'),
        username: 'username',
      }));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'id',
        content: 'content',
        username: 'username',
        date: new Date('2022-02-01T17:00:00.000Z'),
        is_deleted: false,
      }]));
    mockReplyRepository.getRepliesByCommentIds = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'id',
        content: 'reply',
        username: 'user',
        date: new Date('2022-02-01T17:00:00.000Z'),
        is_deleted: false,
        comment_id: 'id',
      }]));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedThread = await getThreadDetailUseCase.execute(id);

    // Assert
    expect(addedThread).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(
      id,
    );
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(
      id,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      id,
    );
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalledWith(
      ['id'],
    );
  });
});
