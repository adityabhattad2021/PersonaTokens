import Categories from "@/components/categories";
import SearchInput from "@/components/search-input";
import prismadb from "@/lib/prismadb";
import Characters from "./character/[characterId]/components/characters";


interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  }
}

export default async function RootPage({ searchParams }: RootPageProps) {

  const data = await prismadb.character.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: {
        search: searchParams.name
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      _count: {
        select: {
          messages: true,
        }
      }
    }
  })

  const categoires = await prismadb.category.findMany();

  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories
        data={categoires}
      />
      <Characters
        data={data}
      />
    </div>
  )
}
