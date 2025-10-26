import { useEffect, useState, useCallback, useMemo } from "react";
import { useCwdStore } from "@/store/cwd-store";
import { useZapRequest } from "@/store/request-store";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnDef,
} from "@tanstack/react-table";

export interface QueryParamRow {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
}

export default function PlaygroundConfigHeadersTable() {
    const selectedFile = useCwdStore((state) => state.selectedFile);
    const getRequest = useZapRequest((state) => state.getRequest);
    const setQueryParams = useZapRequest((state) => state.setQueryParams);

    const [data, setData] = useState<QueryParamRow[]>([]);

    useEffect(() => {
        if (!selectedFile) return;
        const req = getRequest(selectedFile.path);
        if (!req?.queryParams) {
            setData([]);
            return;
        }

        const loaded = req.queryParams.map((obj, idx) => {
            const key = Object.keys(obj)[0];
            const value = obj[key];
            return { id: idx.toString(), key, value, enabled: true };
        });
        setData(loaded);
    }, [selectedFile, getRequest]);

    const updateStore = useCallback(
        (rows: QueryParamRow[]) => {
            const activeParams: Record<string, string>[] = rows
                .filter((d) => d.enabled && d.key)
                .map((d) => ({ [d.key]: d.value }));

            if (selectedFile?.path) {
                setQueryParams(activeParams, selectedFile.path);
            }
        },
        [selectedFile, setQueryParams],
    );

    const handleInputChange = useCallback(
        (id: string, field: "key" | "value", value: string) => {
            setData((prev) => {
                const updated = prev.map((row) =>
                    row.id === id ? { ...row, [field]: value } : row,
                );
                updateStore(updated);
                return updated;
            });
        },
        [updateStore],
    );

    const handleCheckboxChange = useCallback(
        (id: string, checked: boolean) => {
            setData((prev) => {
                const updated = prev.map((row) =>
                    row.id === id ? { ...row, enabled: checked } : row,
                );
                updateStore(updated);
                return updated;
            });
        },
        [updateStore],
    );

    const addRow = useCallback(() => {
        const newRow: QueryParamRow = {
            id: Date.now().toString(),
            key: "",
            value: "",
            enabled: true,
        };
        setData((prev) => {
            const updated = [...prev, newRow];
            updateStore(updated);
            return updated;
        });
    }, [updateStore]);

    const columns = useMemo<ColumnDef<QueryParamRow>[]>(
        () => [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllRowsSelected()}
                        indeterminate={
                            table.getIsSomeRowsSelected() &&
                            !table.getIsAllRowsSelected()
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllRowsSelected(!!value)
                        }
                        aria-label="Select all rows"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.original.enabled}
                        onCheckedChange={(value) =>
                            handleCheckboxChange(row.original.id, !!value)
                        }
                    />
                ),
            },
            {
                accessorKey: "key",
                header: "Key",
                cell: ({ row }) => {
                    const isDisabled = !row.original.enabled;
                    return (
                        <input
                            type="text"
                            value={row.original.key}
                            disabled={isDisabled}
                            className={`w-full border px-2 py-1 ${
                                isDisabled ? "bg-gray-100" : ""
                            }`}
                            onChange={(e) =>
                                handleInputChange(
                                    row.original.id,
                                    "key",
                                    e.target.value,
                                )
                            }
                        />
                    );
                },
            },
            {
                accessorKey: "value",
                header: "Value",
                cell: ({ row }) => {
                    const isDisabled = !row.original.enabled;
                    return (
                        <input
                            type="text"
                            value={row.original.value}
                            disabled={isDisabled}
                            className={`w-full border px-2 py-1 ${
                                isDisabled ? "bg-gray-100" : ""
                            }`}
                            onChange={(e) =>
                                handleInputChange(
                                    row.original.id,
                                    "value",
                                    e.target.value,
                                )
                            }
                        />
                    );
                },
            },
            {
                id: "add",
                header: () => (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={addRow}
                        className="ml-auto"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                ),
                cell: () => null,
            },
        ],
        [handleInputChange, handleCheckboxChange, addRow],
    );

    const table = useReactTable({
        data,
        columns,
        getRowId: (row) => row.id,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Tabs defaultValue="table">
            <TabsContent value="table" className="flex flex-col gap-4">
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="text-center"
                                    >
                                        No query params added
                                    </TableCell>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.original.enabled && "selected"
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="text-sm text-muted-foreground">
                    Active query params:{" "}
                    {data
                        .filter((d) => d.enabled)
                        .map((d) => `${d.key}=${d.value}`)
                        .join(", ")}
                </div>
            </TabsContent>
        </Tabs>
    );
}

// MAIN WOKR
// add headers in request store
// currently params is Record<string, string>[]
// it should be {key, value, enabled}
// similary in that way only store in file
