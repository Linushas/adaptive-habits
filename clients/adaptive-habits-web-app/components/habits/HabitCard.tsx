import { Slider } from "../ui/slider";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../ui/card";

interface HabitCardProps {
    title: string;
    value: number;
    targetValue: number;
    unit: string;
    className?: string;
}

export function HabitCard({ title, value, targetValue, unit, className }: HabitCardProps) {
    return (
        <Card className={`${className} w-fit min-w-sm p-4 flex-1`}>
            <CardTitle>
                <div className="flex items-center justify-between">
                    <h3>{title}</h3>
                    <p>{value} / {targetValue} {unit}</p>
                </div>
            </CardTitle>
            <CardContent className="pb-8 pt-2">
                <Slider
                    defaultValue={[value]}
                    min={0}
                    max={targetValue}
                    className="min-w-full"
                />
            </CardContent>
        </Card>
    );
}