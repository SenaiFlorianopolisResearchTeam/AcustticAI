import ChapterCard from "../ui/Library/chapterCard"
import { caps } from "../ui/Library/caps"
import { Link } from "react-router-dom"

export default function CardList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {caps.map(item => (
        <Link to={`/chapters/${item.id}`} key={item.id} className="block">
          <ChapterCard title={item.title} subtitle={item.subtitle} />
        </Link>
      ))}
    </div>
  )
}
