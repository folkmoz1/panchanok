import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
require('dayjs/locale/th')

dayjs.extend(relativeTime)

dayjs.locale('th')


module.exports = { dayjs }
