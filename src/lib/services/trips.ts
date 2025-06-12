export async function getTrips(cookies: string) {
	if (!cookies) {
		throw new Error('No cookies provided');
	}

	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/app/Trips`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies}`
			}
		});

		if (!response.ok) {
			throw new Error('Failed to fetch trips');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching trips:', error);
		throw error;
	}
}
