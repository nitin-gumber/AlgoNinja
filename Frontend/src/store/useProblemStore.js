import { create } from "zustand";
import { axiosClient } from "../utils/axiosClient";
import { toast } from "sonner";

export const useProblemStore = create((set, get) => ({
  problems: [],
  currentProblem: null,
  solvedProblems: [],
  solvedCount: 0,
  isLoading: false,

  getAllProblems: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosClient.get("/problems/getAllProblems");
      set({ problems: res.data?.problems || [] });
    } catch (error) {
      console.error("Error fetching all problems:", error);
      toast.error(
        error.response?.data?.message || "Failed to load dojo problem sheets.",
      );
    } finally {
      set({ isLoading: false });
    }
  },

  getProblemById: async (id) => {
    set({ isLoading: true, currentProblem: null });
    try {
      const res = await axiosClient.get(`/problems/getProblem/${id}`);
      set({ currentProblem: res.data?.problem || null });
      return { success: true };
    } catch (error) {
      console.error("Error fetching problem by ID:", error);
      toast.error(
        error.response?.data?.message || "Problem profile unreachable.",
      );
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  createProblem: async (problemData) => {
    set({ isLoading: true });
    toast.loading("Compiling testcases via Judge0 sandbox...", {
      id: "problem-action",
    });
    try {
      const res = await axiosClient.post(
        "/problems/createProblem",
        problemData,
      );
      set((state) => ({ problems: [...state.problems, res.data.problem] }));
      toast.success(`${res.data?.message}🎉`, {
        id: "problem-action",
      });
      return { success: true };
    } catch (error) {
      console.error("Error creating problem:", error);
      toast.error(
        error.response?.data?.message || "Failed to deploy problem matrix.",
        { id: "problem-action" },
      );
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  updateProblem: async (id, updatedData) => {
    set({ isLoading: true });
    toast.loading("Overwriting validation metrics...", {
      id: "problem-action",
    });
    try {
      await axiosClient.put(`/problems/updateProblem/${id}`, updatedData);
      toast.success("Problem synchronized successfully.", {
        id: "problem-action",
      });
      get().getAllProblems();
      return { success: true };
    } catch (error) {
      console.error("Error updating problem:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to overwrite problem structure.",
        { id: "problem-action" },
      );
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProblem: async (id) => {
    toast.loading("Evicting problem entry...", { id: "problem-action" });
    try {
      const response = await axiosClient.delete(
        `/problems/deleteProblem/${id}`,
      );
      set((state) => ({
        problems: state.problems.filter((p) => p._id !== id),
      }));
      toast.success(response.data?.message, {
        id: "problem-action",
      });
    } catch (error) {
      console.error("Error deleting problem:", error);
      toast.error(error.response?.data?.message || "Eviction loop blocked.");
    }
  },

  getAllProblemsSolvedByUser: async () => {
    try {
      const res = await axiosClient.get("/problems/getAllProblemsSolvedByUser");
      set({ solvedProblems: res.data?.problems?.solvedProblems || [] });
    } catch (error) {
      console.error("Error fetching user solved tokens:", error);
    }
  },

  getUserSolvedProblemsCount: async () => {
    try {
      const res = await axiosClient.get("/problems/get-user-solved-count");
      set({ solvedCount: res.data?.count || 0 });
    } catch (error) {
      console.error("Error fetching score count:", error);
    }
  },
}));
