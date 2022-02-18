const calculateHours = (attendence, loggOut) => {
    const differentTime = loggOut - attendence.loggedIn
    const formatedTime = new Date(differentTime)
    const workedHours = formatedTime.getHours()-2
    const workedMin = formatedTime.getMinutes()
    const workedTime =`${workedHours}hr:${workedMin}min`
    return workedTime
  };

const checkDate = (createdAt, queryDate) => {
    const fullDate =  new Date(createdAt)
    const day = fullDate.getDate()
    const month = fullDate.getMonth() //january is 0
    const year = fullDate.getFullYear()
    // const date = (month<10)?`${year}-${month++}-${day}`
    const date =`${year}-${month}-${day}`
    if(date !== queryDate){
      return false;
    }
    return true
  };
  
  export { calculateHours , checkDate };