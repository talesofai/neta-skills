import type { AxiosInstance } from "axios";

interface TextRichText {
  type: "text";
  text: string;
  color?: string;
  weight?: string;
  size?: string;
}

interface SPUBenefit {
  icon: string;
  rich_text: TextRichText[];
}

export interface SPU {
  uuid: string;
  name: string;
  config: {
    icon: string;
    icon_bg_color: string;
    usage: string;
    tips_icon?: string;
    tips?: string;
    success_toast_msg: string;
    once?: boolean;
    is_vip_monthly?: boolean;
    is_time_limit?: boolean;
    is_first_limit?: boolean;
    origin_price?: string;
    apple_pay?: boolean;
    badge?: string;
    bonus?: string;
    benefits?: SPUBenefit[];
    group_id?: string;
    purchase_limit?: number;
    isbanner?: boolean;
  } | null;
  price: string;
}

export type OrderStatus = "UNPAID" | "PAID" | "COMPLETED" | "CLOSED";

export interface Order {
  uuid: string;
  status: OrderStatus;
  status_history: {
    status: OrderStatus;
    time: string;
  }[];
  price: string;
  spu: SPU;
  valid_until: string;
  ctime: string;
  mtime: string;
}

export const createCommerceApis = (client: AxiosInstance) => {
  const listPlansConfig = async () => {
    const res = await client.get<{
      namespace: string;
      key: string;
      value: string;
      type: "string" | "int" | "json";
    } | null>("/v1/configs/config", {
      params: {
        namespace: "fe_configs",
        key: "plans",
      },
    });
    return res.data;
  };

  const createOrder = async (params: { spu_uuid: string }) => {
    const res = await client.post<Order>("/v1/commerce/orders", params);
    return res.data;
  };

  const orders = async (params: { page_index: number; page_size: number }) => {
    const res = await client.get<{
      list: Order[];
      total: number;
    }>("/v1/commerce/orders", {
      params,
    });
    return res.data;
  };

  const order = async (params: { order_uuid: string }) => {
    const res = await client.get<Order>(
      `/v1/commerce/orders/${params.order_uuid}`,
    );
    return res.data;
  };

  const pay = async (params: {
    order_uuid: string;
    channel: "stripe-checkout";
    return_url?: string;
    redirect_url?: string;
  }) => {
    const { order_uuid, channel, return_url, redirect_url } = params;

    return client
      .post<{
        checkout_session_url: string;
        checkout_session_id: string;
      }>(`/v1/commerce/orders/${order_uuid}/payment/${channel}`, {
        redirect_url,
        return_url,
      })
      .then((res) => res.data);
  };

  return {
    listPlansConfig,
    createOrder,
    orders,
    order,
    pay,
  };
};
