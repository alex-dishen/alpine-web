import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@/configs/api/client';
import { COLUMNS_QUERY_KEY } from '@/configs/api/query-keys';
import type { components } from '@/configs/api/types/api.generated';

type Column = components['schemas']['JobColumnWithOptionsResponseDto'];
type MutationContext = { previous: Column[] | undefined };

export const useCreateColumn = () => {
  const queryClient = useQueryClient();

  return $api.useMutation('post', '/api/jobs/columns', {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: COLUMNS_QUERY_KEY });

      const previous = queryClient.getQueryData<Column[]>(COLUMNS_QUERY_KEY);

      const optimisticColumn: Column = {
        id: variables.body.id,
        name: variables.body.name,
        column_type: variables.body.column_type,
        options: [],
        is_core: false,
        field_key: null,
      };

      queryClient.setQueryData<Column[]>(COLUMNS_QUERY_KEY, (old) =>
        old ? [...old, optimisticColumn] : [optimisticColumn]
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
    },
  });
};
