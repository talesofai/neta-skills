import type { AxiosInstance } from "axios";
import type { UserInfo } from "./user.ts";

export interface Comment {
  uuid: string;
  content: string;
  ctime: string;
  mtime: string;
  like_count: number;
  reply_count: number;
  user: {
    uuid: string;
    nick_name: string;
    avatar_url: string;
    properties: UserInfo["properties"];
  };
  parent_comment_uuid?: string | null;
  target_comment_uuid?: string | null;
  is_liked: boolean;
}

export interface CommentListResponse {
  comments: Comment[];
  total: number;
  has_more: boolean;
  next_cursor?: string;
}

export interface CreateCommentPayload {
  /** 目标合集 UUID */
  collection_uuid: string;
  /** 评论内容 */
  content: string;
  /** 父评论 UUID（回复评论时必填） */
  parent_comment_uuid?: string;
  /** 目标评论 UUID（@某人时用） */
  target_comment_uuid?: string;
}

export interface CreateCommentResponse {
  comment: Comment;
  success: boolean;
}

export const createCommentApis = (client: AxiosInstance) => {
  /**
   * 获取合集评论列表
   */
  const getComments = async (
    collection_uuid: string,
    options?: {
      cursor?: string;
      page_size?: number;
    },
  ): Promise<CommentListResponse> => {
    const { cursor, page_size = 20 } = options ?? {};
    const response = await client.get<CommentListResponse>(
      "/v1/story/story-comments",
      {
        params: {
          storyId: collection_uuid,
          cursor,
          page_size,
        },
      },
    );
    return response.data;
  };

  /**
   * 创建评论或回复评论
   */
  const createComment = async (
    payload: CreateCommentPayload,
  ): Promise<CreateCommentResponse> => {
    const response = await client.post<CreateCommentResponse>(
      "/v1/story/story-comment",
      payload,
    );
    return response.data;
  };

  /**
   * 点赞/取消点赞评论
   */
  const toggleLike = async (
    comment_uuid: string,
    like: boolean,
  ): Promise<{ success: boolean }> => {
    const response = await client.post<{ success: boolean }>(
      "/v1/story/comment-like",
      {
        comment_uuid,
        like,
      },
    );
    return response.data;
  };

  /**
   * 删除评论
   */
  const deleteComment = async (
    comment_uuid: string,
  ): Promise<{ success: boolean }> => {
    const response = await client.delete<{ success: boolean }>(
      "/v1/story/story-comment",
      {
        params: {
          comment_uuid,
        },
      },
    );
    return response.data;
  };

  return {
    getComments,
    createComment,
    toggleLike,
    deleteComment,
  };
};
