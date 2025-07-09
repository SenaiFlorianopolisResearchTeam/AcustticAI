import CardList from "../../components/ui/cardlist" 

export default function Library() {
  return (
    <section className="w-full max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-white font-poppins mb-10">
        Biblioteca Virtual
      </h1>
      <CardList />
    </section>
  )
}
