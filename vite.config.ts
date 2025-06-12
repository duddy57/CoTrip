import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		allowedHosts: ['d67b-45-165-120-105.ngrok-free.app', 'd23d-45-165-120-105.ngrok-free.app'],
		proxy: {
			'/api': {
				target: 'https://cgmrmvlq-44332.brs.devtunnels.ms', // Substitua pela URL do seu backend
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/api/, '/app')
			}
		}
	}
});
