import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'

export class Order {
  id: number;
  orderStatus: string;
  orderType: string;
  versionDesc: string;
  durationDesc: string;
  email: string;
  phone: string;
  realPrice: number; 
  expireTime: number; 
  payType: string;
  wechatQrcode: string;
  alipayJumpUrl: string;
  payTime: number;
  createTime: number;
  updateTime: number;
  passport: Passport;

  constructor(id: number, orderStatus: string, orderType: string, versionDesc: string, durationDesc: string, 
    email: string, phone: string, realPrice: number, expireTime: number, payType: string, 
    wechatQrcode: string, alipayJumpUrl: string, payTime: number, createTime: number, 
    updateTime: number, passport: Passport) {
      this.id = id;
      this.orderStatus = orderStatus;
      this.orderType = orderType;
      this.versionDesc = versionDesc;
      this.durationDesc = durationDesc;
      this.email = email;
      this.phone = phone;
      this.realPrice = realPrice;
      this.expireTime = expireTime;
      this.payType = payType;
      this.wechatQrcode = wechatQrcode;
      this.alipayJumpUrl = alipayJumpUrl;
      this.payTime = payTime;
      this.createTime = createTime;
      this.updateTime = updateTime;
      this.passport = passport;
  }
}

export class Passport {
  id: number;
  passportId: string;
  email: string;
  userType: string;
  totalAmount: number;
  expireDays: number;
  expireTime: number;
  orderId: string;
  createTime: number;

  constructor(id: number, passportId: string, email: string, userType: string, totalAmount: number, expireDays: number, expireTime: number, orderId: string, createTime: number) {
    this.id = id;
    this.passportId = passportId;
    this.email = email;
    this.userType = userType;
    this.totalAmount = totalAmount;
    this.expireDays = expireDays;
    this.expireTime = expireTime;
    this.orderId = orderId;
    this.createTime = createTime;
  }
}

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string },
    model: string
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
}

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
      model: params.model,
    }
  }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVersionInfo<T>(accessToken : string) {
  return post<T>({
    url: '/version/info',
    data: { accessToken }
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

export function createOrder<Order>(version : string, duration : string, email : string, phone : string) {
  return post<Order>({
    url: '/order/createOrder',
    data: { version, duration, email, phone },
  })
}

export function payOrder<Order>(orderId : string, payType : string, device: string) {
  return post<Order>({
    url: '/order/prePayOrder',
    data: { orderId, payType, device},
  })
}

export function getOrderDetail<Order>(orderId : string, identify : string) {
  return post<Order>({
    url: '/order/getOrderDetail',
    data: { orderId, identify},
  })
}

export function trial<T>(email : string) {
  return post<T>({
    url: '/order/trial',
    data: {email}
  })
}
