"use client";

import * as React from "react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
  type CalendarWeek,
} from "react-day-picker";
import { ArrowLeft2, ArrowRight2, ArrowDown2 } from "iconsax-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-bg-surface p-2 [--cell-radius:6px] [--cell-size:28px]",
        className,
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date: Date) =>
          date.toLocaleString(
            typeof locale === "object" && "code" in locale
              ? (locale as Partial<Locale>).code
              : undefined,
            { month: "short" },
          ),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months,
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "absolute inset-0 bg-bg-elevated opacity-0",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-1 rounded-(--cell-radius) text-sm",
          defaultClassNames.caption_label,
        ),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-text-muted select-none",
          defaultClassNames.weekday,
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "text-[0.8rem] text-text-muted select-none",
          defaultClassNames.week_number,
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none",
          defaultClassNames.day,
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-(--cell-radius) bg-accent-muted",
          defaultClassNames.range_start,
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-r-(--cell-radius) bg-accent-muted",
          defaultClassNames.range_end,
        ),
        today: cn(
          "rounded-(--cell-radius) bg-bg-elevated text-text-primary",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-text-muted aria-selected:text-text-muted",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "text-text-disabled opacity-50",
          defaultClassNames.disabled,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({
          className: rootClassName,
          rootRef,
          ...rootProps
        }: React.HTMLAttributes<HTMLDivElement> & {
          rootRef?: React.Ref<HTMLDivElement>;
        }) => (
          <div
            data-slot="calendar"
            ref={rootRef as React.RefObject<HTMLDivElement>}
            className={cn(rootClassName)}
            {...rootProps}
          />
        ),
        Chevron: ({
          className: chevronClassName,
          orientation,
          ...chevronProps
        }: {
          className?: string;
          orientation?: "left" | "right" | "up" | "down";
          [key: string]: unknown;
        }) => {
          if (orientation === "left")
            return (
              <ArrowLeft2
                size={16}
                className={cn(chevronClassName)}
                {...(chevronProps as object)}
              />
            );
          if (orientation === "right")
            return (
              <ArrowRight2
                size={16}
                className={cn(chevronClassName)}
                {...(chevronProps as object)}
              />
            );
          return (
            <ArrowDown2
              size={16}
              className={cn(chevronClassName)}
              {...(chevronProps as object)}
            />
          );
        },
        DayButton: ({ ...dayBtnProps }) => (
          <CalendarDayButton locale={locale} {...dayBtnProps} />
        ),
        WeekNumber: ({
          children,
          week,
          ...weekNumProps
        }: React.ThHTMLAttributes<HTMLTableCellElement> & {
          week: CalendarWeek;
        }) => {
          void week;
          return (
            <td {...weekNumProps}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 font-normal leading-none",
        "data-[selected-single=true]:bg-accent data-[selected-single=true]:text-white",
        "data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-accent data-[range-start=true]:text-white",
        "data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-accent data-[range-end=true]:text-white",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-accent-muted data-[range-middle=true]:text-text-accent",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
