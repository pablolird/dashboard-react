import * as React from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Fragment } from "react";

export function Calendar24() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(undefined);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 bg-card justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          defaultValue="10:30"
          className="bg-card appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}

export default function ActivityForm() {
  return (
    <div className="w-full max-w-md p-5 rounded-md shadow-sm bg-card">
      <form className="gap-5 flex flex-col">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="checkout-7j9-optional-comments">
              Description
            </FieldLabel>
            <Textarea
              id="checkout-7j9-optional-comments"
              placeholder="Add a reformulated description of the problem"
              className="resize-none"
            />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="checkout-exp-month-ts6">Technician</FieldLabel>
            <Select defaultValue="">
              <SelectTrigger id="checkout-exp-month-ts6">
                <SelectValue placeholder="Technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technician 1">Technician 01</SelectItem>
                <SelectItem value="Technician 2">Technician 02</SelectItem>
                <SelectItem value="Technician 3">Technician 03</SelectItem>
                <SelectItem value="Technician 4">Technician 04</SelectItem>
                <SelectItem value="Technician 5">Technician 05</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Calendar24 />
        </FieldGroup>
      </form>
    </div>
  );
}
