import { useEffect, useState, useCallback, useMemo } from "react";
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
import { Input } from "@/components/ui/input";

export interface XwwwFormUrlencodedRow {
    id: string;
    key: string;
    value: string;
    description: string;
    enabled: boolean;
}

export default function PlaygroundBodyXwwwFormUrlencoded({
    path,
}: {
    path: string;
}) {
    const getRequest = useZapRequest((state) => state.getRequest);
    const setHeaders = useZapRequest((state) => state.setHeaders);
    const setBody = useZapRequest((state) => state.setBody);

    const [data, setData] = useState<XwwwFormUrlencodedRow[]>([]);

    useEffect(() => {
        if (!path) return;
        const req = getRequest(path);

        if (!req?.body) {
            setData([]);
            return;
        }

        const loaded =
            req.body?.body?.["x-www-form-urlencoded"]?.map((h, idx) => ({
                id: idx.toString(),
                key: h.key,
                value: h.value,
                description: h.description ?? "",
                enabled: h.enabled ?? true,
            })) ?? [];

        setData(loaded);
    }, [path, getRequest]);

    const updateStore = useCallback(
        (rows: XwwwFormUrlencodedRow[]) => {
            const activeParams = rows
                .filter((d) => d.key || d.value || d.description)
                .map((d) => ({
                    key: d.key,
                    value: d.value,
                    description: d.description,
                    enabled: d.enabled,
                }));

            if (path) {
                setBody("x-www-form-urlencoded", path, activeParams);
            }
        },
        [path, setHeaders],
    );

    const handleInputChange = useCallback(
        (id: string, field: "key" | "value" | "description", value: string) => {
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
        const newRow: XwwwFormUrlencodedRow = {
            id: Date.now().toString(),
            key: "",
            value: "",
            description: "",
            enabled: true,
        };
        setData((prev) => {
            const updated = [...prev, newRow];
            updateStore(updated);
            return updated;
        });
    }, [updateStore]);

    const columns = useMemo<ColumnDef<XwwwFormUrlencodedRow>[]>(
        () => [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllRowsSelected()}
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
                    return (
                        <Input
                            type="text"
                            value={row.original.key}
                            disabled={!row.original.enabled}
                            placeholder="Key"
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
                    return (
                        <Input
                            type="text"
                            value={row.original.value}
                            disabled={!row.original.enabled}
                            placeholder="Value"
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
                accessorKey: "description",
                header: "Description",
                cell: ({ row }) => {
                    return (
                        <Input
                            type="text"
                            value={row.original.description}
                            disabled={!row.original.enabled}
                            placeholder="Description"
                            onChange={(e) =>
                                handleInputChange(
                                    row.original.id,
                                    "description",
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
                        size="icon-sm"
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
                                        No fields added
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
            </TabsContent>
        </Tabs>
    );
}
