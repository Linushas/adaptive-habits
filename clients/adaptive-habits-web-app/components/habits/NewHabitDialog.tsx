"use client";

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { HabitModel } from "@/types";
import { Button } from "../ui/button";
import { addHabitAction } from "@/app/actions";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";

const formSchema = z.object({
    name: z
        .string()
        .min(0, "Habit name must be at least 5 characters.")
        .max(50, "Habit name must be at most 32 characters."),
    current_target_value: z.coerce
        .number()
        .min(1, "Target value must be at least 20.")
        .max(100, "Target value must be at least 100."),
    unit: z
        .string()
        .min(0, "Unit must be at least 0 characters.")
        .max(50, "Unit must be at most 50 characters."),
})

export function NewHabitDialog() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            current_target_value: 1,
            unit: ""
        },
    })

    async function onNewHabitSubmit(data: z.infer<typeof formSchema>) {
        const newHabit: HabitModel = {
            name: data.name,
            current_target_value: data.current_target_value,
            unit: data.unit
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
                <Button variant={"primary"}>
                    New Habit
                </Button>
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
                                        max={100}
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
                                    <FieldLabel htmlFor="form-rhf-demo-unit">
                                        Unit
                                    </FieldLabel>
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
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit" form="form-rhf-demo">Confirm</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}