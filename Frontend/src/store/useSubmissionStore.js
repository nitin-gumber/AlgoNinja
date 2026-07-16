import { create } from "zustand";
import { toast } from "sonner";
import { axiosClient } from "../utils/axiosClient";

export const useSubmissionStore = create((set) => ({
  isLoading: false,
  problemSubmissions: [],
  currentProblemSubmissions: [],
  problemSubmissionCount: null,

  getAllSubmission: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosClient.get(
        "/submissions/get-all-user-submissions",
      );
      set({ problemSubmissions: response.data?.data || [] });
    } catch (error) {
      console.error("Error fetching all submission:", error);
      toast.error(
        error.response?.data?.message || "Failed to load Submissions",
      );
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (id) => {
    set({ isLoading: true });
    try {
      const response = await axiosClient.get(
        `/submissions/get-user-submissions-for-problem/${id}`,
      );
      set({ currentProblemSubmissions: response.data?.submissions || [] });
      return { success: true };
    } catch (error) {
      console.error("Error fetching submissions by ID:", error);
      toast.error(
        error.response?.data?.message || "Problem Submissions unreachable.",
      );
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionCountForProblem: async (id) => {
    set({ isLoading: true, problemSubmissionCount: null });
    try {
      const response = await axiosClient.get(
        `/submissions/get-total-submissions-for-problem/${id}`,
      );
      set({ problemSubmissionCount: response.data?.totalSubmissions || 0 });
      return { success: true };
    } catch (error) {
      console.error("Error fetching submissions Counts:", error);
      toast.error(
        error.response?.data?.message ||
          "Problem Submissions Count unreachable.",
      );
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },
}));
