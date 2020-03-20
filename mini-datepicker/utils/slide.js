export class Slide {
    /**
     * 上滑
     * @param {object} e 事件对象
     * @returns {boolean} 布尔值
     */
    isUp(gesture = {}, touche = {}) {
      const { startX, startY } = gesture;
      const deltaX = touche.clientX - startX;
      const deltaY = touche.clientY - startY;
      if (deltaY < -60 && deltaX < 20 && deltaX > -20) {
        this.slideLock = false;
        return true;
      } else {
        return false;
      }
    }
    /**
     * 下滑
     * @param {object} e 事件对象
     * @returns {boolean} 布尔值
     */
    isDown(gesture = {}, touche = {}) {
      const { startX, startY } = gesture;
      const deltaX = touche.clientX - startX;
      const deltaY = touche.clientY - startY;
      if (deltaY > 60 && deltaX < 20 && deltaX > -20) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 左滑
     * @param {object} e 事件对象
     * @returns {boolean} 布尔值
     */
    isLeft(gesture = {}, touche = {}) {
      const { startX, startY } = gesture;
      const deltaX = touche.clientX - startX;
      const deltaY = touche.clientY - startY;
      if (deltaX < -60 && deltaY < 20 && deltaY > -20) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 右滑
     * @param {object} e 事件对象
     * @returns {boolean} 布尔值
     */
    isRight(gesture = {}, touche = {}) {
      const { startX, startY } = gesture;
      const deltaX = touche.clientX - startX;
      const deltaY = touche.clientY - startY;
  
      if (deltaX > 60 && deltaY < 20 && deltaY > -20) {
        return true;
      } else {
        return false;
      }
    }
  }