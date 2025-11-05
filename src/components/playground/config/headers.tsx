import { useEffect, useState, useCallback, useMemo } from "react";
import { useCwdStore } from "@/store/cwd-store";
import { useZapRequest } from "@/store/request-store";
import { InfoIcon, Plus } from "lucide-react";
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
    InputGroupAddon,
    InputGroup,
    InputGroupInput,
    InputGroupButton,
} from "@/components/ui/input-group";
import {
    TooltipTrigger,
    Tooltip,
    TooltipContent,
} from "@/components/ui/tooltip";

export interface HeadersRow {
    id: string;
    key: string;
    value: string;
    default: boolean;
    description: string;
    enabled: boolean;
}

export default function PlaygroundConfigHeadersTable() {
    const selectedFile = useCwdStore((state) => state.selectedFile);
    const getRequest = useZapRequest((state) => state.getRequest);
    const setQueryParams = useZapRequest((state) => state.setQueryParams);
    const setHeaders = useZapRequest((state) => state.setHeaders);

    const [data, setData] = useState<HeadersRow[]>([]);

    useEffect(() => {
        if (!selectedFile) return;
        const req = getRequest(selectedFile.path);
        if (!req?.headers) {
            setData([]);
            return;
        }
        console.log("HEADERS", req.headers);
        const loaded = req.headers.map((h, idx) => ({
            id: idx.toString(),
            key: h.key,
            value: h.value,
            default: h.default,
            description: h.description,
            enabled: h.enabled ?? true,
        }));

        setData(loaded);
    }, [selectedFile, getRequest]);

    const updateStore = useCallback(
        (rows: HeadersRow[]) => {
            const activeParams = rows
                .filter((d) => d.key)
                .map((d) => ({
                    key: d.key,
                    value: d.value,
                    description: d.description,
                    default: d.default,
                    enabled: d.enabled,
                }));

            if (selectedFile?.path) {
                setHeaders(activeParams, selectedFile.path);
            }
        },
        [selectedFile, setHeaders],
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

    const columns = useMemo<ColumnDef<HeadersRow>[]>(
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
                        <InputGroup>
                            <InputGroupInput
                                type="text"
                                value={row.original.key}
                                disabled={row.original.default}
                                className="w-full"
                            />
                            <InputGroupAddon align="inline-end">
                                <Tooltip>
                                    <TooltipTrigger
                                        asChild
                                        className="hover:cursor-pointer"
                                    >
                                        <InputGroupButton
                                            className="rounded-full"
                                            size="icon-xs"
                                        >
                                            <InfoIcon />
                                        </InputGroupButton>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {row.original.description}
                                    </TooltipContent>
                                </Tooltip>
                            </InputGroupAddon>
                        </InputGroup>
                    );
                },
            },
            {
                accessorKey: "value",
                header: "Value",
                cell: ({ row }) => {
                    const isDisabled = !row.original.enabled;
                    return (
                        <Input
                            type="text"
                            value={row.original.value}
                            disabled={isDisabled}
                            className={`w-full`}
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
            </TabsContent>
        </Tabs>
    );
}

// MAIN WOKR
// add headers in request store
// currently params is Record<string, string>[]
// it should be {key, value, enabled}
// similary in that way only store in file
