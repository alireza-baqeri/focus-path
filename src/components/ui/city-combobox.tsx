"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CityOption {
  name: string;
  country: string;
  id: number;
}

export function CityCombobox({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [options, setOptions] = React.useState<CityOption[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!debouncedSearch.trim()) {
      return;
    }

    const controller = new AbortController();

    async function fetchCities() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(debouncedSearch)}&count=5&language=en&format=json`,
          { signal: controller.signal }
        );
        const data: { results?: CityOption[] } = await res.json();
        if (data.results) {
          setOptions(data.results.map((r) => ({ name: r.name, country: r.country, id: r.id })));
        } else {
          setOptions([]);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setOptions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchCities();

    return () => {
      controller.abort();
    };
  }, [debouncedSearch]);

  const visibleOptions = debouncedSearch.trim() ? options : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent hover:text-accent-foreground">
        {value || "Select a city..."}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search city..." 
            value={search} 
            onValueChange={setSearch} 
          />
          <CommandList>
            {loading && <div className="p-4 flex justify-center"><Loader2 className="w-4 h-4 animate-spin" /></div>}
            {!loading && visibleOptions.length === 0 && <CommandEmpty>No city found. Start typing...</CommandEmpty>}
            {!loading && visibleOptions.length > 0 && (
              <CommandGroup>
                {visibleOptions.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={`${city.name} ${city.country}`}
                    onSelect={() => {
                      onChange(city.name);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.toLowerCase() === city.name.toLowerCase() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {city.name}, {city.country}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
