import React, { useState, useMemo } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const SubmissionsHistory = ({ submissions = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const parsedHistory = useMemo(() => {
    return submissions.map((sub) => {
      const ts = sub.createdAt;
      return {
        id: sub._id || sub.id,
        problemTitle: sub.problem?.title || "Problem Instance",
        status: (sub.status || "PENDING").toUpperCase(),
        language: sub.language || "Unknown",
        time: sub.time ? `${parseFloat(sub.time).toFixed(2)}s` : "0.00s",
        memory: sub.memory
          ? `${(parseFloat(sub.memory) / 1024).toFixed(1)}MB`
          : "0.0MB",
        date: ts ? new Date(ts).toLocaleDateString() : "Recent",
      };
    });
  }, [submissions]);

  const totalPages = Math.ceil(parsedHistory.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return parsedHistory.slice(start, start + itemsPerPage);
  }, [parsedHistory, currentPage]);

  const getBadgeStyle = (status) => {
    if (status === "ACCEPTED")
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (status === "WRONG_ANSWER")
      return "bg-destructive/10 text-destructive border-destructive/20";
    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  };

  const getStatusIcon = (status) => {
    if (status === "ACCEPTED") return <CheckCircle className="h-3.5 w-3.5" />;
    if (status === "WRONG_ANSWER") return <XCircle className="h-3.5 w-3.5" />;
    return <AlertCircle className="h-3.5 w-3.5" />;
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">
          Submission Log Execution Records
        </h3>
        <span className="text-xs text-muted-foreground font-semibold">
          Total traces: {parsedHistory.length}
        </span>
      </div>

      <div className="overflow-x-auto w-full border border-border/60 rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-muted/40 border-b border-border font-bold text-muted-foreground">
              <th className="p-3">Problem Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Language</th>
              <th className="p-3">Runtime</th>
              <th className="p-3">Memory</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-medium">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-muted-foreground"
                >
                  No execution historical tracks compiled yet.
                </td>
              </tr>
            ) : (
              paginatedData.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-3 font-bold text-foreground max-w-45 truncate">
                    {sub.problemTitle}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-lg font-bold text-[10px] uppercase ${getBadgeStyle(sub.status)}`}
                    >
                      {getStatusIcon(sub.status)}
                      {sub.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{sub.language}</td>
                  <td className="p-3 text-muted-foreground">{sub.time}</td>
                  <td className="p-3 text-muted-foreground">{sub.memory}</td>
                  <td className="p-3 text-muted-foreground">{sub.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1.5 border border-border rounded-xl text-xs bg-card hover:bg-muted disabled:opacity-40 transition-all cursor-pointer font-bold"
          >
            Prev
          </button>
          <span className="text-xs font-semibold text-muted-foreground mx-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1.5 border border-border rounded-xl text-xs bg-card hover:bg-muted disabled:opacity-40 transition-all cursor-pointer font-bold"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
