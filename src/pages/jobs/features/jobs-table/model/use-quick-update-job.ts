import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@/configs/api/client';
import { JOBS_QUERY_KEY } from '@/configs/api/query-keys';
import type { JobApplicationWithStage } from '@/pages/jobs/registry/jobs.types';

type MutationContext = { previousJobs: unknown };

export const useQuickUpdateJob = () => {
  const queryClient = useQueryClient();

  return $api.useMutation('put', '/api/jobs/{id}', {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: JOBS_QUERY_KEY });

      const previousJobs = queryClient.getQueryData(['jobs']);
      const id = variables.params.path.id;
      const data = variables.body;

      queryClient.setQueriesData(
        { queryKey: JOBS_QUERY_KEY },
        (old: unknown) => {
          if (!old || typeof old !== 'object') return old;

          const typedOld = old as {
            pages: { data: JobApplicationWithStage[] }[];
          };

          if (!typedOld.pages) return old;

          return {
            ...typedOld,
            pages: typedOld.pages.map((page) => ({
              ...page,
              data: page.data.map((job) =>
                job.id === id ? { ...job, ...data } : job
              ),
            })),
          };
        }
      );

      return { previousJobs };
    },
    onError: (_error, _variables, context) => {
      const ctx = context as MutationContext | undefined;

      if (ctx?.previousJobs) {
        queryClient.setQueryData(JOBS_QUERY_KEY, ctx.previousJobs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });
};
