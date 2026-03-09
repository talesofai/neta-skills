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

// API 原始返回数据结构
interface RawCommentListResponse {
  total: number;
  total_recursive?: number;
  page_index: number;
  page_size: number;
  list: Array<{
    uuid: string;
    content: string;
    ctime: string;
    mtime?: string;
    like_count?: number;
    reply_count?: number;
    user_uuid: string;
    user_nick_name: string;
    user_avatar_url: string;
    user_badges?: unknown[];
    parent_comment_uuid?: string | null;
    target_comment_uuid?: string | null;
    is_liked?: boolean;
  }>;
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
   * API: GET /v1/comment/comment-list
   */
  const getComments = async (
    collection_uuid: string,
    options?: {
      page_index?: number;
      page_size?: number;
    },
  ): Promise<CommentListResponse> => {
    const { page_index = 0, page_size = 20 } = options ?? {};
    const response = await client.get<RawCommentListResponse>(
      "/v1/comment/comment-list",
      {
        params: {
          parent_uuid: collection_uuid,
          page_index,
          page_size,
        },
      },
    );
    
    // 转换数据格式
    const data = response.data;
    return {
      comments: data.list.map((item) => ({
        uuid: item.uuid,
        content: item.content,
        ctime: item.ctime,
        mtime: item.mtime ?? item.ctime,
        like_count: item.like_count ?? 0,
        reply_count: item.reply_count ?? 0,
        user: {
          uuid: item.user_uuid,
          nick_name: item.user_nick_name,
          avatar_url: item.user_avatar_url,
          properties: {},
        },
        parent_comment_uuid: item.parent_comment_uuid ?? null,
        target_comment_uuid: item.target_comment_uuid ?? null,
        is_liked: item.is_liked ?? false,
      })),
      total: data.total,
      has_more: data.list.length === data.page_size,
      next_cursor: undefined,
    };
  };

  /**
   * 创建评论或回复评论
   * API: POST /v1/comment/comment
   */
  const createComment = async (
    payload: CreateCommentPayload,
  ): Promise<CreateCommentResponse> => {
    // 转换参数格式
    const transformedPayload = {
      content: payload.content,
      parent_uuid: payload.collection_uuid,
      parent_type: payload.parent_comment_uuid ? "comment" : "collection",
      at_users: [],
      ...(payload.parent_comment_uuid && {
        parent_comment_uuid: payload.parent_comment_uuid,
      }),
    };
    
    const response = await client.post<CreateCommentResponse>(
      "/v1/comment/comment",
      transformedPayload,
    );
    return response.data;
  };

  /**
   * 点赞/取消点赞评论
   * API: PUT /v1/comment/like
   */
  const toggleLike = async (
    comment_uuid: string,
    like: boolean,
  ): Promise<{ success: boolean }> => {
    const response = await client.put<{ success: boolean }>(
      "/v1/comment/like",
      {
        comment_uuid,
        is_cancel: !like,
      },
    );
    return response.data;
  };

  /**
   * 删除评论
   * API: DELETE /v1/comment/comment
   */
  const deleteComment = async (
    comment_uuid: string,
  ): Promise<{ success: boolean }> => {
    const response = await client.delete<{ success: boolean }>(
      "/v1/comment/comment",
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
