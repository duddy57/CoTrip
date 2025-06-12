<script module>
	import { MapPin, Send, type Icon as IconType } from '@lucide/svelte';

	type Step = {
		id: string;
		title: string;
		description: string;
		value: number;
		isActive: boolean;
		icon: typeof IconType;
	};

	let steps = $state<Step[]>([
		{
			id: 'step1',
			title: 'Detalhes da Viagem',
			description: 'Informações básicas da viagem',
			value: 0,
			isActive: true,
			icon: MapPin
		},
		{
			id: 'step2',
			title: 'Revisar e Enviar',
			description: 'Confirmar detalhes',
			value: 100,
			isActive: false,
			icon: Send
		}
	]);
</script>

<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Popover from '$lib/components/ui/popover';
	import * as Dialog from '$lib/components/ui/dialog';

	import { Input } from '$lib/components/ui/input';
	import { Calendar } from '$lib/components/ui/calendar';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Progress } from '$lib/components/ui/progress';

	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		createTripRequestSchema,
		type CreateTripRequestTypeSchema
	} from '$lib/components/schemas/trips';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';

	import { cn } from '$lib/utils';
	import { ArrowLeft, ArrowRight, CalendarIcon } from '@lucide/svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let { data }: { data: { tripForm: SuperValidated<Infer<CreateTripRequestTypeSchema>> } } =
		$props();

	let currentStep = $state(0);
	let isLoading = $state(false);
	let isSuccess = $state(false);
	let isOpen = $state(false);

	function nextStep() {
		if (currentStep < steps.length - 1) {
			steps[currentStep].isActive = false;
			currentStep++;
			steps[currentStep].isActive = true;
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			steps[currentStep].isActive = false;
			currentStep--;
			steps[currentStep].isActive = true;
		}
	}

	function canProceed() {
		switch (currentStep) {
			case 0:
				return $formData.title && $formData.destination && $formData.startDate && $formData.endDate;
			case 1:
				return true;
			default:
				return false;
		}
	}

	let progress = $derived(steps[currentStep].value);

	const form = superForm(data.tripForm, {
		validators: zodClient(createTripRequestSchema),
		scrollToError: 'smooth',
		legacy: true,
		onSubmit() {
			isLoading = true;
		},
		onResult(result) {
			isLoading = false;
			if (result.result.type === 'success' && result.result.data?.success) {
				isSuccess = true;
				setTimeout(() => {
					isOpen = false;
					currentStep = 0;
					steps.forEach((step, index) => {
						step.isActive = index === 0;
					});
				}, 2000);
			}
		}
	});

	const { form: formData, enhance, message } = form;

	const df = new DateFormatter('pt-BR', {
		dateStyle: 'short'
	});

	let startValue = $derived($formData.startDate ? parseDate($formData.startDate) : undefined);
	let endValue = $derived($formData.endDate ? parseDate($formData.endDate) : undefined);
	let placeholder = $state<DateValue>(today(getLocalTimeZone()));

	onMount(() => {
		const handleScroll = () => {
			scrollY = window.scrollY;
		};

		const handleResize = () => {
			innerHeight = window.innerHeight;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<Dialog.Root open={isOpen} onOpenChange={(open) => (isOpen = open)}>
	<Dialog.Trigger
		class={cn(
			buttonVariants({ variant: 'default' }),
			'flex h-12 items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 px-6 transition-all hover:scale-105 hover:bg-green-700'
		)}
	>
		<Send class="h-4 w-4" />
		Criar Viagem
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					{#each steps as step, index (step.id)}
						{@const Icon = step.icon}
						<div class="flex flex-1 items-center">
							<div class="flex flex-1 flex-col items-center space-y-2">
								<div
									class={cn(
										'flex h-12 w-12 transform items-center justify-center rounded-full transition-all duration-300',
										step.isActive
											? 'scale-110 bg-blue-600 text-white shadow-lg ring-4 ring-blue-200'
											: index < currentStep
												? 'bg-green-600 text-white shadow-md'
												: 'bg-gray-200 text-gray-500'
									)}
								>
									<Icon class="h-6 w-6" />
								</div>
								<div class="text-center">
									<h3
										class={cn(
											'text-sm font-medium transition-colors duration-200',
											step.isActive ? 'text-blue-600' : 'text-gray-500'
										)}
									>
										{step.title}
									</h3>
									<p class="hidden text-xs text-gray-400 sm:block">{step.description}</p>
								</div>
							</div>
							{#if index < steps.length - 1}
								<div
									class={cn(
										'mx-4 h-0.5 flex-1 transition-all duration-500',
										index < currentStep ? 'bg-green-600' : 'bg-gray-200'
									)}
								></div>
							{/if}
						</div>
					{/each}
				</div>
				<Progress value={progress} class="h-2 w-full transition-all duration-500" />
			</div>
		</Dialog.Header>
		<form method="POST" action="?/createTrip" use:enhance id="trip-form" class="space-y-6">
			{#if currentStep === 0}
				<div
					in:fly={{ x: -20, duration: 400, delay: 100 }}
					out:fly={{ x: 20, duration: 300 }}
					class="space-y-4"
				>
					<div class="mb-4 text-center">
						<h2 class="text-2xl font-bold text-gray-800">Detalhes da Viagem</h2>
						<p class="mt-2 text-gray-600">Vamos começar com as informações básicas</p>
					</div>

					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<Form.Field {form} name="title" class="space-y-2">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label class="font-medium text-gray-700">Nome da viagem</Form.Label>
									<div class="relative">
										<MapPin
											class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
										/>
										<Input
											bind:value={$formData.title}
											placeholder="Ex: Férias em Paris"
											required
											{...props}
											class="h-12 w-full border-gray-200 pl-10 transition-colors focus:border-blue-500 focus:ring-blue-500"
										/>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="destination" class="space-y-2">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label class="font-medium text-gray-700">Destino</Form.Label>
									<div class="relative">
										<MapPin
											class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
										/>
										<Input
											bind:value={$formData.destination}
											placeholder="Ex: Paris, França"
											required
											{...props}
											class="h-12 w-full border-gray-200 pl-10 transition-colors focus:border-blue-500 focus:ring-blue-500"
										/>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<Form.Field {form} name="startDate" class="space-y-2">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label class="font-medium text-gray-700">Data de início</Form.Label>
									<Popover.Root>
										<Popover.Trigger
											{...props}
											class={cn(
												buttonVariants({ variant: 'outline' }),
												'h-12 w-full justify-start border-gray-200 pl-4 text-left font-normal',
												!startValue && 'text-muted-foreground'
											)}
										>
											{startValue
												? df.format(startValue.toDate(getLocalTimeZone()))
												: 'Selecione uma data'}
											<CalendarIcon class="ml-auto size-4 opacity-50" />
										</Popover.Trigger>
										<Popover.Content class="w-auto p-0" side="top">
											<Calendar
												type="single"
												value={startValue as DateValue}
												bind:placeholder
												minValue={new CalendarDate(1900, 1, 1)}
												calendarLabel="Data de inicio"
												locale="pt-BR"
												onValueChange={(v) => {
													if (v) {
														$formData.startDate = v.toString();
													} else {
														$formData.startDate = '';
													}
												}}
											/>
										</Popover.Content>
									</Popover.Root>
									<Form.FieldErrors />
									<input hidden value={$formData.startDate} name={props.name} />
								{/snippet}
							</Form.Control>
						</Form.Field>

						<Form.Field {form} name="endDate" class="space-y-2">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label class="font-medium text-gray-700">Data de término</Form.Label>
									<Popover.Root>
										<Popover.Trigger
											{...props}
											class={cn(
												buttonVariants({ variant: 'outline' }),
												'h-12 w-full justify-start border-gray-200 pl-4 text-left font-normal',
												!endValue && 'text-muted-foreground'
											)}
										>
											{endValue
												? df.format(endValue.toDate(getLocalTimeZone()))
												: 'Selecione uma data'}
											<CalendarIcon class="ml-auto size-4 opacity-50" />
										</Popover.Trigger>
										<Popover.Content class="w-auto p-0" side="top">
											<Calendar
												type="single"
												value={endValue as DateValue}
												bind:placeholder
												minValue={startValue ? startValue.add({ days: 1 }) : undefined}
												calendarLabel="Data final"
												locale="pt-BR"
												onValueChange={(v) => {
													if (v) {
														$formData.endDate = v.toString();
													} else {
														$formData.endDate = '';
													}
												}}
											/>
										</Popover.Content>
									</Popover.Root>
									<Form.FieldErrors />
									<input hidden value={$formData.endDate} name={props.name} />
								{/snippet}
							</Form.Control>
						</Form.Field>
					</div>
				</div>
			{:else if currentStep === 1}
				<div
					in:fly={{ x: -20, duration: 400, delay: 100 }}
					out:fly={{ x: 20, duration: 300 }}
					class="space-y-6"
				>
					<div class="mb-6 text-center">
						<h2 class="text-2xl font-bold text-gray-800">Revisar e Confirmar</h2>
						<p class="mt-2 text-gray-600">Verifique os detalhes da sua viagem antes de criar</p>
					</div>

					<div class="space-y-4 rounded-lg bg-gray-50 p-6">
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<p class="text-sm font-medium text-gray-500">Nome da Viagem</p>
								<p class="text-lg">{$formData.title || 'Não informado'}</p>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-500">Destino</p>
								<p class="text-lg">{$formData.destination || 'Não informado'}</p>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-500">Data de Início</p>
								<p class="text-lg">
									{$formData.startDate
										? new Date($formData.startDate).toLocaleDateString('pt-BR')
										: 'Não informado'}
								</p>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-500">Data de Término</p>
								<p class="text-lg">
									{$formData.endDate
										? new Date($formData.endDate).toLocaleDateString('pt-BR')
										: 'Não informado'}
								</p>
							</div>
						</div>
					</div>

					<input type="hidden" name="title" value={$formData.title} />
					<input type="hidden" name="destination" value={$formData.destination} />
					<input type="hidden" name="startDate" value={$formData.startDate} />
					<input type="hidden" name="endDate" value={$formData.endDate} />
				</div>
			{/if}

			{#if currentStep < steps.length - 1}
				<Form.Button
					onclick={nextStep}
					disabled={!canProceed()}
					class="flex h-12 w-full items-center gap-2 px-6 transition-all hover:scale-105"
				>
					Próximo
					<ArrowRight class="h-4 w-4" />
				</Form.Button>
			{:else}
				<Form.Button
					disabled={isLoading || !canProceed()}
					class="flex h-12 w-full items-center gap-2 bg-green-600 px-6 transition-all hover:scale-105 hover:bg-green-700"
				>
					{#if isLoading}
						<div
							class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
						></div>
						Criando...
					{:else}
						<Send class="h-4 w-4" />
						Criar Viagem
					{/if}
				</Form.Button>
			{/if}

			{#if isSuccess && $message}
				<div class="rounded-lg border border-green-200 bg-green-50 p-4">
					<p class="text-sm font-medium text-green-800">{$message}</p>
				</div>
			{/if}

			{#if !isSuccess && $message}
				<div class="rounded-lg border border-red-200 bg-red-50 p-4">
					<p class="text-sm font-medium text-red-800">{$message}</p>
				</div>
			{/if}
		</form>
		<Dialog.Footer class="flex items-center justify-between p-4">
			<div class="flex w-full justify-between">
				<Button
					variant="outline"
					onclick={prevStep}
					disabled={currentStep === 0}
					class="flex h-12 w-full items-center gap-2 px-6 transition-all hover:scale-105"
				>
					<ArrowLeft class="h-4 w-4" />
					Anterior
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
