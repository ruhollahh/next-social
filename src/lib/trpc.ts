import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "@/backend/routes/_app";
import type { inferProcedureInput, inferProcedureOutput } from "@trpc/server";

export const trpc = createReactQueryHooks<AppRouter>();

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */

export type TQuery = keyof AppRouter["_def"]["queries"];

export type InferQueryOutput<
	TRouteKey extends keyof AppRouter["_def"]["queries"]
> = inferProcedureOutput<AppRouter["_def"]["queries"][TRouteKey]>;

export type InferQueryInput<
	TRouteKey extends keyof AppRouter["_def"]["queries"]
> = inferProcedureInput<AppRouter["_def"]["queries"][TRouteKey]>;

export type InferMutationOutput<
	TRouteKey extends keyof AppRouter["_def"]["mutations"]
> = inferProcedureOutput<AppRouter["_def"]["mutations"][TRouteKey]>;

export type InferMutationInput<
	TRouteKey extends keyof AppRouter["_def"]["mutations"]
> = inferProcedureInput<AppRouter["_def"]["mutations"][TRouteKey]>;

export type InferQueryPathAndInput<TRouteKey extends TQuery> = [
	TRouteKey,
	Exclude<InferQueryInput<TRouteKey>, void>
];
