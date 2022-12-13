import { BlocEvent } from "@bloc-state/bloc";

export abstract class StatsEvent extends BlocEvent {}

export class StatsSubscriptionRequested extends StatsEvent {}
