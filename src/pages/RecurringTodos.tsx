import { useMutation, useQuery, useQueryClient } from "react-query";
import { addRecurringTodo, getRecurringTodos, deleteRecurringTodo } from "../Query/recurringQuery";
import { Button, Input, useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";

const useGetRecurring = (uid: string) => {
  return useQuery({ queryKey: ["Recurring", uid], queryFn: () => getRecurringTodos(uid) });
};

const useAddRecurring = (onClose: () => void, resetForm: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(addRecurringTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("Recurring");
      resetForm();
      onClose();
    },
  });
};

const useDeleteRecurring = () => {
  const qc = useQueryClient();
  return useMutation(deleteRecurringTodo, {
    onSuccess: () => qc.invalidateQueries("Recurring"),
  });
};

export default function RecurringTodos({ user }: any) {
  const { register, handleSubmit, reset } = useForm<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: recurring, isLoading } = useGetRecurring(user.uid);
  const addMutation = useAddRecurring(onClose, reset);
  const deleteMutation = useDeleteRecurring();

  const onSubmit = (formData: any) => {
    const payload = {
      ...formData,
      uid: user.uid,
      email: user.email,
      recurrence: "daily",
    };
    addMutation.mutate(payload);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <main className="app-container pt-28 pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Recurring Todos</h1>
          <p className="muted">Templates that run automatically each day</p>
        </div>
        <div>
          <Button onClick={onOpen} className="btn-accent">Add Recurring</Button>
        </div>
      </div>

      <div className="card">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {recurring?.data?.map((item: any) => (
              <li key={item.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm muted">{item.recurrence}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <button onClick={() => handleDelete(item.id)} disabled={deleteMutation.isLoading} className="text-red-500">
                    <Trash />
                  </button>
                </div>
              </li>
            ))}
            {recurring?.data?.length === 0 && <p className="muted">No recurring templates yet — add one.</p>}
          </ul>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Recurring Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input placeholder="Todo Title" {...register("title", { required: true })} />
              <Input placeholder="Optional note" {...register("note")} />
              <Button type="submit" isLoading={addMutation.isLoading} className="btn-accent">Add</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </main>
  );
}
