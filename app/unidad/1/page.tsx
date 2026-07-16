import { getUnidad1Teoria } from '@/lib/content'
import { Unidad1View } from '@/components/unidad-1/unidad-1-view'

export default function Unidad1Page() {
  const { content } = getUnidad1Teoria()
  return <Unidad1View teoriaContent={content} />
}
