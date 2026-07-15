import React, { useState } from "react";
import { useProblemStore } from "../../../store/useProblemStore";
import { AlertTriangle, Loader2, X } from "lucide-react";

export const DeleteConfirmModal = ({ problemId, onClose, isDarkMode }) => {
  const [isEvicting, setIsEvicting] = useState(false);
  const { deleteProblem } = useProblemStore();

  const handleConfirmEviction = async () => {
    if (!problemId) return;
    try {
      setIsEvicting(true);
      // Calls your active problem store action sequence
      await deleteProblem(problemId);
      onClose();
    } catch (err) {
      console.error("Eviction lifecycle chain failure:", err);
    } finally {
      setIsEvicting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Wrapper Panel Box */}
      <div
        className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 satoshi"
        style={{
          backgroundColor: isDarkMode
            ? "var(--color-card)"
            : "var(--background)",
        }}
      >
        {/* Header Exit Cross Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isEvicting}
          className="absolute top-4 right-4 p-1.5 rounded-xl border border-border/60 bg-card text-muted-foreground hover:text-foreground active:scale-95 transition-all cursor-pointer disabled:opacity-40"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Informative Icon Layout Column */}
        <div className="flex flex-col items-center text-center mt-2">
          <div className="h-12 w-12 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-4">
            <AlertTriangle
              className="h-5 w-5 animate-bounce"
              style={{ animationDuration: "3s" }}
            />
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2 arp-display">
            Confirm Challenge Eviction
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed px-2">
            Are you completely certain you want to erase this data element
            model? This process will delete the entity entry, testcase arrays,
            and solution matrices permanently from all platform indices.
          </p>
        </div>

        {/* Functional Control Form Action Bars Row */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/40">
          <button
            type="button"
            disabled={isEvicting}
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl border border-border bg-card text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer focus:outline-none disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isEvicting}
            onClick={handleConfirmEviction}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl text-white bg-brand hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none disabled:opacity-50"
          >
            {isEvicting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Evicting...</span>
              </>
            ) : (
              <span>Confirm Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
