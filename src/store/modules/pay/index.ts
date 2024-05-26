import { defineStore } from 'pinia'

export enum Version {
  EMPTY = "空",
  CLASSIC = "经典版",
  PROFESSIONAL = "专业版"
}

export enum Duration {
  EMPTY = "空",
  MONTHLY = "1个月",
  QUARTER = "3个月",
  YEAR = "12个月"
}


export const draftOrderStore = defineStore('draftOrder', {
  state: () => {
    return { 
      version : Version.EMPTY,
      duration : Duration.EMPTY,
      phone: "",
      email: "",
     }
  },
  actions: {

  },

  getters: {
    // 计算实付价
    calculateRealPrice() : number {
      // 1个月 经典版 10块 专业版 30块
      // 3个月 7折
      // 12个月 5折
      let price = 0
      if (this.duration === Duration.EMPTY) {
        return price
      }
      if (this.version === Version.CLASSIC) {
        price = 10
      } else if (this.version === Version.PROFESSIONAL) {
        price = 30
      }
      if (this.duration === Duration.QUARTER) {
        price = price * 3 / 10 * 7
      } else if (this.duration === Duration.YEAR) {
        price = price * 12 / 10 * 5
      }
      return price
    },

    // 计算原价
    calculateOriginalPrice() : number {
      // 1个月 经典版 10块 专业版 30块
      let price = 0
      if (this.duration === Duration.EMPTY) {
        return price
      }
      if (this.version === Version.CLASSIC) {
        price = 10
      } else if (this.version === Version.PROFESSIONAL) {
        price = 30
      }
      if (this.duration === Duration.QUARTER) {
        price = price * 3
      } else if (this.duration === Duration.YEAR) {
        price = price * 12
      }
      return price
    },
  },
})

