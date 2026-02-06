import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@/configs/api/client';
import { COLUMNS_QUERY_KEY, JOBS_QUERY_KEY } from '@/configs/api/query-keys';
import type { components } from '@/configs/api/types/api.generated';

type Column = components['schemas']['JobColumnWithOptionsResponseDto'];
type MutationContext = { previous: Column[] | undefined };

export const useDeleteColumn = () => {
  const queryClient = useQueryClient();

  return $api.useMutation('delete', '/api/jobs/columns/{id}', {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: COLUMNS_QUERY_KEY });

      const previous = queryClient.getQueryData<Column[]>(COLUMNS_QUERY_KEY);
      const id = variables.params.path.id;

      queryClient.setQueryData<Column[]>(COLUMNS_QUERY_KEY, (old) =>
        old?.filter((col) => col.id !== id)
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      const ctx = context as MutationContext | undefined;

      if (ctx?.previous) {
        queryClient.setQueryData(COLUMNS_QUERY_KEY, ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COLUMNS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });
};
