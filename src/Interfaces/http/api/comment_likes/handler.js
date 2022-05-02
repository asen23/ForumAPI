const ToggleCommentLikeUseCase = require('../../../../Applications/use_case/ToggleCommentLikeUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.toggleCommentLikeHandler = this.toggleCommentLikeHandler.bind(this);
  }

  async toggleCommentLikeHandler(request, h) {
    const { id } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const toggleCommentLikeUseCase = this._container.getInstance(ToggleCommentLikeUseCase.name);
    await toggleCommentLikeUseCase.execute(id, threadId, commentId);

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
