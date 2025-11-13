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
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    stringToFileInfo,
    fileToString,
    stringToFile,
} from "@/lib/file-to-string";

export interface FormDataRow {
    id: string;
    key: string;
    value: string | File;
    type: "text" | "file";
    description: string;
    enabled: boolean;
}

export default function PlaygroundBodyFormData({ path }: { path: string }) {
    const getRequest = useZapRequest((state) => state.getRequest);
    const setHeaders = useZapRequest((state) => state.setHeaders);
    const setBody = useZapRequest((state) => state.setBody);

    const [data, setData] = useState<FormDataRow[]>([]);

    useEffect(() => {
        if (!path) return;
        const req = getRequest(path);

        if (!req?.body) {
            setData([]);
            return;
        }

        const loaded =
            req.body?.body?.["form-data"]?.map((h, idx) => {
                let processedValue: string | File = "";
                let detectedType: "text" | "file" = "text";

                if (typeof h.value === "string") {
                    const deserializedFile = stringToFile(h.value);
                    if (deserializedFile) {
                        processedValue = deserializedFile;
                        detectedType = "file";
                    } else {
                        processedValue = h.value;
                        detectedType = "text";
                    }
                } else {
                    processedValue = h.value || "";
                    detectedType = h.value instanceof File ? "file" : "text";
                }

                return {
                    id: idx.toString(),
                    key: h.key,
                    value: processedValue,
                    type: h.type || detectedType,
                    description: h.description ?? "",
                    enabled: h.enabled ?? true,
                };
            }) ?? [];

        setData(loaded);
    }, [path, getRequest]);

    const updateStore = useCallback(
        async (rows: FormDataRow[]) => {
            const activeParams = await Promise.all(
                rows
                    .filter((d) => d.key || d.value || d.description)
                    .map(async (d) => ({
                        key: d.key,
                        value:
                            d.value instanceof File
                                ? await fileToString(d.value)
                                : d.value,
                        type: d.type,
                        description: d.description,
                        enabled: d.enabled,
                    })),
            );

            if (path) {
                setBody("form-data", path, activeParams);
            }
        },
        [path, setBody],
    );

    const handleTypeChange = useCallback(
        (id: string, type: "text" | "file") => {
            setData((prev) => {
                const updated = prev.map((row) =>
                    row.id === id
                        ? {
                              ...row,
                              type,
                              value: "",
                          }
                        : row,
                );
                updateStore(updated);
                return updated;
            });
        },
        [updateStore],
    );

    const handleInputChange = useCallback(
        (
            id: string,
            field: "key" | "value" | "description",
            value: string | File,
        ) => {
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

    const handleFileChange = useCallback(
        (id: string, file: File) => {
            setData((prev) => {
                const updated = prev.map((row) =>
                    row.id === id ? { ...row, value: file } : row,
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
        const newRow: FormDataRow = {
            id: Date.now().toString(),
            key: "",
            value: "",
            type: "text",
            description: "",
            enabled: true,
        };
        setData((prev) => {
            const updated = [...prev, newRow];
            updateStore(updated);
            return updated;
        });
    }, [updateStore]);

    const columns = useMemo<ColumnDef<FormDataRow>[]>(
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
                    const isFileType = row.original.type === "file";

                    return (
                        <InputGroup>
                            {isFileType ? (
                                <div className="flex flex-col gap-1 flex-1">
                                    <InputGroupInput
                                        type="file"
                                        disabled={!row.original.enabled}
                                        className="pl-1!"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                handleFileChange(
                                                    row.original.id,
                                                    file,
                                                );
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <InputGroupInput
                                    type="text"
                                    value={row.original.value}
                                    disabled={!row.original.enabled}
                                    placeholder="Value"
                                    className="pl-1!"
                                    onChange={(e) =>
                                        handleInputChange(
                                            row.original.id,
                                            "value",
                                            e.target.value,
                                        )
                                    }
                                />
                            )}

                            <InputGroupAddon
                                align="inline-end"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Select
                                    value={row.original.type}
                                    onValueChange={(value: "text" | "file") => {
                                        handleTypeChange(
                                            row.original.id,
                                            value,
                                        );
                                    }}
                                >
                                    <SelectTrigger className="h-auto border-0 bg-transparent shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="text">
                                            Text
                                        </SelectItem>
                                        <SelectItem value="file">
                                            File
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </InputGroupAddon>
                        </InputGroup>
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
