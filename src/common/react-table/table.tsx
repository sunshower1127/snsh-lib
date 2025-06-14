import { Checkbox } from "@/common/shadcn-ui/level0/checkbox";
import { Input } from "@/common/shadcn-ui/level0/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/shadcn-ui/level0/table";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { CircleArrowDownIcon, CircleArrowUpIcon, CircleDotIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

// Generic types for table configuration
export interface FilterConfig {
  id: string;
  label: string;
  placeholder?: string;
}

export interface TableDisplayName {
  [key: string]: string;
}

export interface SelectableTableProps<TData = unknown> {
  data: TData[];
  columns: ColumnDef<TData>[];
  selection?: Record<number, boolean>;
  onSelectionChange?: OnChangeFn<RowSelectionState>;
  onRowClick?: (index: number) => void;
  sorting?: SortingState;
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  setRowModel?: React.Dispatch<React.SetStateAction<RowModel<TData> | undefined>>;
  filters?: FilterConfig[];
  displayNames?: TableDisplayName;
  showFilters?: boolean;
  showSortInfo?: boolean;
  showSelectionCount?: boolean;
  enableSelection?: boolean;
}

// Utility function to create selection column
export function createSelectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mx-[2px] size-6"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mx-[2px] size-6"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

function ToggleHeader<TData>({ children, column }: { children: ReactNode; column: Column<TData> }) {
  const isSorted = column.getIsSorted();
  let Icon, handleClick;
  switch (isSorted) {
    case false:
      Icon = CircleDotIcon;
      handleClick = () => column.toggleSorting(false, true);
      break;
    case "asc":
      Icon = CircleArrowUpIcon;
      handleClick = () => column.toggleSorting(true, true);
      break;
    case "desc":
      Icon = CircleArrowDownIcon;
      handleClick = () => column.clearSorting();
  }

  return (
    <button className="flex items-center gap-1" onClick={handleClick}>
      {children}
      <Icon size="15" />
    </button>
  );
}

export function GenericTable<TData = unknown>({
  data,
  columns: baseColumns,
  selection,
  onSelectionChange,
  onRowClick,
  sorting,
  setSorting,
  setRowModel,
  filters = [],
  displayNames = {},
  showFilters = true,
  showSortInfo = true,
  showSelectionCount = true,
  enableSelection = true,
}: SelectableTableProps<TData>) {
  const [_sorting, _setSorting] = useState<SortingState>([]);
  sorting = sorting ?? _sorting;
  setSorting = setSorting ?? _setSorting;

  // Add selection column if enabled
  const columns = enableSelection ? [createSelectionColumn<TData>(), ...baseColumns] : baseColumns;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting ?? _setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: enableSelection ? onSelectionChange : undefined,
    state: {
      sorting,
      rowSelection: enableSelection ? selection : undefined,
    },
  });

  useEffect(() => {
    setRowModel?.(table.getRowModel());
  }, [setRowModel, table, sorting]);

  return (
    <div className="flex w-full flex-col gap-2 **:text-xs">
      {showFilters && filters.length > 0 && (
        <div
          className={`mb-4 grid h-12 gap-x-2`}
          style={{
            gridTemplateColumns: `repeat(${Math.min(filters.length, 2)}, 1fr)`,
            gridTemplateRows: `repeat(${Math.ceil(filters.length / 2)}, 1fr)`,
          }}
        >
          {filters.map((filter) => (
            <div key={filter.id} className="flex flex-col">
              <label className="text-sm font-light" htmlFor={filter.id}>
                {filter.label}
              </label>
              <Input
                className="h-8"
                id={filter.id}
                placeholder={filter.placeholder}
                value={(table.getColumn(filter.id)?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn(filter.id)?.setFilterValue(event.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {showSortInfo && sorting.length > 0 && (
        <div className="flex h-10 flex-row items-center">
          <h3 className="mr-1 text-xs">Sort: </h3>
          <ul className="flex flex-row gap-2">
            {sorting.map(({ id, desc }) => {
              const name = displayNames[id] || id;
              return (
                <li className="flex flex-row items-center gap-1" key={id}>
                  <span className="text-xs font-thin">{name}</span>
                  {desc ? <CircleArrowDownIcon size="12" /> : <CircleArrowUpIcon size="12" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} onClick={() => onRowClick?.(row.index)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showSelectionCount && enableSelection && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        </div>
      )}
    </div>
  );
}

// Export ToggleHeader for use in column definitions
export { ToggleHeader };
