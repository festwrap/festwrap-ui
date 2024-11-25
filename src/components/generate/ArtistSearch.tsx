import { useState } from "react"
import { X } from "lucide-react"
import { Badge } from "@components/ui/Badge"
import Image from "next/image"
import EmptyListImg from "./empty-list.png"
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
    <div className="w-full">
      <SearchCombobox
        options={options}
        values={selectedValues}
        onChange={setSelectedValues}
      />
      {selectedValues.length === 0 ? (
        <div className="mt-8 text-center text-dark-blue">
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
              size="lg"
              className="flex items-center gap-1 px-3 py-1"
            >
              {item.title}
              <button
                onClick={() => removeSelectedItem(item.id)}
                className="ml-1 hover:bg-slate-100 rounded-full hover:text-primary text-dark-blue"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
