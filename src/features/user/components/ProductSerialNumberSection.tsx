// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form.tsx";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoggedInUserContext } from "../../../hooks/useLoggedInUserContext.ts";
import {
  deleteSerialNumber,
  addSerialNumber,
  SerialNumber,
} from "../../../api/user.ts";
import BeatLoader from "react-spinners/BeatLoader";
import { FieldValues, useForm } from "react-hook-form";
import { userKeys, userSerialNumbersQuery } from "../queries.ts";
import { strings } from "../../../utils/strings.ts";
import TrashIcon from "../../../assets/icons/icon-trash.svg?react";

const ProductSerialNumberSection = () => {
  const { loggedInUserInfo } = useLoggedInUserContext();
  const { id } = loggedInUserInfo || {};
  const queryClient = useQueryClient();
  const form = useForm();
  const { watch } = form;
  const serialNumber = watch("serialNumber");

  const deleteSerialNumberMutation = useMutation({
    mutationFn: deleteSerialNumber,
    onMutate: async ({ userId, serialNumber }) => {
      const key = userKeys.serialNumbers(userId);
      const previousData = queryClient.getQueryData<SerialNumber[]>(key);
      queryClient.setQueryData<SerialNumber[]>(key, (old) =>
        old?.filter((item) => item.serial_number !== serialNumber),
      );
      return { previousData };
    },
    onError: (_error, { userId }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          userKeys.serialNumbers(userId),
          context.previousData,
        );
      }
    },
  });

  const addSerialNumberMutation = useMutation({
    mutationFn: addSerialNumber,
    onMutate: async ({ userId, serialNumber }) => {
      const key = userKeys.serialNumbers(userId);
      await queryClient.cancelQueries({ queryKey: key });

      const previousData = queryClient.getQueryData<SerialNumber[]>(key);
      queryClient.setQueryData<SerialNumber[]>(key, (old) => [
        ...(old ?? []),
        { product_id: "", serial_number: serialNumber, user_id: userId },
      ]);
      return { previousData };
    },
    onError: (_error, { userId }, context) => {
      queryClient.setQueryData(
        userKeys.serialNumbers(userId),
        context?.previousData ?? [],
      );
    },
    onSettled: () => {
      form.reset({ serialNumber: "", selectedProduct: "" });
      if (id) {
        queryClient.invalidateQueries({
          queryKey: userKeys.serialNumbers(id),
        });
      }
    },
  });

  const { isLoading, isError, data, error } = useQuery(
    userSerialNumbersQuery(id ?? 0),
  );

  if (isError)
    return <span>{`${strings["common.error"]}: ${error.message}`}</span>;

  const handleAddSerialNumber = (formData: FieldValues) => {
    const { serialNumber } = formData;

    addSerialNumberMutation.mutate({
      userId: id!,
      serialNumber: serialNumber,
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-050 p-4 shadow-sm lg:p-5">
      <h4 className="mb-4 text-xl font-semibold text-slate-900 lg:text-2xl">
        {strings["serial.number.section.header"]}
      </h4>
      {isLoading || !data ? (
        <div className="flex justify-center py-6">
          <BeatLoader color="#123abc" loading={true} size={15} />
        </div>
      ) : data.length === 0 ? (
        <p className="py-4 text-sm text-slate-600">
          No serial numbers added yet.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">
                {strings["serial.number.table.header"]}
              </TableHead>
              <TableHead className="pr-4 text-end">
                {strings["serial.number.actions"]}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((serial: SerialNumber) => (
              <TableRow key={serial.serial_number}>
                <TableCell className="py-2 pl-4 text-start">
                  {serial.serial_number}
                </TableCell>
                <TableCell className="px-0 py-1 text-end">
                  <Button
                    variant={"secondary"}
                    size={"sm"}
                    aria-label={`Remove serial number ${serial.serial_number}`}
                    className="mt-0 w-14 hover:bg-orange-050"
                    onClick={() =>
                      deleteSerialNumberMutation.mutate({
                        userId: serial.user_id,
                        serialNumber: serial.serial_number,
                      })
                    }
                  >
                    <TrashIcon className="h-5 w-5 fill-indigo-050 stroke-indigo-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAddSerialNumber)}
          className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-4"
        >
          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Serial #"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            size={"default"}
            type="submit"
            variant={"outline"}
            className="w-20"
            disabled={!serialNumber || isLoading}
          >
            {strings["common.add"]}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProductSerialNumberSection;
