"use client";

import { useState } from "react";
import { CalendarIcon, ChevronDown, X } from "lucide-react";
import { format } from "date-fns";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { Slider } from "~/components/ui/slider";
import { cn } from "~/lib/utils";

type RarityType = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: {
    dateRange?: { from: Date; to: Date };
    rarities?: RarityType[];
    minLikes?: number;
    maxLikes?: number;
  }) => void;
  className?: string;
}

export function AdvancedFilters({
  onFiltersChange,
  className,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [selectedRarities, setSelectedRarities] = useState<RarityType[]>([]);
  const [likesRange, setLikesRange] = useState<[number, number]>([0, 1000]);

  const rarityOptions: { value: RarityType; label: string; color: string }[] = [
    { value: "BRONZE", label: "Bronze", color: "text-amber-600" },
    { value: "SILVER", label: "Silver", color: "text-slate-500" },
    { value: "GOLD", label: "Gold", color: "text-yellow-500" },
    { value: "PLATINUM", label: "Platinum", color: "text-purple-500" },
  ];

  const handleRarityToggle = (rarity: RarityType) => {
    const newRarities = selectedRarities.includes(rarity)
      ? selectedRarities.filter((r) => r !== rarity)
      : [...selectedRarities, rarity];

    setSelectedRarities(newRarities);
    updateFilters(dateRange, newRarities, likesRange);
  };

  const handleDateRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setDateRange(range);
    updateFilters(range, selectedRarities, likesRange);
  };

  const handleLikesRangeChange = (range: [number, number]) => {
    setLikesRange(range);
    updateFilters(dateRange, selectedRarities, range);
  };

  const updateFilters = (
    dateRange: { from: Date | undefined; to: Date | undefined },
    rarities: RarityType[],
    likesRange: [number, number],
  ) => {
    const filters: Parameters<typeof onFiltersChange>[0] = {};

    if (dateRange.from && dateRange.to) {
      filters.dateRange = { from: dateRange.from, to: dateRange.to };
    }

    if (rarities.length > 0) {
      filters.rarities = rarities;
    }

    if (likesRange[0] > 0 || likesRange[1] < 1000) {
      filters.minLikes = likesRange[0];
      filters.maxLikes = likesRange[1];
    }

    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setSelectedRarities([]);
    setLikesRange([0, 1000]);
    onFiltersChange({});
  };

  const hasActiveFilters =
    !!dateRange.from ||
    !!dateRange.to ||
    selectedRarities.length > 0 ||
    likesRange[0] > 0 ||
    likesRange[1] < 1000;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          Advanced Filters
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>

      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Cards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date Range Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from
                        ? format(dateRange.from, "PPP")
                        : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date: Date | undefined) =>
                        handleDateRangeChange({ ...dateRange, from: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !dateRange.to && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "PPP") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date: Date | undefined) =>
                        handleDateRangeChange({ ...dateRange, to: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Rarity Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Rarity</Label>
              <div className="grid grid-cols-2 gap-3">
                {rarityOptions.map((rarity) => (
                  <div
                    key={rarity.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={rarity.value}
                      checked={selectedRarities.includes(rarity.value)}
                      onCheckedChange={() => handleRarityToggle(rarity.value)}
                    />
                    <Label
                      htmlFor={rarity.value}
                      className={cn(
                        "cursor-pointer text-sm font-medium",
                        rarity.color,
                      )}
                    >
                      {rarity.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Likes Range Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Likes Range: {likesRange[0]} -{" "}
                {likesRange[1] === 1000 ? "1000+" : likesRange[1]}
              </Label>
              <div className="px-2">
                <Slider
                  value={likesRange}
                  onValueChange={(value: number[]) =>
                    handleLikesRangeChange(value as [number, number])
                  }
                  max={1000}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>0</span>
                <span>1000+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
