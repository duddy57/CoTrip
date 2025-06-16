<script lang="ts" generics="TData, TValue">
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table';
	import {
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type ColumnDef,
		type ColumnFiltersState,
		type SortingState
	} from '@tanstack/table-core';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { tripStore } from '$lib/store/tripsStore';
	import {
		Search,
		ChevronLeft,
		ChevronRight,
		ChevronsUpDown,
		ChevronDown,
		ChevronUp
	} from '@lucide/svelte';
	import { onDestroy } from 'svelte';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
	};

	let { columns }: DataTableProps<TData, TValue> = $props();

	let data = $state<TData[]>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let sorting = $state<SortingState>([]);
	let searchValue = $state('');

	const unsubscribe = tripStore.subscribe((trips) => {
		if (trips) {
			data = trips as TData[];
		}
	});

	onDestroy(unsubscribe);

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		state: {
			get columnFilters() {
				return columnFilters;
			},
			get sorting() {
				return sorting;
			}
		}
	});

	function handleSearch(e: Event) {
		const target = e.target as HTMLInputElement;
		searchValue = target.value;
		table.getColumn('destination')?.setFilterValue(searchValue);
	}
</script>

<div class="flex h-full flex-col gap-4">
	<div class="flex items-center py-4">
		<div class="relative max-w-sm">
			<Search class="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" />
			<Input
				placeholder="Busque pelo destino..."
				value={searchValue}
				onchange={handleSearch}
				oninput={handleSearch}
				class="max-w-sm pl-8"
			/>
		</div>
	</div>

	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head class={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}>
								{#if !header.isPlaceholder}
									<div
										class="flex items-center"
										onclick={() => header.column.getCanSort() && header.column.toggleSorting()}
										role="button"
										tabindex="0"
										onkeydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												header.column.getCanSort() && header.column.toggleSorting();
											}
										}}
									>
										<FlexRender
											content={header.column.columnDef.header}
											context={header.getContext()}
										/>
										{#if header.column.getCanSort()}
											<span class="ml-1">
												{#if header.column.getIsSorted() === 'asc'}
													<ChevronUp class="h-4 w-4" />
												{:else if header.column.getIsSorted() === 'desc'}
													<ChevronDown class="h-4 w-4" />
												{:else}
													<ChevronsUpDown class="h-4 w-4" />
												{/if}
											</span>
										{/if}
									</div>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'} class="hover:bg-gray-50">
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">
							Nenhuma viagem encontrada.
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	{#if table.getPageCount() > 1}
		<div class="flex items-center justify-end space-x-2 py-4">
			<div class="flex-1 text-sm text-gray-700">
				Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
				a {Math.min(
					(table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
					table.getFilteredRowModel().rows.length
				)} de {table.getFilteredRowModel().rows.length} resultados
			</div>
			<div class="space-x-2">
				<Button
					variant="outline"
					size="sm"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronLeft class="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<ChevronRight class="h-4 w-4" />
				</Button>
			</div>
		</div>
	{/if}
</div>
