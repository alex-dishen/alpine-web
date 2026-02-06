import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@/configs/api/client';
import { JOBS_QUERY_KEY } from '@/configs/api/query-keys';
import type { JobApplicationWithStage } from '@/pages/jobs/registry/jobs.types';

type MutationContext = { previousJobs: unknown };

const buildOptimisticColumnValues = (
  existing: JobApplicationWithStage['column_values'],
  columnId: string,
  body: Record<string, unknown>
): JobApplicationWithStage['column_values'] => {
  // Remove existing values for this column
  const filtered = existing.filter((cv) => cv.column_id !== columnId);

  // Build new placeholder value(s)
  if ('option_ids' in body) {
    const optionIds = (body.option_ids as string[]) ?? [];

    return [
      ...filtered,
      ...optionIds.map((optionId) => ({
        column_id: columnId,
        option_id: optionId,
        value: null,
      })),
    ];
  }

  if ('option_id' in body) {
    if (body.option_id === null) return filtered;

    return [
      ...filtered,
      {
        column_id: columnId,
        option_id: body.option_id as string,
        value: null,
      },
    ];
  }

  if ('text_value' in body) {
    if (body.text_value === null) return filtered;

    return [
      ...filtered,
      {
        column_id: columnId,
        option_id: null,
        value: body.text_value as string,
      },
    ];
  }

  return filtered;
};

export const useUpsertColumnValue = () => {
  const queryClient = useQueryClient();

  return $api.useMutation('put', '/api/jobs/{jobId}/values/{columnId}', {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: JOBS_QUERY_KEY });

      const previousJobs = queryClient.getQueryData(['jobs']);
      const jobId = variables.params.path.jobId;
      const columnId = variables.params.path.columnId;
      const body = variables.body as Record<string, unknown>;

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
              data: page.data.map((job) => {
                if (job.id !== jobId) return job;

                return {
                  ...job,
                  column_values: buildOptimisticColumnValues(
                    job.column_values,
                    columnId,
                    body
                  ),
                };
              }),
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
