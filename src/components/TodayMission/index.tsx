import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addTodayMission,
  deleteTodayMission,
  getTodayMission,
  updateTodayMission,
} from "../../Query/query";
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
import { addStats } from "../../Query/stats";

// Type for TodayMission
interface MissionData {
  title: string;
  completed: boolean;
  exp: number;
  email: string;
  uid: string;
}

interface TodayMissionProps {
  user: {
    displayName: string;
    email: string;
    uid: string;
  };
}

// Custom hook for fetching today's missions
const useTodayMission = (uid: string) => {
  return useQuery({
    queryKey: ["TodayMission", uid],
    queryFn: () => getTodayMission(uid),
  });
};

// Custom hook for adding a new mission
const useAddMission = (onClose: () => void, resetForm: () => void) => {
  const queryClient = useQueryClient();

  return useMutation(addTodayMission, {
    onSuccess: () => {
      queryClient.invalidateQueries("TodayMission");
      resetForm(); // Reset form after successful submission
      onClose(); // Close the modal
    },
    onError: (error) => {
      console.error("Error adding mission:", error);
    },
  });
};

const useUpdateMission = () => {
  const queryClient = useQueryClient();

  return useMutation(updateTodayMission, {
    onSuccess: () => {
      queryClient.invalidateQueries("TodayMission");
    },
    onError: (error) => {
      console.error("Error Updating mission:", error);
    },
  });
};

const useUpdateStats = () => {
  const queryClient = useQueryClient();

  return useMutation(addStats, {

    onSuccess: () => {
      queryClient.invalidateQueries("Stats");
    },
    onError: (error) => {
      console.error("Error Updating mission:", error);
    },
  });
};

const useDeleteMission = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteTodayMission, {
    onSuccess: () => {
      queryClient.invalidateQueries("TodayMission");
    },
    onError: (error) => {
      console.error("Error Deleting mission:", error);
    },
  });
};

export default function TodayMission({ user }: TodayMissionProps) {
  const { register, handleSubmit, reset } = useForm<MissionData>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch today's missions
  const { data: missions, isLoading } = useTodayMission(user.uid);

  // Mutation for adding a new mission
  const mutation = useAddMission(onClose, reset);
  const updateMutation = useUpdateMission();
  const updateStatsMutation = useUpdateStats();
  const deleteMutation = useDeleteMission();

  // Handler for form submission
  const addTodo = (formData: MissionData) => {
    const newMission = {
      ...formData,
      completed: false,
      exp: 15,
      email: user.email,
      uid: user.uid,
    };
    mutation.mutate(newMission);
  };

  const handelUpdate = async (id: any) => {
    updateMutation.mutate(id);
    updateStatsMutation.mutate({id, userId: user.uid, exp: 15});
  };

  const handelDelete = async (id: any) => {
    deleteMutation.mutate(id);
  };
  const currentTime = new Date().getTime();
  const isExpired = missions?.data?.map((item: any) => {
    const missionTime = new Date(item.timestamp.toMillis()).getTime();
    const expired = currentTime - missionTime > 24 * 60 * 60 * 1000
    return {expired, id: item.id}
  })
  // console.log(isExpired)
  isExpired?.forEach((item: any) =>{
    if(item.expired){
      handelDelete(item.id)
    }
  })

  return (
    <div className="ml-2 md:ml-6">
      <ul>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          missions?.data?.map((item: any) => (
            <li
              key={item.id}
              className="flex justify-between items-center mb-1 md:mb-2"
            >
              <p className="flex gap-1 items-center">
                <input
                  type="checkbox"
                  className="disabled:cursor-not-allowed"
                  checked={item.completed}
                  onChange={() => handelUpdate(item.id)}
                  disabled={updateMutation.isLoading}
                />
                {item.title}
              </p>
              {/* <p>{item.timestamp.toMillis()}</p> */}
              <p className="flex gap-2 items-center">
                <button onClick={() => handelDelete(item.id)} className="disabled:cursor-not-allowed" disabled={deleteMutation.isLoading} >
                  <Trash className="h-4 w-4 md:h-5 md:w-5" />
                </button>
                <span className="text-xs">Exp: {item.exp}+</span>
              </p>
            </li>
          ))
        )}
        <div className="mt-8">
          <Button onClick={onOpen}>Add Todo</Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New Todo</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form
                  onSubmit={handleSubmit(addTodo)}
                  className="flex flex-col gap-4"
                >
                  <Input
                    placeholder="Todo Title"
                    {...register("title", { required: true })}
                  />
                  <Button
                    variant="solid"
                    type="submit"
                    isLoading={mutation.isLoading}
                  >
                    Add
                  </Button>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      </ul>
    </div>
  );
}
