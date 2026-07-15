import React from 'react';
import { Edit2, Trash2, Tag, Calendar, AlertCircle } from 'lucide-react';

export const AdminProblemTable = ({ problems, onEditSelect, onDeleteSelect, isDarkMode }) => {
  
  console.log("Problems:", problems)

  const getDifficultyStyles = (difficulty) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'HARD':
        return 'bg-brand/10 text-brand border-brand/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (!problems || problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/60 bg-muted/10 satoshi animate-in fade-in duration-200">
        <AlertCircle className="h-10 w-10 text-muted-foreground/60 mb-3" />
        <h4 className="text-base font-bold text-foreground mb-1">No Deployed Problems</h4>
        <p className="text-sm text-muted-foreground max-w-sm">The platform database indexes are empty. Initialize or compile fresh problems into the sheets pool.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md shadow-sm satoshi">
      <table className="table w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border/60 bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
            <th className="p-4 pl-6">Problem Challenge Name</th>
            <th className="p-4">Difficulty</th>
            <th className="p-4">Category Tags</th>
            <th className="p-4">Deployed On</th>
            <th className="p-4 pr-6 text-right">Actions Dashboard</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30 text-sm font-medium">
          {problems.map((problem) => (
            <tr 
              key={problem._id} 
              className="hover:bg-muted/30 transition-colors duration-150 group"
            >
              {/* Title & Description */}
              <td className="p-4 pl-6 max-w-xs md:max-w-md">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-foreground group-hover:text-brand transition-colors duration-150 truncate">
                    {problem.title}
                  </span>
                  <span className="text-xs text-muted-foreground/80 truncate font-normal">
                    {problem.description}
                  </span>
                </div>
              </td>

              {/* Difficulty Level Badge */}
              <td className="p-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border capitalize ${getDifficultyStyles(problem.difficulty)}`}>
                  {problem.difficulty?.toLowerCase()}
                </span>
              </td>

              {/* Dynamic Categorization Tags Mapping */}
              <td className="p-4">
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {problem.tags && problem.tags.slice(0, 2).map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground border border-border/40 font-normal"
                    >
                      <Tag className="h-2.5 w-2.5 opacity-60" />
                      {tag}
                    </span>
                  ))}
                  {problem.tags && problem.tags.length > 2 && (
                    <span className="text-xs text-muted-foreground/60 pl-1 font-normal self-center">
                      +{problem.tags.length - 2} more
                    </span>
                  )}
                </div>
              </td>

              {/* Date Metadata */}
              <td className="p-4 text-xs text-muted-foreground/90 font-normal">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 opacity-50" />
                  <span>
                    {problem.createdAt ? new Date(problem.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Legacy Sync'}
                  </span>
                </div>
              </td>

              {/* Operational Trigger Action Controls */}
              <td className="p-4 pr-6 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEditSelect(problem._id)}
                    className="p-1.5 rounded-lg border border-border/60 bg-card text-foreground/80 hover:text-brand hover:border-brand/30 hover:bg-brand/5 active:scale-95 transition-all cursor-pointer focus:outline-none"
                    title="Synchronize problem shards data configuration"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteSelect(problem._id)}
                    className="p-1.5 rounded-lg border border-border/60 bg-card text-foreground/80 hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 active:scale-95 transition-all cursor-pointer focus:outline-none"
                    title="Evict problem challenge permanently from indexes"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};