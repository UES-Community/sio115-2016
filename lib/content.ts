import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface UnidadContent {
  title: string
  unit: number
  subject: string
  content: string
}

export function getUnidad1Teoria(): UnidadContent {
  const filePath = path.join(process.cwd(), 'content/unidad-1/teoria.md')
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  return {
    title: (data.title as string) ?? 'Conceptualización de un Sistema Operativo',
    unit: Number(data.unit) || 1,
    subject: (data.subject as string) ?? 'Sistemas Operativos',
    content,
  }
}
