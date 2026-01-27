"use client";

import { cn } from "@/commons/libs/cn";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronUp,
  Download,
  Filter as FilterIcon,
  Inbox,
  MoreVertical,
  Search,
  X,
} from "lucide-react";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

// --- TYPES ---
// (Mismos tipos, mantenidos por compatibilidad)
export type Align = "left" | "center" | "right";
export type ColumnSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type FilterType = "select" | "checkbox" | "date" | "daterange" | "text";

export interface Column {
  minWidth?: number;
  id: string;
  label: string;
  type?:
    | "text"
    | "number"
    | "date"
    | "datetime"
    | "status"
    | "money"
    | "percentage"
    | "image"
    | "diffnow";
  align?: Align;
  size?: ColumnSize;
  tooltip?: boolean;
  render?: (value: any, row: Row) => React.ReactNode;
  headerRender?: () => React.ReactNode;
  collapsible?: boolean;
  defaultVisible?: boolean;
  sortable?: boolean;
}
export type Row = Record<string, any> & { id: string | number };
export interface Action {
  label: React.ReactNode | ((row: Row) => React.ReactNode);
  icon?: React.ReactNode | ((row: Row) => React.ReactNode);
  onClick: (row: Row) => void;
  hidden?: boolean | ((row: Row) => boolean);
}
export interface FilterOption {
  label: string;
  value: string | number | boolean;
}
export interface FilterDefinition {
  id: string;
  label: string;
  type?: FilterType;
  options?: FilterOption[];
}
export interface TableProps {
  columns: Column[];
  rows: Row[];
  filters?: FilterDefinition[];
  onClick?: (row: Row) => void;
  actions?: Action[];
  loading?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: Row[]) => void;
  emptyMessage?: string;
  className?: string;
  title?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
}

// --- HELPERS & FORMATTERS ---
const columnSizeMap: Record<ColumnSize, string> = {
  xs: "w-20",
  sm: "w-32",
  md: "w-48",
  lg: "w-64",
  xl: "w-80",
  xxl: "w-96",
};
const formatters = {
  number: (val: any) => new Intl.NumberFormat("es-MX").format(val),
  money: (val: any) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(val),
  percentage: (val: any) => `${val}%`,
  date: (val: any) => (val ? new Date(val).toLocaleDateString("es-MX") : "-"),
  datetime: (val: any) => (val ? new Date(val).toLocaleString("es-MX") : "-"),
  diffnow: (val: any) => {
    /* ... tu lógica diffnow ... */ return val ? "hace poco" : "-";
  },
};

const getValue = (obj: any, path: string) => {
  if (!obj) return undefined;
  if (!path.includes(".")) return obj[path];
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

// ----------------------------------------------------------------------
// 1. SUB-COMPONENTS (MEMOIZED FOR PERFORMANCE)
// ----------------------------------------------------------------------

// A. Filter Chips Component (Visualización de filtros activos)
const FilterChips = React.memo(
  ({
    activeFilters,
    filters,
    onRemove,
  }: {
    activeFilters: Record<string, any>;
    filters?: FilterDefinition[];
    onRemove: (key: string) => void;
  }) => {
    const hasFilters = Object.keys(activeFilters).length > 0;
    if (!hasFilters || !filters) return null;

    return (
      <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in slide-in-from-top-1">
        {Object.entries(activeFilters).map(([key, value]) => {
          const def = filters.find((f) => f.id === key);
          if (!def || value === "" || value === null) return null;

          let displayValue = String(value);

          // Formatear valor visual según el tipo
          if (def.type === "select" && def.options) {
            const opt = def.options.find(
              (o) => String(o.value) === String(value)
            );
            if (opt) displayValue = opt.label;
          } else if (def.type === "checkbox") {
            displayValue = value === "true" ? "Sí" : "No";
          } else if (def.type === "daterange") {
            // @ts-ignore
            displayValue = `${value.start || "..."} - ${value.end || "..."}`;
          }

          return (
            <span
              key={key}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-sm"
            >
              <span className="text-indigo-400/70">{def.label}:</span>
              <span className="text-white">{displayValue}</span>
              <button
                onClick={() => onRemove(key)}
                className="ml-1 p-0.5 hover:bg-indigo-500/20 rounded-full transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}

        {hasFilters && (
          <button
            onClick={() =>
              Object.keys(activeFilters).forEach((k) => onRemove(k))
            }
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors px-2 py-1"
          >
            Limpiar todo
          </button>
        )}
      </div>
    );
  }
);
FilterChips.displayName = "FilterChips";

// B. Pagination Component (Siempre visible)
const TablePagination = React.memo(
  ({
    currentPage,
    totalPages,
    pageSize,
    pageSizeOptions,
    totalRows,
    onPageChange,
    onPageSizeChange,
  }: any) => {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-white/5">
        {/* Info */}
        <div className="text-xs text-slate-500 font-medium">
          Total: <span className="text-slate-300">{totalRows}</span> registros
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-400 hidden sm:block">Filas:</p>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-7 rounded border border-white/10 bg-slate-950 px-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
            >
              {pageSizeOptions.map((size: number) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs tabular-nums">
            <span>{currentPage}</span>
            <span className="opacity-50">/</span>
            <span>{totalPages || 1}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage >= totalPages}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);
TablePagination.displayName = "TablePagination";

// ----------------------------------------------------------------------
// 2. MAIN COMPONENT
// ----------------------------------------------------------------------

const TableComponent = React.forwardRef<HTMLDivElement, TableProps>(
  (
    {
      columns,
      rows,
      filters,
      onClick,
      actions,
      loading = false,
      selectable = false,
      onSelectionChange,
      emptyMessage = "No se encontraron registros",
      className,
      title,
      pageSizeOptions = [10, 20, 50, 100],
      defaultPageSize = 10,
    },
    ref
  ) => {
    // --- STATE ---
    const [sortConfig, setSortConfig] = React.useState<{
      key: string;
      direction: "asc" | "desc";
    } | null>(null);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedRows, setSelectedRows] = React.useState<
      Set<string | number>
    >(new Set());
    const [activeFilters, setActiveFilters] = React.useState<
      Record<string, any>
    >({});
    const [showFiltersPanel, setShowFiltersPanel] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(defaultPageSize);

    // Reset page on filter/search change
    React.useEffect(() => {
      setCurrentPage(1);
    }, [searchTerm, activeFilters, pageSize]);

    // --- MEMOIZED LOGIC (The "Heavy" Lifting) ---
    // 1. Visible Columns
    const visibleColumns = React.useMemo(
      () => columns.filter((c) => c.defaultVisible !== false),
      [columns]
    );

    // 2. Data Processing (Filter -> Sort)
    const processedData = React.useMemo(() => {
      let data = [...rows];

      // Global Search
      if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        data = data.filter((row) =>
          Object.values(row).some((v) =>
            String(v).toLowerCase().includes(lower)
          )
        );
      }

      // Specific Filters
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) return;
        const def = filters?.find((f) => f.id === key);
        if (!def) return;

        if (def.type === "daterange") {
          const range = value as { start?: string; end?: string };
          data = data.filter((row) => {
            const cellDate = new Date(getValue(row, key));
            if (isNaN(cellDate.getTime())) return false;
            const start = range.start ? new Date(range.start) : null;
            const end = range.end ? new Date(range.end) : null;
            if (start && cellDate < start) return false;
            if (end) {
              end.setHours(23, 59, 59, 999);
              if (cellDate > end) return false;
            }
            return true;
          });
        } else if (def.type === "checkbox") {
          if (value === "true")
            data = data.filter((row) => !!getValue(row, key));
          if (value === "false")
            data = data.filter((row) => !getValue(row, key));
        } else {
          data = data.filter((row) =>
            String(getValue(row, key))
              .toLowerCase()
              .includes(String(value).toLowerCase())
          );
        }
      });

      // Sorting
      if (sortConfig) {
        data.sort((a, b) => {
          const aVal = getValue(a, sortConfig.key);
          const bVal = getValue(b, sortConfig.key);
          if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        });
      }

      return data;
    }, [rows, searchTerm, activeFilters, sortConfig, filters]);

    // 3. Pagination Slicing
    const totalPages = Math.ceil(processedData.length / pageSize);
    const paginatedRows = React.useMemo(() => {
      const start = (currentPage - 1) * pageSize;
      return processedData.slice(start, start + pageSize);
    }, [processedData, currentPage, pageSize]);

    // --- CALLBACKS (Memoized to prevent children re-renders) ---
    const handleSort = React.useCallback((columnId: string) => {
      setSortConfig((curr) => {
        if (!curr || curr.key !== columnId)
          return { key: columnId, direction: "asc" };
        return curr.direction === "asc"
          ? { key: columnId, direction: "desc" }
          : null;
      });
    }, []);

    const handleSelectAll = React.useCallback(
      (checked: boolean) => {
        setSelectedRows(
          checked ? new Set(paginatedRows.map((r) => r.id)) : new Set()
        );
      },
      [paginatedRows]
    );

    const handleSelectRow = React.useCallback(
      (id: string | number, checked: boolean) => {
        setSelectedRows((prev) => {
          const next = new Set(prev);
          checked ? next.add(id) : next.delete(id);
          return next;
        });
      },
      []
    );

    const handleFilterChange = React.useCallback((key: string, val: any) => {
      setActiveFilters((prev) => {
        // Si el valor está vacío, eliminamos la key para limpiar el estado
        if (val === "" || val === null) {
          const { [key]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [key]: val };
      });
    }, []);

    const handleRemoveFilter = React.useCallback((key: string) => {
      setActiveFilters((prev) => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    }, []);

    // --- RENDER HELPERS ---
    const renderCell = (col: Column, row: Row) => {
      const val = getValue(row, col.id);
      if (col.render) return col.render(val, row);
      // @ts-ignore
      if (col.type && formatters[col.type]) return formatters[col.type](val);

      // Status Badge Logic
      if (col.type === "status") {
        const statusColors: Record<string, string> = {
          active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          inactive: "bg-slate-500/10 text-slate-400 border-slate-500/20",
          pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          error: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        };
        const color =
          statusColors[String(val).toLowerCase()] || statusColors.inactive;
        return (
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
              color
            )}
          >
            {val}
          </span>
        );
      }
      if (col.type === "image")
        return (
          <img
            src={val}
            alt=""
            className="h-9 w-9 rounded-lg object-cover border border-white/10"
          />
        );

      return <span className="text-slate-300">{val}</span>;
    };

    const getVisibleActions = (row: Row) =>
      actions?.filter(
        (a) => !(typeof a.hidden === "function" ? a.hidden(row) : a.hidden)
      ) || [];

    return (
      <div ref={ref} className={cn("w-full space-y-4", className)}>
        {/* --- HEADER & TOOLBAR --- */}
        <div className="flex flex-col gap-4 bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md transition-all">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {title && (
              <h3 className="text-lg font-semibold text-white tracking-tight">
                {title}
              </h3>
            )}

            <div className="flex flex-1 w-full sm:w-auto items-center gap-3 justify-between">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-9 pl-9 pr-8 bg-slate-950/50 text-sm text-white rounded-lg border border-white/10 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 placeholder:text-slate-600 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {filters && (
                  <button
                    onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                    className={cn(
                      "h-9 px-3 rounded-lg border text-sm font-medium flex items-center gap-2 transition-all",
                      showFiltersPanel
                        ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-400"
                        : "bg-slate-950/50 border-white/10 text-slate-400 hover:text-white"
                    )}
                  >
                    <FilterIcon className="w-4 h-4" />{" "}
                    <span className="hidden sm:inline">Filtros</span>
                  </button>
                )}
                <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-white/10 bg-slate-950/50 text-slate-400 hover:text-white">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* --- FILTER CHIPS (New) --- */}
          <FilterChips
            activeFilters={activeFilters}
            filters={filters}
            onRemove={handleRemoveFilter}
          />

          {/* --- FILTERS PANEL (Expandable) --- */}
          {showFiltersPanel && filters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2">
              {filters.map((f) => (
                <div key={f.id} className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-1">
                    {f.label}
                  </label>
                  {f.type === "select" ? (
                    <div className="relative">
                      <select
                        value={activeFilters[f.id] || ""}
                        onChange={(e) =>
                          handleFilterChange(f.id, e.target.value)
                        }
                        className="w-full h-9 pl-3 pr-8 bg-slate-950 border border-white/10 rounded-lg text-sm text-white appearance-none focus:outline-none focus:border-indigo-500/50"
                      >
                        <option value="">Todos</option>
                        {f.options?.map((o) => (
                          <option key={String(o.value)} value={String(o.value)}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  ) : (
                    <input
                      type={f.type === "date" ? "date" : "text"}
                      value={activeFilters[f.id] || ""}
                      onChange={(e) => handleFilterChange(f.id, e.target.value)}
                      className="w-full h-9 px-3 bg-slate-950 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- TABLE CONTENT --- */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl shadow-black/20">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {selectable && (
                    <th className="w-12 px-6 py-4">
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.size === paginatedRows.length &&
                          paginatedRows.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="h-4 w-4 rounded border-white/20 bg-slate-950 text-indigo-500 focus:ring-indigo-500/50 cursor-pointer accent-indigo-500"
                      />
                    </th>
                  )}
                  {visibleColumns.map((col) => (
                    <th
                      key={col.id}
                      className={cn(
                        "px-6 py-4 text-xs font-semibold uppercase text-slate-400 select-none",
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                        col.size && columnSizeMap[col.size]
                      )}
                      style={{ minWidth: col.minWidth }}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          col.align === "center" && "justify-center",
                          col.align === "right" && "justify-end"
                        )}
                      >
                        {col.headerRender ? col.headerRender() : col.label}
                        {col.sortable !== false && (
                          <button
                            onClick={() => handleSort(col.id)}
                            className="text-slate-600 hover:text-indigo-400"
                          >
                            {sortConfig?.key === col.id ? (
                              sortConfig.direction === "asc" ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )
                            ) : (
                              <ChevronsUpDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  {actions && <th className="px-6 py-4 w-16"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {selectable && (
                        <td className="px-6 py-4">
                          <div className="h-4 w-4 bg-white/5 rounded"></div>
                        </td>
                      )}
                      {visibleColumns.map((col) => (
                        <td key={col.id} className="px-6 py-4">
                          <div className="h-4 bg-white/5 rounded w-3/4"></div>
                        </td>
                      ))}
                      {actions && (
                        <td className="px-6 py-4">
                          <div className="h-4 w-4 bg-white/5 rounded ml-auto"></div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={100} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                          <Inbox className="w-6 h-6 opacity-50" />
                        </div>
                        <p className="text-sm">{emptyMessage}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => {
                    const visibleActions = getVisibleActions(row);
                    const isSelected = selectedRows.has(row.id);
                    return (
                      <tr
                        key={row.id}
                        onClick={() => onClick?.(row)}
                        className={cn(
                          "group transition-colors",
                          isSelected ? "bg-indigo-500/5" : "hover:bg-white/5",
                          onClick && "cursor-pointer"
                        )}
                      >
                        {selectable && (
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSelectRow(row.id, e.target.checked);
                              }}
                              className="h-4 w-4 rounded border-white/20 bg-slate-950 text-indigo-500 accent-indigo-500 cursor-pointer"
                            />
                          </td>
                        )}
                        {visibleColumns.map((col) => (
                          <td
                            key={col.id}
                            className={cn(
                              "px-6 py-4 text-sm text-slate-300 whitespace-nowrap",
                              col.align === "center" && "text-center",
                              col.align === "right" && "text-right"
                            )}
                          >
                            {renderCell(col, row)}
                          </td>
                        ))}
                        {actions && (
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-slate-950 border border-white/10 text-slate-300"
                              >
                                {visibleActions.map((a, i) => (
                                  <DropdownMenuItem
                                    key={i}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      a.onClick(row);
                                    }}
                                    className="cursor-pointer gap-2 focus:bg-white/10 focus:text-white"
                                  >
                                    {typeof a.icon === "function"
                                      ? a.icon(row)
                                      : a.icon}
                                    {typeof a.label === "function"
                                      ? a.label(row)
                                      : a.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* --- PAGINATION (Always Visible) --- */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            totalRows={processedData.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
    );
  }
);

export const Table = React.memo(TableComponent) as typeof TableComponent;
