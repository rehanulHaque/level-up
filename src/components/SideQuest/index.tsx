import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getSideQuest,
  addSideQuest,
  updateSideQuestMission,
  updateSideQuestPunishment,
  deleteSideQuest,
} from "../../Query/sideQuest";
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
const useTodayMission = (uid: string) => {
  return useQuery(["SideQuest", uid], () => getSideQuest(uid));
};

// Hook to add a new side quest
const useAddMission = (onClose: () => void, resetForm: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(addSideQuest, {
    onSuccess: () => {
      queryClient.invalidateQueries("SideQuest");
      resetForm();
      onClose();
    },
    onError: (error) => {
      console.error("Error adding mission:", error);
    },
  });
};

// Hook to update side quest
const useUpdateSideQuestMission = () => {
  const queryClient = useQueryClient();
  return useMutation(updateSideQuestMission, {
    onSuccess: () => {
      queryClient.invalidateQueries("SideQuest");
    },
    onError: (error) => {
      console.error("Error updating mission:", error);
    },
  });
};

const useUpdateSideQuestPunishment = () => {
  const queryClient = useQueryClient();
  return useMutation(updateSideQuestPunishment, {
    onSuccess: () => {
      queryClient.invalidateQueries("SideQuest");
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
const useDeleteSideQuest = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteSideQuest, {
    onSuccess: () => {
      queryClient.invalidateQueries("SideQuest");
    },
    onError: (error) => {
      console.error("Error deleting mission:", error);
    },
  });
};

export default function SideQuest({ user }: TodayMissionProps) {
  const { register, handleSubmit, reset } = useForm<MissionData>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: missions, isLoading } = useTodayMission(user.uid);

  // MUTATIONS
  const addMissionMutation = useAddMission(onClose, reset);
  const updateSideQuestMission = useUpdateSideQuestMission();
  const updateSideQuestPunishment = useUpdateSideQuestPunishment();
  const updateStatsMutation = useUpdateStats();
  const deleteMissionMutation = useDeleteSideQuest();

  const handleSideQuestUpdate = (id: string) => {
    updateSideQuestMission.mutate(id);
    updateStatsMutation.mutate({ id, userId: user.uid, exp: 75 });
  };

  const handleSideQuestPunishmentUpdate = (id: string) => {
    updateSideQuestPunishment.mutate(id);
    updateStatsMutation.mutate({ id, userId: user.uid, exp: 25 });
  };

  const handleDelete = (id: string) => {
    deleteMissionMutation.mutate(id);
  };

  const handleAddMission = (formData: MissionData) => {
    const newMission = {
      ...formData,
      completedQuest: false,
      completedPunishment: false,
      exp: 75,
      punishmentExp: 25,
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
                    disabled={updateSideQuestMission.isLoading}
                  />
                  {mission.title}
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
              If you can't do the task, this is the punishment:
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
          <Button onClick={onOpen}>Add SideQuest</Button>
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
                    placeholder="Side Quest"
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
