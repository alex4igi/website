import { getCalendar } from '@/lib/db'
import CalendarEditor from './calendar-editor'

export const dynamic = 'force-dynamic'

export default async function AdminCalendarPage() {
  const data = await getCalendar()
  return <CalendarEditor initialData={data} />
}
