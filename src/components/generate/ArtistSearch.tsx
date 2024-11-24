import { useState } from "react"
import { X } from "lucide-react"
import { Card, CardContent } from "@components/ui/Card"
import { Badge } from "@components/ui/Badge"
import Image from "next/image"
import EmptyListImg from "@public/empty-list.svg"
import { SearchCombobox } from "./SearchInput"
import ExampleItemImg from "./example-item-img.png"

// Mock data for artists
const options = [
  {
    id: 1,
    title: "Holding Absence",
    icon: ExampleItemImg,
  },
  {
    id: 2,
    title: "Hollywood Undead",
    icon: ExampleItemImg,
  },
  {
    id: 3,
    title: "Bring Me The Horizon",
    icon: ExampleItemImg,
  },
  {
    id: 4,
    title: "Architects",
    icon: ExampleItemImg,
  },
]

export default function ArtistSearch() {
  const [selectedValues, setSelectedValues] = useState<number[]>([])

  const removeSelectedItem = (id: number) => {
    const newSelectedItems = selectedValues.filter((item) => item !== id)
    setSelectedValues(newSelectedItems)
  }

  const selectedItems = options.filter((option) =>
    selectedValues.includes(option.id)
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <SearchCombobox
          options={options}
          values={selectedValues}
          onChange={setSelectedValues}
        />
        {selectedValues.length === 0 ? (
          <div className="mt-8 text-center text-secondary">
            <div className="flex justify-center mb-4">
              <Image
                src={EmptyListImg}
                alt="No artists selected"
                className="w-48"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              There are no artists selected
            </h3>
            <p>Find your artists using the search box</p>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <Badge
                key={item.id}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                {item.title}
                <button
                  onClick={() => removeSelectedItem(item.id)}
                  className="ml-1 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800"
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
