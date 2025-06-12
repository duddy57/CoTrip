import DataTableActions from './data-table-actions.svelte';
import { renderComponent } from '../ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import type { CreateTripResponseTypeSchema } from '$lib/schemas/trips';

function formatDate(dateString: string | Date): string {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	}).format(date);
}

export const columns: ColumnDef<CreateTripResponseTypeSchema>[] = [
	{
		accessorKey: 'title',
		header: 'Nome da Viagem'
	},
	{
		accessorKey: 'destination',
		header: 'Destino',
		filterFn: 'includesString'
	},
	{
		accessorKey: 'startDate',
		header: 'Data de Início',
		cell: ({ row }) => formatDate(row.original.startDate)
	},
	{
		accessorKey: 'endDate',
		header: 'Data de Término',
		cell: ({ row }) => formatDate(row.original.endDate)
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const trip = row.original;

			return renderComponent(DataTableActions, { id: trip.id, title: trip.title });
		}
	}
];
