import { QueryClient } from '@tanstack/react-query';

// Singleton query client for use in non-component code
export const queryClient = new QueryClient();
