import type {calendar_v3  } from '@googleapis/calendar'

type CalendarEvent = calendar_v3.Schema$Event

type Log = (...args: any[]) => void;

export type { CalendarEvent, Log };
