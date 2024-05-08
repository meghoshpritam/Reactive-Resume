import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { defaultLanguage, languageSchema } from "@reactive-resume/schema";
import {
  Checkbox,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Slider,
} from "@reactive-resume/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SectionDialog } from "../sections/shared/section-dialog";

const formSchema = languageSchema;

type FormValues = z.infer<typeof formSchema>;

export const LanguagesDialog = () => {
  const form = useForm<FormValues>({
    defaultValues: defaultLanguage,
    resolver: zodResolver(formSchema),
  });

  return (
    <SectionDialog<FormValues> id="languages" form={form} defaultValues={defaultLanguage}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Name`}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Description`}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="level"
          control={form.control}
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>{t`Level`}</FormLabel>
              <FormControl className="py-2">
                <div className="flex items-center gap-x-4">
                  <Slider
                    {...field}
                    min={0}
                    max={5}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />

                  {field.value === 0 ? (
                    <span className="text-base font-bold">{t`Hidden`}</span>
                  ) : (
                    <span className="text-base font-bold">{field.value}</span>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mb-6 mt-4 grid grid-cols-1 gap-x-3 gap-y-4 sm:col-span-2 sm:grid-cols-3">
          {["read", "write", "speak"].map((type) => (
            <FormField
              key={type}
              name={
                type as
                  | "id"
                  | "visible"
                  | "name"
                  | "description"
                  | "level"
                  | "read"
                  | "write"
                  | "speak"
              }
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center ">
                  <Checkbox
                    id={`resume.languages.${type}`}
                    checked={Boolean(field.value)}
                    onCheckedChange={(checked) => {
                      field.onChange({ target: { value: checked } });
                    }}
                  />
                  <Label className="ml-2 capitalize" htmlFor={`resume.languages.${type}`}>
                    {type}
                  </Label>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    </SectionDialog>
  );
};
