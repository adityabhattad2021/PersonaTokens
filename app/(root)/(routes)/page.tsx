"use client";
import Categories from "@/components/categories";
import SearchInput from "@/components/search-input";
import prismadb from "@/lib/prismadb";
import Characters from "../../../components/characters";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";




export default  function RootPage() {

  const router=useRouter();

  return (
    <div className="h-full p-4 space-y-2 flex justify-center items-center">
      <Button 
        onClick={()=>router.push("/marketplace")}
        size={"lg"}
      >
        Navigate to Marketplace
      </Button>
    </div>
  )
}
