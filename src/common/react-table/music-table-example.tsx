import { ColumnDef } from "@tanstack/react-table";
import { HeartPulse } from "lucide-react";
import { FilterConfig, GenericTable, TableDisplayName, ToggleHeader } from "./table";

// Music type example (replace with your actual Music type)
interface Music {
  id: string;
  artist: string;
  title: string;
  metadata: {
    meanHue: number;
    moodValue: number;
  };
}

// Example of how to define columns for Music data
export const musicColumns: ColumnDef<Music>[] = [
  {
    accessorKey: "metadata.meanHue",
    header: ({ column }) => <ToggleHeader column={column}>Cover</ToggleHeader>,
    cell: ({ row }) => (
      <img
        className="aspect-video h-10 object-contain"
        src={`/api/thumbnail/${row.original.id}`} // Replace with your actual thumbnail URL logic
        alt={`${row.original.title} cover`}
      />
    ),
  },
  {
    accessorKey: "artist",
    header: ({ column }) => <ToggleHeader column={column}>Artist</ToggleHeader>,
    cell: ({ row }) => <div>{row.original.artist}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <ToggleHeader column={column}>Title</ToggleHeader>,
    cell: ({ row }) => <div>{row.original.title}</div>,
  },
  {
    accessorKey: "metadata.moodValue",
    header: ({ column }) => (
      <ToggleHeader column={column}>
        <HeartPulse className="-m-0.5 size-5 fill-zinc-400 stroke-zinc-950" />
      </ToggleHeader>
    ),
    cell: ({ row }) => <div>{row.original.metadata.moodValue}</div>,
  },
];

// Filter configuration for Music table
export const musicFilters: FilterConfig[] = [
  {
    id: "artist",
    label: "Artist",
    placeholder: "Search artist...",
  },
  {
    id: "title",
    label: "Title",
    placeholder: "Search title...",
  },
];

// Display names for sorting info
export const musicDisplayNames: TableDisplayName = {
  "metadata.meanHue": "Cover",
  artist: "Artist",
  title: "Title",
  "metadata.moodValue": "Mood",
};

// Example usage component
export function MusicTable({
  musics,
  selection,
  onSelectionChange,
  onRowClick,
  sorting,
  setSorting,
  setRowModel,
}: {
  musics: Music[];
  selection?: Record<number, boolean>;
  onSelectionChange?: (selection: any) => void;
  onRowClick?: (index: number) => void;
  sorting?: any;
  setSorting?: any;
  setRowModel?: any;
}) {
  return (
    <GenericTable
      data={musics}
      columns={musicColumns}
      selection={selection}
      onSelectionChange={onSelectionChange}
      onRowClick={onRowClick}
      sorting={sorting}
      setSorting={setSorting}
      setRowModel={setRowModel}
      filters={musicFilters}
      displayNames={musicDisplayNames}
      enableSelection={true}
      showFilters={true}
      showSortInfo={true}
      showSelectionCount={true}
    />
  );
}
