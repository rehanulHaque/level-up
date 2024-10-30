import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getMainQuest,
  addMainQuest,
  updateMainQuestMission,
  updateMainQuestPunishment,
  deleteMainQuest,
} from "../../Query/mainQuest";
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

interface MissionData {
  title: string;
  completed: boolean;
  exp: number;
  email: string;
  uid: string;
  punishment: string;
}

interface TodayMissionProps {
  user: {
    displayName: string;
    email: string;
    uid: string;
  };
}

// Hook to fetch side quests
const useMainQuestMission = (uid: string) => {
  return useQuery(["MainQuest", uid], () => getMainQuest(uid));
};

// Hook to add a new side quest
const useAddMission = (onClose: () => void, resetForm: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(addMainQuest, {
    onSuccess: () => {
      queryClient.invalidateQueries("MainQuest");
      resetForm();
      onClose();
    },
    onError: (error) => {
      console.error("Error adding mission:", error);
    },
  });
};

// Hook to update side quest
const useUpdateMainQuestMission = () => {
  const queryClient = useQueryClient();
  return useMutation(updateMainQuestMission, {
    onSuccess: () => {
      queryClient.invalidateQueries("MainQuest");
    },
    onError: (error) => {
      console.error("Error updating mission:", error);
    },
  });
};

const useUpdateMainQuestPunishment = () => {
  const queryClient = useQueryClient();
  return useMutation(updateMainQuestPunishment, {
    onSuccess: () => {
      queryClient.invalidateQueries("MainQuest");
    },
    onError: (error) => {
      console.error("Error updating mission:", error);
    },
  });
};

// Hook to update stats
const useUpdateStats = () => {
  const queryClient = useQueryClient();
  return useMutation(addStats, {
    onSuccess: () => {
      queryClient.invalidateQueries("Stats");
    },
    onError: (error) => {
      console.error("Error updating stats:", error);
    },
  });
};

// Hook to delete a side quest
const useDeleteMainQuest = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteMainQuest, {
    onSuccess: () => {
      queryClient.invalidateQueries("MainQuest");
    },
    onError: (error) => {
      console.error("Error deleting mission:", error);
    },
  });
};

export default function MainQuest({ user }: TodayMissionProps) {
  const { register, handleSubmit, reset } = useForm<MissionData>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: missions, isLoading } = useMainQuestMission(user.uid);

  // MUTATIONS
  const addMissionMutation = useAddMission(onClose, reset);
  const updateSideQuestMission = useUpdateMainQuestMission();
  const updateSideQuestPunishment = useUpdateMainQuestPunishment();
  const updateStatsMutation = useUpdateStats();
  const deleteMissionMutation = useDeleteMainQuest();

  const handleSideQuestUpdate = (id: string) => {
    updateSideQuestMission.mutate(id);
    updateStatsMutation.mutate({ id, userId: user.uid, exp: 150 });
  };

  const handleSideQuestPunishmentUpdate = (id: string) => {
    updateSideQuestPunishment.mutate(id);
    updateStatsMutation.mutate({ id, userId: user.uid, exp: 50 });
  };

  const handleDelete = (id: string) => {
    deleteMissionMutation.mutate(id);
  };

  const handleAddMission = (formData: MissionData) => {
    const newMission = {
      ...formData,
      completedQuest: false,
      completedPunishment: false,
      exp: 150,
      punishmentExp: 50,
      email: user.email,
      uid: user.uid,
    };
    addMissionMutation.mutate(newMission);
  };

  return (
    <div className="ml-2 md:ml-6">
      <ul>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          missions?.data?.map((mission: any) => (
            <li key={mission.id}>
              <div className="flex justify-between items-center mb-1 md:mb-2">
                <p className="flex gap-1 items-center">
                  <input
                    type="checkbox"
                    className="disabled:cursor-not-allowed"
                    checked={mission.completedQuest}
                    onChange={() => handleSideQuestUpdate(mission.id)}
                    disabled={updateSideQuestMission.isLoading || mission.completedPunishment}
                  />
                  <span className={mission.completedPunishment ? "line-through" : ""}>{mission.title}</span>
                </p>
                <p className="flex gap-2 items-center">
                  <button
                    onClick={() => handleDelete(mission.id)}
                    className="disabled:cursor-not-allowed"
                    disabled={deleteMissionMutation.isLoading}
                  >
                    <Trash className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                  <span className="text-xs">Exp: {mission.exp}+</span>
                </p>
              </div>
              <p className="text-xs text-gray-400">
                If you can't do this in the given time, this is the punishment:
              </p>
              <div className="flex justify-between items-center mb-1 md:mb-2">
                <p className="flex gap-1 items-center">
                  <input
                    type="checkbox"
                    checked={mission.completedPunishment}
                    onChange={() => handleSideQuestPunishmentUpdate(mission.id)}
                    disabled={updateSideQuestPunishment.isLoading || mission.completedQuest}
                  />
                  <span className={mission.completedQuest ? "line-through" : ""}>{mission.punishment}</span>
                </p>
                <span className="text-xs">Exp: {mission.punishmentExp}+</span>
              </div>
              <hr />
            </li>
          ))
        )}
        <div className="mt-8 mb-4">
          <Button onClick={onOpen}>Add MainQuest</Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New Todo</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form
                  onSubmit={handleSubmit(handleAddMission)}
                  className="flex flex-col gap-4"
                >
                  <Input
                    placeholder="Main Quest"
                    {...register("title", { required: true })}
                  />
                  <Input
                    placeholder="Punishment"
                    {...register("punishment", { required: true })}
                  />
                  <Button
                    variant="solid"
                    type="submit"
                    isLoading={addMissionMutation.isLoading}
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
