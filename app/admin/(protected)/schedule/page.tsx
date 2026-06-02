import { getSchedule } from '@/lib/db'
import ScheduleEditor from './schedule-editor'

export const dynamic = 'force-dynamic'

export default async function AdminSchedulePage() {
  const data = await getSchedule()
  return <ScheduleEditor initialData={data} />
}
