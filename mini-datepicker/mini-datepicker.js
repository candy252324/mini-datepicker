Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: {
    /** 默认日期 */
    defaultDate: {
      type: String,
      value: "",
    },
    /** 从周几开始 */
    today: {
      type: String,
      value: "monday",
    },
    /** 从周几开始 */
    startDay: {
      type: String,
      value: "monday",
    },
    /** 默认展示周视图还是月视图 */
    defaultviewType: {
      type: String,
      value: "week",  // "month" or "week"
    },
  },

  data: {
    /** 当前是周视图还是月视图 */
    currentViewType: "",
    headerDate: "",
    weeks: [],
    days: [],
    /** 被点击的日期, 格式：2020-3-5 */
    activeDateStr: "",
    /** 今天，格式：2020-3-5*/
    todayStr: ""
  },
  attached() {
    let defaultviewType = this.data.defaultviewType || "month"
    let weeks = this.getWeek(this.data.startDay === "monday")
    let days = defaultviewType === "month"
      ? this.getMonthData(this.data.defaultDate)
      : this.getWeekData(this.data.defaultDate)

    let defaultDateArr = this.formatDate(this.data.defaultDate).split("-")
    let headerDate = defaultDateArr[0] + " 年 " + defaultDateArr[1] + " 月"
    this.setData({
      currentViewType: defaultviewType,
      weeks,
      days,
      headerDate,
      todayStr: this.formatDate(this.data.today),
      activeDateStr: this.formatDate(this.data.defaultDate),
    })
  },
  methods: {
    /** 点击某个日期 */
    chooseDate(e) {
      const value = e.currentTarget.dataset.value
      const { year, month, date, calDate, dateStr } = value
      if (date !== calDate && this.currentViewType === "month") return
      /** 用户点击的日期 */
      let activeDateStr = `${year}-${month}-${date}`
      if (this.data.currentViewType === "month") {
        this.setData({
          currentViewType: "week",
        })
      }
      let days = this.data.currentViewType === "month"
        ? this.getMonthData(activeDateStr)
        : this.getWeekData(activeDateStr)
      this.setData({
        days,
        activeDateStr,
        headerDate: `${year} 年 ${month} 月`
      })
      this.triggerEvent('chooseDate', {
        viewType: this.data.currentViewType,
        date: dateStr
      });
    },
    toggleMode() {
      this.setData({
        currentViewType: this.data.currentViewType === "month" ? "week" : "month",
      })
      const activeDateStr = this.data.activeDateStr
      const arr = activeDateStr.split("-")
      let days = this.data.currentViewType === "month"
        ? this.getMonthData(activeDateStr)
        : this.getWeekData(activeDateStr)
      this.setData({
        days,
        headerDate: `${arr[0]} 年 ${arr[1]} 月`
      })
    },
    /**
     * 左右切换
     * @param {string}} type "pre" or "next"
     */
    toggleDate(e) {
      const type = e.currentTarget.dataset.type
      let newActiveDateStr = ""
      if (this.data.currentViewType === "month") {
        newActiveDateStr = this.getActiveDateStrByMonth(this.data.activeDateStr, type)
      } else {
        newActiveDateStr = this.getActiveDateStrByWeek(this.data.activeDateStr, type)
      }

      let arr = newActiveDateStr.split("-")
      let days = this.data.currentViewType === "month"
        ? this.getMonthData(newActiveDateStr)
        : this.getWeekData(newActiveDateStr)
      this.setData({
        activeDateStr: newActiveDateStr,
        headerDate: `${arr[0]} 年 ${arr[1]} 月`,
        days
      })
      this.triggerEvent('chooseDate', {
        viewType: this.data.currentViewType,
        date: newActiveDateStr
      });
    },
    /**
     * 月视图下，左右切换时，获取新的高亮日期
     * @param {string} curActiveDateStr 当前高亮的日期
     * @param {string} type "pre" or "next"
     */
    getActiveDateStrByMonth(curActiveDateStr, type) {
      const arr = curActiveDateStr.split("-")
      const year = +arr[0]
      const month = +arr[1]
      const date = +arr[2]
      let newYear = year, newMonth = month, newDate = date
      /** 上月最后一天 */
      const lastMonthLastDate = new Date(year, month - 1, 0).getDate()
      /** 下月最后一天 */
      const nextMonthLastDate = new Date(year, month + 1, 0).getDate()
      if (type === "pre") {
        newYear = month === 1 ? year - 1 : year
        newMonth = month === 1 ? 12 : month - 1
        // 如果上月最后一天的日期<当前月的日期
        if (lastMonthLastDate < date) {
          newDate = lastMonthLastDate
        }
      } else if (type == "next") {
        newYear = month === 12 ? year + 1 : year
        newMonth = month === 12 ? 1 : month + 1
        newDate = date
        // 如果下月最后一天的日期<当前月的日期
        if (nextMonthLastDate < date) {
          newDate = nextMonthLastDate
        }
      }
      return `${newYear}-${newMonth}-${newDate}`
    },
    /**
     * 周视图下，左右切换时，获取新的高亮日期
     * @param {string} curActiveDateStr 当前高亮的日期
     * @param {string} type "pre" or "next"
     */
    getActiveDateStrByWeek(curActiveDateStr, type) {
      const arr = curActiveDateStr.split("-")
      const year = +arr[0]
      const month = +arr[1]
      const date = +arr[2]

      let newYear = year, newMonth = month, newDate = date;
      /** 上月最后一天 */
      const lastMonthLastDate = new Date(year, month - 1, 0).getDate()
      /** 本月最后一天 */
      const curMonthLastDate = new Date(year, month, 0).getDate()
      if (type === "pre") {
        // 如果减7小于0， 说明跳月了
        if (date - 7 <= 0) {
          newYear = month === 1 ? year - 1 : year
          newMonth = month === 1 ? 12 : month - 1
          newDate = lastMonthLastDate + date - 7
        } else {
          newDate = date - 7
        }
      } else if (type == "next") {
        // 如果加7大于本月最后一天，说明跳月了
        if (date + 7 > curMonthLastDate) {
          newYear = month === 12 ? year + 1 : year
          newMonth = month === 12 ? 1 : month + 1
          newDate = (date + 7) - curMonthLastDate
        } else {
          newDate = date + 7
        }
      }
      return `${newYear}-${newMonth}-${newDate}`
    },
    /**
     * @param {boolean} isStartFromMonday 是否是从周一开始
     */
    getWeek(isStartFromMonday) {
      if (isStartFromMonday) {
        return ["一", "二", "三", "四", "五", "六", "日"]
      } else {
        return ["日", "一", "二", "三", "四", "五", "六"]
      }
    },
    /** 获取周视图数据 */
    getWeekData(defaultDate) {
      /** 是否是从周一开始 */
      const isStartFromMonday = this.data.startDay === "monday"
      if (!defaultDate) {
        defaultDate = new Date()
      }
      const YEAR = new Date(defaultDate).getFullYear()
      const MONTH = new Date(defaultDate).getMonth() + 1
      const DATE = new Date(defaultDate).getDate()
      const WEEK = isStartFromMonday
        ? new Date(defaultDate).getDay() || 7
        : new Date(defaultDate).getDay()
      /** 上月最后一天 */
      let lastDayOfLastMonth = new Date(YEAR, MONTH - 1, 0)
      /** 上月最后一天是周几 */
      let lastDateOfLastMonth = lastDayOfLastMonth.getDate()
      /** 当月最后一天 */
      let lastDay = new Date(YEAR, MONTH, 0)
      /** 当月最后一天是几号 */
      let lastDate = lastDay.getDate()

      var ret = []
      /** 前面有几天 */
      let preCount = isStartFromMonday ? WEEK - 1 : WEEK
      for (let i = 0; i < 7; i++) {
        /** 用于计算的日期，可能为负数，可能大于当月最后一天 */
        let date = i + (DATE - preCount)
        /** 真实的日期 */
        let showDate = date
        /** 真实的月 */
        let showMonth = MONTH
        /** 真实的年 */
        let showYear = YEAR
        if (date <= 0) {
          // 上个月
          showMonth = MONTH - 1
          showDate = lastDateOfLastMonth + date
        } else if (date > lastDate) {
          // 下个月
          showMonth = MONTH + 1
          showDate = showDate - lastDate
        }
        if (showMonth === 0) {
          showMonth = 12
          showYear = YEAR - 1
        }
        if (showMonth === 13) {
          showMonth = 1
          showYear = YEAR + 1
        }
        ret.push({
          year: showYear,
          month: showMonth,
          date: showDate,
          calDate: date,
          dateStr: `${showYear}-${showMonth}-${showDate}`
        })
      }
      return ret
    },
    /**
     * 获取月视图数据
     * @param {string} activeDateStr 高亮日期
     */
    getMonthData(activeDateStr) {
      /** 是否是从周一开始 */
      const isStartFromMonday = this.data.startDay === "monday"
      if (!activeDateStr) {
        activeDateStr = new Date()
      }
      const YEAR = new Date(activeDateStr).getFullYear()
      const MONTH = new Date(activeDateStr).getMonth() + 1

      var ret = []
      /** 当月第一天 */
      let firstDay = new Date(YEAR, MONTH - 1, 1)
      /** 当月第一天是周几 */
      let firstDayWeekDay = isStartFromMonday
        ? firstDay.getDay() || 7
        : firstDay.getDay()
      /** 如果是从周一开始，且该月第一天是周日，则转换成 1 2 3 4 5 6 7 */
      if (isStartFromMonday && firstDayWeekDay === 0) {
        firstDayWeekDay = 7
      }
      /** 上月最后一天 */
      let lastDayOfLastMonth = new Date(YEAR, MONTH - 1, 0)
      /** 上月最后一天是周几 */
      let lastDateOfLastMonth = lastDayOfLastMonth.getDate()
      /** 前面有几天是属于上个月的 */
      let preMonthDayCount = isStartFromMonday ? firstDayWeekDay - 1 : firstDayWeekDay

      /** 当月最后一天 */
      let lastDay = new Date(YEAR, MONTH, 0)
      /** 当月最后一天是几号 */
      let lastDate = lastDay.getDate()

      for (let i = 0; i < 7 * 6; i++) {
        /** 用于计算的日期，可能为负数，可能大于当月最后一天 */
        let date = i + 1 - preMonthDayCount
        /** 真实的日期 */
        let showDate = date
        /** 真实的月 */
        let showMonth = MONTH
        /** 真实的年 */
        let showYear = YEAR
        if (date <= 0) {
          // 上个月
          showMonth = MONTH - 1
          showDate = lastDateOfLastMonth + date
        } else if (date > lastDate) {
          // 下个月
          showMonth = MONTH + 1
          showDate = showDate - lastDate
        }
        if (showMonth === 0) {
          showMonth = 12
          showYear = YEAR - 1
        }
        if (showMonth === 13) {
          showMonth = 1
          showYear = YEAR + 1
        }
        ret.push({
          year: showYear,
          month: showMonth,
          date: showDate,
          calDate: date,
          dateStr: `${showYear}-${showMonth}-${showDate}`
        })
      }
      return ret
    },
    formatDate(date) {
      let d = new Date(date || Date.now())
      return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
    }
  }
});
