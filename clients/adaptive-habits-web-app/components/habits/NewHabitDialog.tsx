"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HabitModel } from "@/types";
import { Button } from "../ui/button";
import { addHabitAction } from "@/app/actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z
    .string()
    .min(0, "Habit name must be at least 0 characters.")
    .max(100, "Habit name must be at most 100 characters."),
  description: z
    .string()
    .max(500, "Habit description must be at most 500 characters."),
  current_target_value: z.coerce
    .number()
    .min(1, "Target value must be at least 1.")
    .max(10000, "Target value must be at most 10000."),
  unit: z
    .string()
    .min(0, "Unit must be at least 0 characters.")
    .max(100, "Unit must be at most 100 characters."),
  frequency: z.string(),
  monday: z.boolean(),
  tuesday: z.boolean(),
  wednesday: z.boolean(),
  thursday: z.boolean(),
  friday: z.boolean(),
  saturday: z.boolean(),
  sunday: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewHabitDialog() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      current_target_value: 1,
      unit: "",
      description: "",
      frequency: "daily",
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
  });

  async function onNewHabitSubmit(data: z.infer<typeof formSchema>) {
    const newHabit: HabitModel = {
      name: data.name,
      current_target_value: data.current_target_value,
      unit: data.unit,
      description: data.description,
      frequency_config: {
        frequency: data.frequency,
        weekdays: [
          data.monday,
          data.tuesday,
          data.wednesday,
          data.thursday,
          data.friday,
          data.saturday,
          data.sunday,
        ],
      },
      target_adaption_mode: "consent",
    };

    try {
      await addHabitAction(newHabit);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"primary"}>New Habit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px]">
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onNewHabitSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Habit</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-16 sm:max-w-[425px] m-auto">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Habit Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Drink Water"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="current_target_value"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-target-value">
                    Target Value
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value as number}
                    onChange={field.onChange}
                    id="form-rhf-demo-target-value"
                    aria-invalid={fieldState.invalid}
                    min={1}
                    max={10000}
                    type="number"
                    placeholder="12"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="unit"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-unit">Unit</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-unit"
                    aria-invalid={fieldState.invalid}
                    placeholder="dL"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <FieldLabel>Select weekdays</FieldLabel>
            <div className="flex gap-2 flex-wrap">
              {[
                { id: "monday", label: "Mo" },
                { id: "tuesday", label: "Tu" },
                { id: "wednesday", label: "We" },
                { id: "thursday", label: "Th" },
                { id: "friday", label: "Fr" },
                { id: "saturday", label: "Sa" },
                { id: "sunday", label: "Su" },
              ].map((day) => (
                <Controller
                  key={day.id}
                  name={day.id as keyof FormValues}
                  control={form.control}
                  render={({ field }) => (
                    <Button
                      type="button"
                      variant={field.value ? "default" : "secondary"}
                      size="icon"
                      className={`rounded-full w-8 h-8 ${
                        field.value
                          ? "bg-fg text-bg-dark hover:bg-fg-muted"
                          : "bg-bg-light-2 text-fg hover:bg-fg-muted/60 hover:text-fg"
                      }`}
                      onClick={() => field.onChange(!field.value)}
                    >
                      {day.label}
                    </Button>
                  )}
                />
              ))}
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" form="form-rhf-demo">
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
