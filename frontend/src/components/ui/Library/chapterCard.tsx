import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"

type Props = {
  title: string
  subtitle: string
}

export default function ChapterCard({ title, subtitle }: Props) {
  return (
    <Card className="bg-[#29166380] border-0 rounded-2xl shadow-xl hover:scale-[1.03] transition-transform">
      <CardContent className="py-8 px-6">
        <CardTitle className="text-white text-2xl mb-2">{title}</CardTitle>
        <CardDescription className="text-[#d8cbff] text-lg font-poppins">
          {subtitle}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
