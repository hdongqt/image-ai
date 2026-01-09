import moment from "moment"

const TYPE_DATE = {
  DATE: 'DD/MM/YYYY',
  DATE_TIME: 'DD/MM/YYYY HH:mm',
  DATE_TIME_SECOND: 'DD/MM/YYYY HH:mm:ss',
  TIME: 'HH:mm',
  TIME_SECOND: 'HH:mm:ss',
}

export const formatDate = (value: string | Date | number, format: string = TYPE_DATE.DATE_TIME) => {
  if (!value) return ''
  return moment(value).format(format)
}
